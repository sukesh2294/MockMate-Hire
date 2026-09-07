from livekit.api import AccessToken, VideoGrants
from app.core.config import settings


def create_livekit_token(
    identity: str,
    room_name: str,
    ttl_minutes: int = 30,
) -> str:
    grant = VideoGrants(
        room_join=True,
        room=room_name,
        room_create=True,
    )

    token = (
        AccessToken(
            settings.LIVEKIT_API_KEY,
            settings.LIVEKIT_API_SECRET,
        )
        .with_identity(identity)
        .with_name(identity)
        .with_grants(grant)
    )

    return token.to_jwt()


def build_livekit_url() -> str:
    return settings.LIVEKIT_URL