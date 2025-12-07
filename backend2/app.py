from extensions import db
from flask import Flask

from routes import approutes
from flask_cors import CORS


def create_app(database_uri="sqlite:///mydatabase.db"):
    #Initializes the app and allows cross origin requests to be sent
    app = Flask(__name__)
    CORS(app)

    #Specify the location of local database
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    #Create Database instance
    db.init_app(app)

    app.register_blueprint(approutes)
    return app

#Run flask application
if __name__ == "__main__":
    #initialize database
    app=create_app()
    with app.app_context():
        db.create_all()
    
    #print("DB bound app: ", db.get_app())
    app.run(debug=True)
    #print("DB bound app: ", db.get_app())






    #ssh key commit test