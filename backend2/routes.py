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

#Gets a single user from a database
@approutes.route("/users/<userid>", methods=["GET"])
def get_user(userid):
    user = User.query.get(userid)

    if not user: return jsonify({"message": "User not found"}), 404

    return jsonify(user.to_json())

#Creates a user
@approutes.route("/users", methods=["POST"])
def create_user():
    #print("request.json: ", request.json)


    userid = str(uuid4())
    user_name = request.json.get("username")
    password = request.json.get("password")
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    #return error message if any of the user entered values are empty
    #if not user_name or not password or not first_name or not last_name or not email:
    if not user_name or not password or not first_name or not last_name or not email:
        return (
            jsonify({"message" : "Important account info missing. Fill all fields"}),
            400,
        )

    #When adding new user to the database, we create a new user object, add to database session,
    #commit anything in the session.
    #In the event of an error/exception we return the error with a status code of 400
    #new_user = User(userid=userid, user_name=user_name, password=password, first_name=first_name, last_name=last_name, email=email)
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

#Get a specific Job by jobid
@approutes.route("/jobs/id/<jobid>", methods=["GET"])
def get_job(jobid):
    job = Job.query.filter_by(jobid=jobid).first()

    if not job: return jsonify({"message": "Job not found"}), 404

    return jsonify(job.to_json())

#Get Jobs created by a specific user
@approutes.route("/jobs/users/<user_name>", methods=["GET"])
def get_jobs_by_user(user_name):
    jobs = Job.query.filter_by(user_name=user_name).all()

    if not jobs: return jsonify({"message": "Jobs for this user not found"}), 404

    json_jobs = list(map(lambda x: x.to_json(), jobs))
    return jsonify({"jobs": json_jobs})

#Get Jobs assigned to a specific fixer
@approutes.route("/jobs/fixer/<fixer_name>", methods=["GET"])
def get_jobs_by_fixer(fixer_name):
    jobs = Job.query.filter_by(fixer_name=fixer_name).all()

    if not jobs: return jsonify({"message": "Jobs for this fixer not found"}), 404

    json_jobs = list(map(lambda x: x.to_json(), jobs))
    return jsonify({"jobs": json_jobs})

#Allows a fixer to assign themself as a fixer
@approutes.route("/jobs/assign/fixer/<jobid>/<user_name>", methods=["PUT"])
def assign_fixer(jobid, user_name):
    job = Job.query.filter_by(jobid=jobid).first()

    if not job: return jsonify({"message" : "Job not found"}), 404

    job.fixer_name = user_name
    job.status = "In Progress"

    db.session.commit()

    return jsonify({"message" : "The fixer for the job has been assigned."}), 200


#Allows job creator to set the job as completed
@approutes.route("/jobs/users/<user_name>/<jobid>", methods=["PUT"])
def set_job_complete(user_name, jobid):
    job = Job.query.filter_by(user_name=user_name, jobid=jobid).first()

    if not job: return jsonify({"message": "Jobs not found"}), 404

    job.status = "Complete"
    db.session.commit()
    return jsonify({"message" : "Job has been completed"})

#Creating a job
@approutes.route("/jobs", methods=["POST"])
def create_job():
    jobid = str(uuid4())
    user_name = request.json.get("username")
    address = request.json.get("address")
    description = request.json.get("description")
    fixer_name = request.json.get("fixerName")
    status = "Open"

    if not user_name or not address or not description or not status:
        return (
            jsonify({"message": "You must include an address and description"}),
            400,
            )

    #When adding new job to the database, we create a new job object, add to database session,
    #commit anything in the session.
    #In the event of an error/exception we return the error with a status code of 400
    new_job = Job(jobid=jobid,user_name=user_name, address=address, description=description, fixer_name=fixer_name, status=status)
    try:
        db.session.add(new_job)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    #return message for the newly created job
    return jsonify({"message": "Job created"}), 201

'''
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
    '''