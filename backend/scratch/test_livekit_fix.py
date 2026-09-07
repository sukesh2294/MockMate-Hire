from langchain_core.messages import AIMessage
from livekit.plugins.langchain.langgraph import _to_chat_chunk

msg = AIMessage(content="Hello candidate, welcome to the interview!")
print("Testing _to_chat_chunk with AIMessage...")
chunk = _to_chat_chunk(msg)
print("Result chunk:", chunk)
assert chunk is not None
assert chunk.delta.content == "Hello candidate, welcome to the interview!"
print("SUCCESS: Fix verified!")
