from dotenv import load_dotenv
import os
import json
import asyncio

from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent, inference, room_io, TurnHandlingOptions, RoomInputOptions
from livekit.plugins import noise_cancellation, silero, langchain, openai, cartesia, deepgram
from livekit.plugins.turn_detector.multilingual import MultilingualModel

from app.agents.graph import create_workflow

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a helpful voice AI assistant.
            You eagerly assist users with their questions by providing information from your extensive knowledge.
            Your responses are concise, to the point, and without any complex formatting or punctuation including emojis, asterisks, or other symbols.
            You are curious, friendly, and have a sense of humor.
            You are a professional interviewer conducting a job interview. 
            The LangGraph workflow will drive the conversation flow.
            Simply speak the questions and responses as they come from the graph. 
            Be conversational, professional, and helpful throughout the interview process."""
        )


server = AgentServer()


@server.rtc_session(agent_name="Virento Hire-agent")
async def my_agent(ctx: agents.JobContext):
    # Parse session_id from room name. Room name format is {session_id}-{interview_id}
    room_name = ctx.room.name
    parts = room_name.split("-")
    session_id = parts[0]
    
    candidate_id = "default-candidate"
    questions = []

    # Query database for interview details and candidate details
    from app.db.session import async_session
    from app.models.session import InterviewSession
    from app.models.question import Question
    from sqlalchemy import select

    try:
        async with async_session() as session:
            # Query session to find candidate and interview link
            stmt = select(InterviewSession).where(InterviewSession.id == session_id)
            res = await session.execute(stmt)
            sess = res.scalars().first()
            if sess:
                candidate_id = sess.candidate_id
                # Fetch questions
                q_stmt = select(Question).where(Question.interview_id == sess.interview_id).order_by(Question.position)
                q_res = await session.execute(q_stmt)
                questions = [q.text for q in q_res.scalars().all()]
                print(f"Loaded {len(questions)} dynamic questions for session {session_id} from DB.")
            else:
                print(f"Session {session_id} not found in DB. Falling back to default questions.")
    except Exception as exc:
        print(f"Error querying DB in agent session start: {exc}. Falling back.")

    if not questions:
        questions = [
            "Hello! Thank you for joining us today. Let's start with the basics - could you tell me about yourself? Please share your background, what you're passionate about, and what brings you here today.",
            "That's great to hear! Now, I'd love to learn about your technical background. Could you tell me about your experience with technology? What technologies, programming languages, or technical projects have you worked with?",
            "Excellent! Now, I'd like to hear about a time when you faced a significant challenge, either technical or professional. Could you walk me through the situation, what obstacles you encountered, and how you overcame them? What did you learn from that experience?",
            "Thank you for sharing that with me. Now, I'd like to give you the opportunity to ask me anything about our company, the role, or anything else you'd like to know. What questions do you have for me?"
        ]

    # Create dynamic workflow using the scoped closures
    lg_llm = langchain.LLMAdapter(graph=create_workflow(
        session_id=session_id,
        candidate_id=candidate_id,
        questions_list=questions
    ))

    session = AgentSession(
        stt=inference.STT(model="deepgram/nova-3", language="multi"),
        llm=lg_llm,
        tts=inference.TTS(
            model="cartesia/sonic-3",
            voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        ),
        vad=silero.VAD.load(),
        turn_handling=TurnHandlingOptions(
            turn_detection=MultilingualModel(),
        ),
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=noise_cancellation.BVC(),
            ),
        ),
    )

    await session.generate_reply(
        instructions="Greet the user and offer your assistance."
    )


if __name__ == "__main__":
    agents.cli.run_app(server)