from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from auth.schemas import LoginRequest, RegisterRequest
from auth.security import hash_password, verify_password
from models import AlumniProfile, LearnerProfile, PartnerApplication, User
load_dotenv()

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def register_learner_user(db: Session, payload: RegisterRequest | dict) -> User:
    request = payload if isinstance(payload, RegisterRequest) else RegisterRequest(**payload)

    if request.account_type != "learner":
        raise ValueError("This helper only registers learner accounts")

    user = User(
        first_name=request.first_name,
        second_name=request.second_name,
        email=str(request.email),
        password_hash=hash_password(request.password),
        has_organisation=request.has_organisation,
    )
    db.add(user)
    try:
        db.add(LearnerProfile(
            business_id=f"LRN-{uuid4().hex[:12].upper()}",
            first_name=request.first_name,
            last_name=request.second_name,
            email=str(request.email),
            city=request.city,
            country=request.country,
            pathway_code=request.pathway_code,
            learning_goal=request.learning_goal,
        ))
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("An account with this email already exists") from None

    db.refresh(user)
    return user


def register_user(db: Session, request: RegisterRequest) -> User:
    user = User(
        first_name=request.first_name,
        second_name=request.second_name,
        email=str(request.email),
        password_hash=hash_password(request.password),
        has_organisation=request.has_organisation
    )
    db.add(user)
    try:
        if request.account_type == "learner":
            db.add(LearnerProfile(
                business_id=f"LRN-{uuid4().hex[:12].upper()}",
                first_name=request.first_name,
                last_name=request.second_name,
                email=str(request.email),
                city=request.city,
                country=request.country,
                pathway_code=request.pathway_code,
                learning_goal=request.learning_goal,
            ))
        elif request.account_type == "alumni":
            db.add(AlumniProfile(
                business_id=f"ALU-{uuid4().hex[:12].upper()}",
                first_name=request.first_name,
                last_name=request.second_name,
                private_notification_email=str(request.email),
                city=request.city,
                country=request.country,
                pathway_code=request.pathway_code,
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
            ))
        elif request.account_type in {"partner", "donor"}:
            db.add(PartnerApplication(
                business_id=f"PAR-{uuid4().hex[:12].upper()}",
                organisation=request.organisation,
                type="Donor" if request.account_type == "donor" else request.partner_type,
                country=request.country,
                description=request.description,
                website=request.website,
                private_contact_name=f"{request.first_name} {request.second_name}",
                private_contact_email=str(request.email),
                private_contact_phone=request.phone,
                show_on_site=False,
                status="pending_review",
            ))
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("An account with this email already exists") from None
    db.refresh(user)
    return user


def authenticate_user(db: Session, request: LoginRequest) -> User | None:
    user = get_user_by_email(db, str(request.email))
    if user is None or not verify_password(request.password, user.password_hash):
        return None
    return user