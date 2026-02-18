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

#Sample test data for the tests to test app routes/functions
@pytest.fixture
def test_user_data():
    return [
        {
            "username": "JohnUserName",
            "password": "Secret123",
            "firstName": "John",
            "lastName": "Doe",
            "email": "John.Doe@gmail.com"
        },
        {
            "username": "ADiffName",
            "lastName": "Doe",
            "email": "ADiffName@gmail.com"
        }
    ]

@pytest.fixture
def test_job_data():
    return [
        {
            #"jobid" : "67",
            "username" : "JohnUserName",
            "address" : "Duff City",
            "description" : "Mow my lawn gang",
            "fixerName" : "Fix it felix",
        },
        {
            #"jobid" : "67",
            "username" : "JohnUserName",
            "address" : "Duff City",
            "description" : "paint my house",
            "fixerName" : "Wreck it Ralph",
        },
        {
            #"jobid" : "67",
            "username" : "JaneUserName",
            "address" : "Duck City",
            "description" : "Build my shelf",
            "fixerName" : "Fix it felix",
        },
        {
            "username": "JohnUserName",
            "fixerName": "Fix it felix",
        }
    ]

@pytest.fixture
def test_job_no_fixer():
    return {
            #"jobid" : "67",
            "username" : "JohnUserName",
            "address" : "Duff City",
            "description" : "Mow my lawn gang"
        }