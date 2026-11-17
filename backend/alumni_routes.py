from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy.orm import Session

from database import get_db
from models import AlumniProfile

router = APIRouter(prefix="/alumni", tags=["alumni"])


class AlumniRegistrationRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    pathway_code: str = Field(pattern=r"^P(?:[1-9]|1[01])$")
    city: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, max_length=120)
    short_bio: str | None = Field(default=None, max_length=2000)
    skills: list[str] = Field(default_factory=list, max_length=30)
    languages: list[str] = Field(default_factory=list, max_length=20)
    availability: str | None = Field(default=None, max_length=100)
    portfolio_title: str | None = Field(default=None, max_length=200)
    portfolio_url: str | None = Field(default=None, max_length=500)
    portfolio_image: str | None = Field(default=None, max_length=500)
    personal_website: str | None = Field(default=None, max_length=500)
    linkedin_url: str | None = Field(default=None, max_length=500)
    photo_file: str | None = Field(default=None, max_length=500)
    video_file: str | None = Field(default=None, max_length=500)
    consent_to_publish: bool = False
    consent_to_show_photo: bool = False

    @field_validator("first_name", "last_name")
    @classmethod
    def clean_required_names(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty")
        return value

    @field_validator(
        "city", "country", "short_bio", "availability", "portfolio_title",
        "portfolio_url", "portfolio_image", "personal_website", "linkedin_url",
        "photo_file", "video_file",
    )
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        value = value.strip() if value is not None else None
        return value or None

    @field_validator("skills", "languages")
    @classmethod
    def clean_lists(cls, values: list[str]) -> list[str]:
        return [value.strip() for value in values if value.strip()]


class AlumniRegistrationResponse(BaseModel):
    business_id: str
    status: str


@router.post(
    "/register",
    response_model=AlumniRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_alumnus(
    request: AlumniRegistrationRequest,
    db: Session = Depends(get_db),
) -> AlumniRegistrationResponse:
    profile = AlumniProfile(
        business_id=f"ALU-{uuid4().hex[:12].upper()}",
        first_name=request.first_name,
        last_name=request.last_name,
        private_notification_email=str(request.email).strip().lower(),
        pathway_code=request.pathway_code,
        city=request.city,
        country=request.country,
        short_bio=request.short_bio,
        skills=request.skills,
        languages=request.languages,
        availability=request.availability,
        portfolio_title=request.portfolio_title,
        portfolio_url=request.portfolio_url,
        portfolio_image=request.portfolio_image,
        personal_website=request.personal_website,
        linkedin_url=request.linkedin_url,
        photo_file=request.photo_file,
        video_file=request.video_file,
        consent_to_publish=request.consent_to_publish,
        consent_to_show_photo=request.consent_to_show_photo,
        consent_date=datetime.now(timezone.utc) if request.consent_to_publish else None,
        is_active=False,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    return AlumniRegistrationResponse(business_id=profile.business_id, status="pending_review")