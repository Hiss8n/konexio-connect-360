from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text, func, text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    second_name = Column(String(100), nullable=False)
    email = Column(String(320), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    has_organisation = Column(Boolean, nullable=False, default=False, server_default=text("false"))
    organisation = relationship("Organisation", back_populates="owner", uselist=False, foreign_keys="Organisation.owner_id")
    created_posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")

class Organisation(Base):
    __tablename__ = "organisations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    location = Column(String(255), nullable=False)
    website = Column(String(500), nullable=False, default="")
    phone = Column(String(50), nullable=False)
    email = Column(String(320), nullable=False)
    logo = Column(Text, nullable=False, default="")
    admin = Column(String(200), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    owner = relationship("User", back_populates="organisation", foreign_keys=[owner_id])
    posts = relationship("Post", back_populates="organisation", cascade="all, delete-orphan")


class Post(Base):
    __tablename__ = "posts"

    id = Column(String(100), primary_key=True)
    organisation_id = Column(
        Integer,
        ForeignKey("organisations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    organization = Column(String(100), nullable=False)
    initials = Column(String(20), nullable=False)
    category = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=False)
    published = Column(String(100), nullable=False)
    image = Column(Text, nullable=False)
    image_alt = Column(Text, nullable=False)
    paragraphs = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    organisation = relationship("Organisation", back_populates="posts", foreign_keys=[organisation_id])
    author = relationship("User", back_populates="created_posts", foreign_keys=[created_by_id])
	
   

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(320), nullable=False, index=True)
    phone = Column(String(32), nullable=False)
    topic = Column(String(120), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AlumniProfile(Base):
    __tablename__ = "alumni_profiles"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(String(32), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    city = Column(String(120), nullable=True)
    country = Column(String(120), nullable=True)
    pathway_code = Column(String(8), index=True, nullable=False)
    short_bio = Column(Text, nullable=True)
    skills = Column(JSON, nullable=True)
    languages = Column(JSON, nullable=True)
    availability = Column(String(100), nullable=True)
    portfolio_title = Column(String(200), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    portfolio_image = Column(String(500), nullable=True)
    personal_website = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    photo_file = Column(String(500), nullable=True)
    video_file = Column(String(500), nullable=True)
    private_notification_email = Column(String(320), nullable=False, index=True)
    consent_to_publish = Column(Boolean, nullable=False, default=False, server_default=text("false"))
    consent_to_show_photo = Column(Boolean, nullable=False, default=False, server_default=text("false"))
    consent_date = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, nullable=False, default=False, server_default=text("false"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PartnerApplication(Base):
    __tablename__ = "partner_applications"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(String(32), unique=True, index=True, nullable=False)
    organisation = Column(String(160), nullable=False)
    type = Column(String(32), nullable=False)
    country = Column(String(120), nullable=True)
    description = Column(Text, nullable=True)
    logo_file = Column(String(500), nullable=True)
    website = Column(String(500), nullable=True)
    private_contact_name = Column(String(160), nullable=False)
    private_contact_email = Column(String(320), nullable=False, index=True)
    private_contact_phone = Column(String(32), nullable=True)
    show_on_site = Column(Boolean, nullable=False, default=False, server_default=text("false"))
    status = Column(String(32), nullable=False, default="pending_review", server_default="pending_review")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class TeamMember(Base):
    __tablename__ = "team_members"

    team_id = Column(String(32), primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    job_title = Column(String(160), nullable=False)
    short_bio = Column(Text, nullable=True)
    photo_file = Column(String(500), nullable=True)
    role_mailbox = Column(String(320), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    display_email_publicly = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false"),
    )
    contact_method = Column(String(120), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)



