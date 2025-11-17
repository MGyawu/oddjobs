import pytest
from app import create_app
from extensions import db

#Used to create app and databse specifically for a suite of tests
@pytest.fixture()
def test_app():
    app = create_app("sqlite://")

    with app.app_context:
        db.create_all()

    yield app

#Allows for test requests to be made to the app.
@pytest.fixture()
def client(app):
    return app.test_client()

#A list of test users
USERS = [
    {},
    {},
    {}
]
