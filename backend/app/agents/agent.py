# from dotenv import load_dotenv
# import os
# import json
# import asyncio

# from livekit import agents
# from livekit.agents import AgentServer, AgentSession, Agent, inference, room_io, TurnHandlingOptions, RoomInputOptions
# from livekit.plugins import noise_cancellation, silero, langchain, openai, cartesia, deepgram
# import livekit.plugins.langchain.langgraph as lk_langgraph

# # -----------------------------------------------------------------------------------
# # MONKEY-PATCH: Fix LiveKit LangChain Plugin ChoiceDelta Pydantic ValidationError
# # Handles LangChain >= 0.2.x where msg.text is a bound method instead of a str attribute.
# # -----------------------------------------------------------------------------------
# _orig_to_chat_chunk = lk_langgraph._to_chat_chunk

# def _fixed_to_chat_chunk(msg):
#     if hasattr(msg, "content"):
#         raw = getattr(msg, "content", None)
#         if callable(raw):
#             raw = raw()
#         if isinstance(raw, str) and raw:
#             return lk_langgraph.llm.ChatChunk(
#                 id=getattr(msg, "id", None) or lk_langgraph.utils.shortuuid("LC_"),
#                 delta=lk_langgraph.llm.ChoiceDelta(role="assistant", content=raw),
#             )
#         elif isinstance(raw, list):
#             text_parts = [item if isinstance(item, str) else item.get("text", "") for item in raw if isinstance(item, (str, dict))]
#             text = "".join(text_parts).strip()
#             if text:
#                 return lk_langgraph.llm.ChatChunk(
#                     id=getattr(msg, "id", None) or lk_langgraph.utils.shortuuid("LC_"),
#                     delta=lk_langgraph.llm.ChoiceDelta(role="assistant", content=text),
#                 )
#     if hasattr(msg, "text"):
#         t = getattr(msg, "text")
#         if callable(t):
#             t = t()
#         if isinstance(t, str) and t:
#             return lk_langgraph.llm.ChatChunk(
#                 id=getattr(msg, "id", None) or lk_langgraph.utils.shortuuid("LC_"),
#                 delta=lk_langgraph.llm.ChoiceDelta(role="assistant", content=t),
#             )
#     return _orig_to_chat_chunk(msg)

# lk_langgraph._to_chat_chunk = _fixed_to_chat_chunk

# from app.agents.graph import create_workflow

# load_dotenv()
# load_dotenv(".env")
# load_dotenv(".env.local")


# class Assistant(Agent):
#     def __init__(self) -> None:
#         super().__init__(
#             instructions="""You are a helpful voice AI assistant.
#             You eagerly assist users with their questions by providing information from your extensive knowledge.
#             Your responses are concise, to the point, and without any complex formatting or punctuation including emojis, asterisks, or other symbols.
#             You are curious, friendly, and have a sense of humor.
#             You are a professional interviewer conducting a job interview. 
#             The LangGraph workflow will drive the conversation flow.
#             Simply speak the questions and responses as they come from the graph. 
#             Be conversational, professional, and helpful throughout the interview process."""
#         )


# server = AgentServer()


# @server.rtc_session()
# async def my_agent(ctx: agents.JobContext):
#     # Parse session_id from room name. Room name format is {session_id}-{interview_id}
#     room_name = ctx.room.name
#     parts = room_name.split("-")
#     session_id = parts[0]
    
#     candidate_id = "default-candidate"
#     questions = []

#     # Query database for interview details and candidate details
#     from app.db.session import async_session
#     from app.models.session import InterviewSession
#     from app.models.question import Question
#     from sqlalchemy import select

#     try:
#         async with async_session() as session:
#             # Query session to find candidate and interview link
#             stmt = select(InterviewSession).where(InterviewSession.id == session_id)
#             res = await session.execute(stmt)
#             sess = res.scalars().first()
#             if sess:
#                 candidate_id = sess.candidate_id
#                 # Fetch questions
#                 q_stmt = select(Question).where(Question.interview_id == sess.interview_id).order_by(Question.position)
#                 q_res = await session.execute(q_stmt)
#                 questions = [q.text for q in q_res.scalars().all()]
#                 print(f"Loaded {len(questions)} dynamic questions for session {session_id} from DB.")
#             else:
#                 print(f"Session {session_id} not found in DB. Falling back to default questions.")
#     except Exception as exc:
#         print(f"Error querying DB in agent session start: {exc}. Falling back.")

#     if not questions:
#         questions = [
#             "Hello! Thank you for joining us today. Let's start with the basics - could you tell me about yourself? Please share your background, what you're passionate about, and what brings you here today.",
#             "That's great to hear! Now, I'd love to learn about your technical background. Could you tell me about your experience with technology? What technologies, programming languages, or technical projects have you worked with?",
#             "Excellent! Now, I'd like to hear about a time when you faced a significant challenge, either technical or professional. Could you walk me through the situation, what obstacles you encountered, and how you overcame them? What did you learn from that experience?",
#             "Thank you for sharing that with me. Now, I'd like to give you the opportunity to ask me anything about our company, the role, or anything else you'd like to know. What questions do you have for me?"
#         ]

#     # Create dynamic workflow using the scoped closures
#     lg_llm = langchain.LLMAdapter(graph=create_workflow(
#         session_id=session_id,
#         candidate_id=candidate_id,
#         questions_list=questions
#     ))

#     stt_plugin = deepgram.STT(model="nova-3") if os.getenv("DEEPGRAM_API_KEY") else inference.STT(model="deepgram/nova-3", language="multi")
#     if os.getenv("CARTESIA_API_KEY"):
#         tts_plugin = cartesia.TTS(
#             model=os.getenv("CARTESIA_MODEL", "sonic-3"),
#             voice=os.getenv("CARTESIA_VOICE_ID") or "f786b574-daa5-4673-aa0c-cbe3e8534c02",
#             language="en",
#         )
#     else:
#         tts_plugin = inference.TTS(model="cartesia/sonic-3")

#     session = AgentSession(
#         stt=stt_plugin,
#         llm=lg_llm,
#         tts=tts_plugin,
#         vad=silero.VAD.load(),
#         turn_handling=TurnHandlingOptions(
#             turn_detection=inference.TurnDetector(),
#         ),
#     )

#     print(f"Starting AgentSession for room {room_name}.")
#     await session.start(
#         room=ctx.room,
#         agent=Assistant(),
#         room_options=room_io.RoomOptions(
#             audio_input=room_io.AudioInputOptions(
#                 noise_cancellation=noise_cancellation.BVC(),
#             ),
#         ),
#     )
#     print(f"AgentSession started for room {room_name}; generating initial reply.")

#     try:
#         await asyncio.wait_for(
#             session.generate_reply(
#                 instructions="Greet the user and offer your assistance."
#             ),
#             timeout=45,
#         )
#         print(f"Initial reply generated for room {room_name}.")
#     except asyncio.TimeoutError:
#         print(f"Initial reply timed out for room {room_name}; check Gemini/graph/TTS provider logs.")
#     except Exception as exc:
#         print(f"Initial reply failed for room {room_name}: {exc!r}")


# if __name__ == "__main__":
#     agents.cli.run_app(server)


from dotenv import load_dotenv
import os
import json
import asyncio

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent, inference, room_io, TurnHandlingOptions
from livekit.plugins import silero, langchain, openai, cartesia, deepgram
import livekit.plugins.langchain.langgraph as lk_langgraph

from livekit.agents import WorkerOptions, cli

load_dotenv()
load_dotenv(".env")
load_dotenv(".env.local")

# -----------------------------------------------------------------------------------
# MONKEY-PATCH: Fix LiveKit LangChain Plugin ChoiceDelta Pydantic ValidationError
# -----------------------------------------------------------------------------------
_orig_to_chat_chunk = lk_langgraph._to_chat_chunk

def _fixed_to_chat_chunk(msg):
    if hasattr(msg, "content"):
        raw = getattr(msg, "content", None)
        if callable(raw):
            raw = raw()
        if isinstance(raw, str) and raw:
            return lk_langgraph.llm.ChatChunk(
                id=getattr(msg, "id", None) or lk_langgraph.utils.shortuuid("LC_"),
                delta=lk_langgraph.llm.ChoiceDelta(role="assistant", content=raw),
            )
        elif isinstance(raw, list):
            text_parts = [item if isinstance(item, str) else item.get("text", "") for item in raw if isinstance(item, (str, dict))]
            text = "".join(text_parts).strip()
            if text:
                return lk_langgraph.llm.ChatChunk(
                    id=getattr(msg, "id", None) or lk_langgraph.utils.shortuuid("LC_"),
                    delta=lk_langgraph.llm.ChoiceDelta(role="assistant", content=text),
                )
    if hasattr(msg, "text"):
        t = getattr(msg, "text")
        if callable(t):
            t = t()
        if isinstance(t, str) and t:
            return lk_langgraph.llm.ChatChunk(
                id=getattr(msg, "id", None) or lk_langgraph.utils.shortuuid("LC_"),
                delta=lk_langgraph.llm.ChoiceDelta(role="assistant", content=t),
            )
    return _orig_to_chat_chunk(msg)

lk_langgraph._to_chat_chunk = _fixed_to_chat_chunk

from app.agents.graph import create_workflow


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a professional AI interviewer conducting a job interview.
            Keep your responses concise, conversational, and direct for audio output.
            Do not use emojis, markdown tables, asterisks, or special characters.
            Speak clearly and guide the candidate through the interview.
            You are a real-time conversational AI interviewer.
            - Never read internal tool execution messages or database status aloud.
            - Keep your responses short, natural, and limited to 1-2 sentences.
            - Immediately acknowledge the candidate's answer and ask the next relevant question."""
        )


server = AgentServer()


@server.rtc_session()
async def my_agent(ctx: agents.JobContext):
    # 1. Correct UUID Session ID parsing
    room_name = ctx.room.name
    is_practice = room_name.startswith("practice-")
    if is_practice:
        session_id = room_name.removeprefix("practice-")
    elif "-int-" in room_name:
        session_id = room_name.rsplit("-int-", 1)[0]
    else:
        session_id = room_name

    candidate_id = "default-candidate"
    questions = []

    # 2. Database query with full session_id
    from app.db.session import async_session
    from app.models.session import InterviewSession
    from app.models.practice import PracticeSession
    from app.models.question import Question
    from sqlalchemy import select

    try:
        async with async_session() as session_db:
            if is_practice:
                stmt = select(PracticeSession).where(PracticeSession.id == session_id)
            else:
                stmt = select(InterviewSession).where(InterviewSession.id == session_id)
            res = await session_db.execute(stmt)
            sess = res.scalars().first()
            if sess:
                candidate_id = sess.candidate_id
                if is_practice:
                    from app.services.practice_service import DOMAIN_QUESTIONS_FALLBACK
                    questions = DOMAIN_QUESTIONS_FALLBACK.get(
                        sess.topic,
                        DOMAIN_QUESTIONS_FALLBACK["Python Backend"],
                    )[:sess.total_questions]
                else:
                    q_stmt = select(Question).where(Question.interview_id == sess.interview_id).order_by(Question.position)
                    q_res = await session_db.execute(q_stmt)
                    questions = [q.text for q in q_res.scalars().all()]
                print(f"Loaded {len(questions)} dynamic questions for session {session_id} from DB.")
            else:
                print(f"Session {session_id} not found in DB. Falling back to default questions.")
    except Exception as exc:
        print(f"Error querying DB in agent session start: {exc}. Falling back.")

    if not questions:
        questions = [
            "Hello! Thank you for joining us today. Let's start with the basics - could you tell me about yourself?",
            "That's great! Could you tell me about your technical experience and projects you've worked on?",
            "Excellent! Tell me about a significant challenge you faced and how you solved it.",
            "Do you have any questions for me about our company or the role?"
        ]

    # 3. LangGraph Workflow LLM Adapter
    lg_llm = langchain.LLMAdapter(graph=create_workflow(
        session_id=session_id,
        candidate_id=candidate_id,
        questions_list=questions
    ))

    # 4. Plugins Configuration (STT & TTS)
    stt_plugin = deepgram.STT(model="nova-3") if os.getenv("DEEPGRAM_API_KEY") else inference.STT(model="deepgram/nova-3")
    
    # Direct reliable Deepgram TTS
    if os.getenv("DEEPGRAM_API_KEY"):
        tts_plugin = deepgram.TTS(model="aura-helios-en")
    elif os.getenv("CARTESIA_API_KEY"):
        tts_plugin = cartesia.TTS(model="sonic", voice="79a125e8-cd45-4c13-8a67-188112f4dd22")
    else:
        tts_plugin = inference.TTS(model="cartesia/sonic-2")

    vad_plugin = silero.VAD.load(
            min_speech_duration=0.1,
            min_silence_duration=0.55,
            prefix_padding_duration=0.2,
        )

    # 5. AgentSession Initialization (vad_plugin pass karein)
    session = AgentSession(
        stt=stt_plugin,
        llm=lg_llm,
        tts=tts_plugin,
        vad=vad_plugin,
        turn_handling=TurnHandlingOptions(
            turn_detection=inference.TurnDetector(),
        ),
    )

    print(f"Starting AgentSession for room {room_name}.")
    await session.start(
        room=ctx.room,
        agent=Assistant(),
    )
    print(f"AgentSession started for room {room_name}; generating initial reply.")

    try:
        await session.generate_reply(
            instructions="Welcome the candidate warmly and ask them to introduce themselves."
        )
        print(f"Initial reply generated for room {room_name}.")
    except Exception as exc:
        print(f"Initial reply failed for room {room_name}: {exc!r}")


# if __name__ == "__main__":
#     agents.cli.run_app(server)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            # Render Free Tier ke liye process count aur load threshold optimize karein:
            num_idle_processes=0,       # Idle fork band karein taaki startup load na badhe
            load_threshold=0.99,        # Threshold badhayein taaki container mark available rahe
            prewarm_fnc=None,           # Startup freeze aur time-out warning se bachne ke liye
        )
    )