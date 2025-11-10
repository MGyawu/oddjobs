from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

#Initializes the app and allows cross origin requests to be sent
app = Flask(__name__)
CORS(app)

#Specify the location of local database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#Create Database instance
db = SQLAlchemy(app)