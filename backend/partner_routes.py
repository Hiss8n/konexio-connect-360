from typing import Literal
from uuid import uuid4

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy.orm import Session

from database import get_db
from models import PartnerApplication

router = APIRouter(prefix="/partners", tags=["partners"])

PartnerType = Literal["Employer", "Donor", "Client", "Training partner"]


class PartnerRegistrationRequest(BaseModel):
    organisation: str = Field(min_length=1, max_length=160)
    type: PartnerType
    country: str | None = Field(default=None, max_length=120)
    description: str | None = Field(default=None, max_length=2000)
    logo_file: str | None = Field(default=None, max_length=500)
    website: str | None = Field(default=None, max_length=500)
    contact_name: str = Field(min_length=1, max_length=160)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=32)

    @field_validator("organisation", "contact_name")
    @classmethod
    def clean_required_names(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be empty")
        return value

    @field_validator("country", "description", "logo_file", "website", "phone")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        value = value.strip() if value is not None else None
        return value or None


class PartnerRegistrationResponse(BaseModel):
    business_id: str
    status: str


@router.post(
    "/register",
    response_model=PartnerRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_partner(
    request: PartnerRegistrationRequest,
    db: Session = Depends(get_db),
) -> PartnerRegistrationResponse:
    application = PartnerApplication(
        business_id=f"PAR-{uuid4().hex[:12].upper()}",
        organisation=request.organisation,
        type=request.type,
        country=request.country,
        description=request.description,
        logo_file=request.logo_file,
        website=request.website,
        private_contact_name=request.contact_name,
        private_contact_email=str(request.email).strip().lower(),
        private_contact_phone=request.phone,
        show_on_site=False,
        status="pending_review",
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    return PartnerRegistrationResponse(
        business_id=application.business_id,
        status=application.status,
    )