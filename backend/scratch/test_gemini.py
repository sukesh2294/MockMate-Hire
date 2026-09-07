import os
from dotenv import load_dotenv
load_dotenv(".env")
load_dotenv(".env.local")

from langchain_google_genai import ChatGoogleGenerativeAI

model_name = "gemini-3.6-flash"
try:
    print(f"Testing model: {model_name}...")
    llm = ChatGoogleGenerativeAI(model=model_name)
    res = llm.invoke("Say 'Hello Interviewer!' in one short sentence.")
    print(f"SUCCESS [{model_name}]: {res.content}")
except Exception as e:
    print(f"FAILED [{model_name}]: {e}\n")
