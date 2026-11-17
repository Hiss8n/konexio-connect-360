from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from auth.service import register_learner_user
from database import Base
from models import LearnerProfile, User


def test_register_learner_user_creates_user_and_learner_profile():
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    payload = {
        'account_type': 'learner',
        'city': 'Kakuma',
        'country': 'Kenya',
        'email': 'hissentutu@gmail.com',
        'first_name': 'Hissen',
        'has_organisation': False,
        'learning_goal': 'grades',
        'password': '12345678',
        'pathway_code': 'P5',
        'second_name': 'Tutu',
    }

    user = register_learner_user(db, payload)

    assert user.email == 'hissentutu@gmail.com'
    assert db.query(User).count() == 1

    learner = db.query(LearnerProfile).one()
    assert learner.email == 'hissentutu@gmail.com'
    assert learner.city == 'Kakuma'
    assert learner.country == 'Kenya'
    assert learner.pathway_code == 'P5'
    assert learner.learning_goal == 'grades'
    assert learner.first_name == 'Hissen'
    assert learner.last_name == 'Tutu'
