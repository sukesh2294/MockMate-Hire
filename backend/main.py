

# from contextlib import asynccontextmanager

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.api.routes import router as api_router
# from app.core.config import settings
# from app.db.base import Base
# from app.db.session import engine


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)

#     yield


# app = FastAPI(
#     title=settings.PROJECT_NAME,
#     description=(
#         "MockMate Hire backend API for interviews, "
#         "candidate evaluation and LiveKit orchestration."
#     ),
#     version="1.0.0",
#     lifespan=lifespan,
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.ALLOW_ORIGINS,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(api_router, prefix="/api")


from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "MockMate Hire backend API for interviews, "
        "candidate evaluation and LiveKit orchestration."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# 1. Regex CORS allow karein taaki sabhi Vercel branches + Localhost bina error chal sakein
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$|^http:\/\/localhost:\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Dual routing mount: Dono /api aur root / requests successfully handle honge
app.include_router(api_router, prefix="/api")
app.include_router(api_router)

# 3. Direct Health Ping fallback
@app.get("/health/ping")
@app.get("/api/health/ping")
async def ping():
    return {"status": "ok", "message": "pong"}