from livekit.api import AccessToken
from livekit.api.access_token import VideoGrants

from app.core.config import settings


def create_livekit_token(
    identity: str,
    room_name: str,
    ttl_minutes: int = 30,
) -> str:
    grant = VideoGrants(
        room_join=True,
        room=room_name,
        room_create=False,
    )

    token = AccessToken(
        settings.LIVEKIT_API_KEY,
        settings.LIVEKIT_API_SECRET,
    )

    token.identity = identity
    token.name = identity

    token.add_grant(grant)

    return token.to_jwt()


def build_livekit_url() -> str:
    return settings.LIVEKIT_URL