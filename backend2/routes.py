from flask import request, jsonify, Blueprint
from extensions import db
from models2 import User, Job
from uuid import uuid4

approutes = Blueprint("app", __name__)

#Get Users from a database
@approutes.route("/users", methods=["GET"])
def get_userss():
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    return jsonify({"users": json_users})

#Creates a user
@approutes.route("/create_user", methods=["POST"])
def create_user():

    userid = uuid4(int)
    user_name = request.json.get("username")
    password = request.json.get("password")
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    #return error message if any of the user entered values are empty
    if not user_name or not password or not first_name or not last_name or not email:
        return (
            jsonify({"message" : "Important account info missing. Fill all fields"}),
            400,
        )

    #When adding new user to the database, we create a new user object, add to database session,
    #commit anything in the session.
    #In the event of an error/exception we return the error with a status code of 400
    new_user = User(userid=userid, user_name=user_name, password=password, first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    #return message for the newly created job
    return jsonify({"message": "User created"}), 201

#Get Jobs from a database
@approutes.route("/jobs", methods=["GET"])
def get_jobs():
    jobs = Job.query.all()
    json_jobs = list(map(lambda x: x.to_json(), jobs))
    return jsonify({"jobs": json_jobs})

#Creating a job
@approutes.route("/create_job", methods=["POST"])
def create_job():
    jobid = uuid4(int)
    user_name = request.json.get("username")
    address = request.json.get("address")
    description = request.json.get("description")
    fixer_name = request.json.get("fixerName")
    status = request.json.get("status")

    if not address or not description:
        return (
            jsonify({"message": " You must include an address and description"}),
            400,
            )

    #When adding new job to the database, we create a new job object, add to database session,
    #commit anything in the session.
    #In the event of an error/exception we return the error with a status code of 400
    new_job = Job(user_name=user_name, address=address, description=description, fixer_name=fixer_name, status=status)
    try:
        db.session.add(new_job)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    #return message for the newly created job
    return jsonify({"message": "Job created"}), 201

#Delete a job
@approutes.route("/delete_job/<int:jobid>", methods=["DELETE"])
def delete_job(jobid):
    job = Job.query.get(jobid)

    #Return an error message if the job is not there
    if not job:
        return jsonify({"message": "job not found"}), 404

    #Delete the job from the database
    db.session.delete(job)
    db.session.commit()

    #Return confirmation message
    return jsonify({"message": "User deleted"}), 200