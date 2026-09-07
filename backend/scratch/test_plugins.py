from dotenv import load_dotenv
import os
load_dotenv(".env")
load_dotenv(".env.local")

from livekit.plugins import deepgram, cartesia

print("DEEPGRAM_API_KEY:", os.getenv("DEEPGRAM_API_KEY")[:6] + "..." if os.getenv("DEEPGRAM_API_KEY") else "Missing")
print("CARTESIA_API_KEY:", os.getenv("CARTESIA_API_KEY")[:6] + "..." if os.getenv("CARTESIA_API_KEY") else "Missing")

try:
    stt_inst = deepgram.STT(model="nova-3")
    print("SUCCESS: deepgram.STT initialized")
except Exception as e:
    print("FAILED deepgram.STT:", e)

try:
    tts_inst = cartesia.TTS(model="sonic-english", voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc")
    print("SUCCESS: cartesia.TTS initialized")
except Exception as e:
    print("FAILED cartesia.TTS:", e)
