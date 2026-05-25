from extensions import db
from models2 import Job, User

from flask import Flask
from routes import approutes
from flask_cors import CORS
import os
import time


#def create_app(database_uri="sqlite:///mydatabase.db"):
def create_app(database_uri=None):
    #Initializes the app and allows cross origin requests to be sent
    app = Flask(__name__)
    CORS(app, origins = ['http://localhost:5173', 'http://127.0.0.1:5173'])

    if not database_uri:
        database_uri = os.environ.get('SQLALCHEMY_DATABASE_URI', "sqlite:///mydatabase.db")

    #Specify the location of local database
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    #Create Database instance
    db.init_app(app)

    app.register_blueprint(approutes, url_prefix="/api")
    return app

#Run flask application
if __name__ == "__main__":
    import sys

    if "test" in sys.argv:
        app = create_app("sqlite:///:memory:")
    else:
        #initialize database
        app=create_app(os.environ.get('DATABASE_URL'))
    #time.sleep(5)
    with app.app_context():
        print("App Created")
        max_retries = 10
        for attempt in range(max_retries):
            try:
                db.create_all()
                print("Tables Created")
                break
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"Database not ready, retrying in 5s... ({attempt + 1}/{max_retries})")
                    time.sleep(5)
                else:
                    raise
    

    app.run(port = 5000, debug=False)
  