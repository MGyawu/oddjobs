import pytest
from app import create_app
from extensions import db

#Used to create app and databse specifically for a suite of tests
@pytest.fixture
def app():
    app = create_app("sqlite:///test.db")

    with app.app_context():
        db.drop_all()
        db.create_all()

    yield app

#Allows for test requests to be made to the app.
@pytest.fixture
def client(app):
    return app.test_client()

