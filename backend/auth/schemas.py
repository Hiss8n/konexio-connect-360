from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator
from dotenv import load_dotenv
load_dotenv()

class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    second_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    has_organisation: bool = False
    account_type: Literal["learner", "alumni", "partner", "donor", "user"] = "user"
    city: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, max_length=120)
    pathway_code: str | None = Field(default=None, pattern=r"^P(?:[1-9]|1[01])$")
    learning_goal: str | None = Field(default=None, max_length=2000)
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
    organisation: str | None = Field(default=None, max_length=160)
    partner_type: Literal["Employer", "Donor", "Client", "Training partner"] | None = None
    description: str | None = Field(default=None, max_length=2000)
    website: str | None = Field(default=None, max_length=500)
    phone: str | None = Field(default=None, max_length=32)

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value

    @field_validator("first_name", "second_name")
    @classmethod
    def strip_names(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Name cannot be empty")
        return cleaned

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()

    @field_validator(
        "city", "country", "learning_goal", "short_bio", "availability",
        "portfolio_title", "portfolio_url", "portfolio_image", "personal_website",
        "linkedin_url", "photo_file", "video_file", "organisation", "description",
        "website", "phone",
    )
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        value = value.strip() if value is not None else None
        return value or None

    @field_validator("skills", "languages")
    @classmethod
    def clean_lists(cls, values: list[str]) -> list[str]:
        return [value.strip() for value in values if value.strip()]

    @model_validator(mode="after")
    def validate_registration_details(self):
        if self.account_type == "learner":
            if not self.country or not self.pathway_code or not self.learning_goal:
                raise ValueError("Learners must provide country, pathway, and learning goal")
        elif self.account_type == "alumni":
            if not self.pathway_code:
                raise ValueError("Alumni must provide a pathway")
        elif self.account_type in {"partner", "donor"}:
            if not self.organisation or not self.country or not self.description:
                raise ValueError("Partners and donors must provide organisation, country, and description")
            if self.account_type == "donor" and self.partner_type not in {None, "Donor"}:
                raise ValueError("Donor accounts must use the Donor organisation type")
            if self.account_type == "partner" and self.partner_type in {None, "Donor"}:
                raise ValueError("Select Employer, Client, or Training partner")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    second_name: str
    email: EmailStr
    has_organisation: bool = False

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse