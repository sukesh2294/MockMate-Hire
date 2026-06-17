# graph.py
from dotenv import load_dotenv
import os
from typing import TypedDict, Annotated, Sequence
from operator import add as add_messages

from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, ToolMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.tools import tool

load_dotenv(".env.local")

# Cached global vectorstore to prevent reloading and re-indexing on every session
_vectorstore = None


def get_vectorstore() -> Chroma:
    global _vectorstore
    if _vectorstore is not None:
        return _vectorstore

    embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
    
    # Paths resolved relative to this module directory (backend/app/agents/)
    base_dir = os.path.dirname(os.path.dirname(__file__))
    pdf_path = os.getenv("COMPANY_PDF_PATH", os.path.join(base_dir, "rag", "TechCompanyInfo.pdf"))
    persist_directory = os.getenv("CHROMA_DIR", os.path.join(base_dir, "rag", "chroma_store"))

    if os.path.exists(persist_directory) and len(os.listdir(persist_directory)) > 0:
        print(f"Loading cached company vectorstore from {persist_directory}")
        _vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings,
            collection_name="company_info",
        )
    else:
        print(f"No cache found. Indexing company PDF from {pdf_path}")
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(
                f"PDF file not found: {pdf_path}. Please set COMPANY_PDF_PATH environment variable."
            )
        pages = PyPDFLoader(pdf_path).load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        pages_split = text_splitter.split_documents(pages)
        os.makedirs(persist_directory, exist_ok=True)
        _vectorstore = Chroma.from_documents(
            documents=pages_split,
            embedding=embeddings,
            persist_directory=persist_directory,
            collection_name="company_info",
        )
    return _vectorstore


# -------------------- Build your Interview RAG pipeline --------------------
def create_workflow(session_id: str, candidate_id: str, questions_list: list[str]):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash"
    )

    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 2})

    @tool
    def company_info_tool(query: str) -> str:
        """Searches the company information document and returns relevant chunks about the company."""
        docs = retriever.invoke(query)
        if not docs:
            return "No relevant information found in the company documents."
        result_parts = []
        for i, doc in enumerate(docs):
            info_number = i + 1
            content = doc.page_content
            formatted_info = f"Info {info_number}:\n{content}"
            result_parts.append(formatted_info)
        return "\n\n".join(result_parts)

    @tool
    async def record_answer_tool(answer: str) -> str:
        """Records the candidate's answer to the database."""
        from app.db.session import async_session
        from app.models.answer import Answer
        from app.models.question import Question
        from app.models.session import InterviewSession
        from sqlalchemy import select

        try:
            async with async_session() as session:
                # Find the session details
                res = await session.execute(
                    select(InterviewSession).where(InterviewSession.id == session_id)
                )
                interview_session = res.scalars().first()
                if not interview_session:
                    return "Session not found in DB."

                # Get all questions sorted by position
                q_res = await session.execute(
                    select(Question)
                    .where(Question.interview_id == interview_session.interview_id)
                    .order_by(Question.position)
                )
                questions = q_res.scalars().all()

                # Count how many answers have already been recorded for this session
                ans_res = await session.execute(
                    select(Answer).where(Answer.session_id == session_id)
                )
                answers_count = len(ans_res.scalars().all())

                # Associate the answer with the correct question_id
                if answers_count < len(questions):
                    question_id = questions[answers_count].id
                else:
                    question_id = questions[-1].id if questions else None

                if not question_id:
                    return "Cannot record answer: No active question matched in database."

                db_answer = Answer(
                    session_id=session_id,
                    question_id=question_id,
                    candidate_id=candidate_id,
                    text=answer,
                )
                session.add(db_answer)
                await session.commit()
                print(f"Recorded answer to DB: question_id={question_id}, session_id={session_id}")
                return "Answer recorded to database successfully!"
        except Exception as exc:
            print(f"DB Error inside record_answer_tool: {exc}")
            return f"Error recording answer to database: {exc}"

    tools = [company_info_tool, record_answer_tool]
    llm = llm.bind_tools(tools)

    class InterviewState(TypedDict):
        messages: Annotated[Sequence[BaseMessage], add_messages]

    def decide_next_action(state: InterviewState) -> str:
        """Decide what to do next: tool_executor or end"""
        last = state["messages"][-1]
        if hasattr(last, "tool_calls") and last.tool_calls and len(last.tool_calls) > 0:
            return "tool_executor"
        return "end"

    def call_llm(state: InterviewState) -> InterviewState:
        """Main LLM call that handles the interview conversation."""
        # Dynamically build structured questions from the interview list
        questions_str = ""
        for i, q in enumerate(questions_list, start=1):
            questions_str += f"{i}. Question {i}: '{q}'\n"

        if not questions_str:
            questions_str = (
                "1. Question 1: 'Hello! Thank you for joining us today. Let's start with the basics - could you tell me about yourself?'\n"
                "2. Question 2: 'Describe a challenging problem you solved.'\n"
                "3. Question 3: 'How do you ensure quality in your work?'\n"
            )

        system_prompt = (
            "You are a professional interviewer conducting a job interview. "
            "You will ask structured questions in this order:\n"
            f"{questions_str}\n"
            "IMPORTANT ROUTING RULES:\n"
            "- When the candidate asks questions about the company (mission, culture, revenue, etc.), use the company_info_tool to find relevant information\n"
            "- When the candidate gives answers to your interview questions, use the record_answer_tool to record their response, then acknowledge it and ask the next question\n"
            "- Be conversational, professional, and helpful\n"
            "- If you don't have specific company information, say so honestly and offer to connect them with someone who might know more"
        )
        
        msgs = [SystemMessage(content=system_prompt)] + list(state["messages"])
        message = llm.invoke(msgs)
        return {"messages": [message]}

    def tool_executor(state: InterviewState) -> InterviewState:
        """Execute tool calls from the LLM's response."""
        import asyncio
        tool_calls = state["messages"][-1].tool_calls
        results = []

        for tool_call in tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call.get("args", {})
            
            print(f"Running tool: {tool_name}")

            if tool_name == "company_info_tool":
                result = company_info_tool.invoke(tool_args)
            elif tool_name == "record_answer_tool":
                # record_answer_tool is an async function, we need to run it in the event loop
                try:
                    loop = asyncio.get_event_loop()
                except RuntimeError:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)

                if loop.is_running():
                    # If the event loop is already running, run it as a future
                    future = asyncio.run_coroutine_threadsafe(record_answer_tool.ainvoke(tool_args), loop)
                    result = future.result()
                else:
                    result = loop.run_until_complete(record_answer_tool.ainvoke(tool_args))
            else:
                result = f"Unknown tool: {tool_name}"

            tool_message = ToolMessage(
                tool_call_id=tool_call["id"],
                name=tool_name,
                content=str(result),
            )
            results.append(tool_message)

        print("All tools finished running.")
        return {"messages": results}

    # Build the interview graph
    graph = StateGraph(InterviewState)
    
    # Add nodes
    graph.add_node("llm", call_llm)
    graph.add_node("tool_executor", tool_executor)
    
    # Set up the flow
    graph.set_entry_point("llm")
    
    # Conditional edges from LLM
    graph.add_conditional_edges(
        "llm", 
        decide_next_action, 
        {
            "tool_executor": "tool_executor",
            "end": END
        }
    )
    
    # From tool_executor back to LLM
    graph.add_edge("tool_executor", "llm")

    return graph.compile()