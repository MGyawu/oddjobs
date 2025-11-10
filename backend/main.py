from flask import request, jsonify
from config import app, db
from models import User, Job

#Get Users from a database
@app.route("/users", methods=["GET"])
def get_userss():
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    return jsonify({"jobs": json_users})


'''
#Creates a user
@app.route("/create_user", methods=["POST"])
def create_user():
    user_name = request.json.get("username")
    first_name = request.json.get("username")
    last_name = request.json.get("username")
    email = request.json.get("username")


'''


#Get Jobs from a database
@app.route("/jobs", methods=["GET"])
def get_jobs():
    jobs = Job.query.all()
    json_jobs = list(map(lambda x: x.to_json(), jobs))
    return jsonify({"jobs": json_jobs})



#Creating a job
@app.route("/create_job", methods=["POST"])
def create_job():
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
    

#Run flask application
if __name__ == "__main__":
    #initialize database
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)
