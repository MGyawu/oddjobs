#from models2 import User
from flask import jsonify

def test_connect_route(client,app):
    response = client.get("/users")
    assert response.status_code == 200

    response = client.get("/jobs")
    assert response.status_code == 200

def test_create_user(client, app):
    response = client.post("/users", json={
        "username": "JohnUserName",
        "password": "Secret123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "John.Doe@gmail.com"
    })

    print("response json: ", response.get_json())
    print("John")

    # Check HTTP response
    assert response.status_code == 201

    # Check DB
    with app.app_context():
        from models2 import User
        assert User.query.count() == 1
        user = User.query.first()
        assert user.user_name == "JohnUserName"
        assert user.first_name == "John"
        assert user.last_name == "Doe"
        assert user.email == "John.Doe@gmail.com"

def test_create_user_missing_fields(client,app):
    # Missing firstName
    response = client.post("/users", json={
        "username": "JohnUserName",
        "lastName": "Doe",
        "email": "John.Doe@gmail.com"
    })

    with app.app_context():
        from models2 import User
        assert User.query.filter_by(user_name="JohnUserName").first() == None
        assert response.status_code == 400
        assert response.get_json()["message"] == "Important account info missing. Fill all fields"

def test_get_user(client, app):
    response = client.post("/users", json={
        "username": "JohnUserName",
        "password": "Secret123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "John.Doe@gmail.com"
    })

    with app.app_context():
        from models2 import User
        user = User.query.filter_by(user_name="JohnUserName").first()

    #print(user.userid)
    response = client.get(f"/users/{user.userid}")#"/users/" + user.userid)
    #print("Get status code:", response.status_code)
    data = response.get_json()
    assert data["username"] == "JohnUserName"
    assert response.status_code == 200

def test_get_user_not_found(client, app):
    response = client.get("/users/5y436547839647382946378297438")

    with app.app_context():
        assert response.status_code == 404
        data = response.get_json()
        assert data["message"] == "User not found"
    

def test_create_job(client,app):
    response = client.post("/jobs", json={
            #"jobid" : "67",
            "username" : "JohnUserName",
            "address" : "Duff City",
            "description" : "Mow my lawn gang",
            "fixerName" : "Fix it felix",
            "status" : "In Progress"
    })

    #Check http response
    assert response.status_code == 201

    #Check DB
    with app.app_context():
        from models2 import Job
        assert Job.query.count() == 1
        job = Job.query.first()
        assert job.user_name == "JohnUserName"
        assert job.address == "Duff City"
        assert job.description == "Mow my lawn gang"
        assert job.fixer_name == "Fix it felix"
        #assert job.status == "In Progress"

def test_create_job_missing_fields(client):
    # Missing 'address'
    response = client.post("/jobs", json={
        "username": "JohnUserName",
        # "address": "Duff City",  # missing
        "description": "Mow my lawn gang",
        "fixerName": "Fix it felix",
        "status": "In Progress"
    })

    assert response.status_code == 400
    assert response.get_json()["message"] == "You must include an address and description"

def test_get_job_by_user(client,app):
    response = client.post("/jobs", json={
            #"jobid" : "67",
            "username" : "JohnUserName",
            "address" : "Duff City",
            "description" : "Mow my lawn gang",
            "fixerName" : "Fix it felix",
            "status" : "In Progress"
    })

    response = client.post("/jobs", json={
            #"jobid" : "67",
            "username" : "JohnUserName",
            "address" : "Duff City",
            "description" : "paint my house",
            "fixerName" : "Fix it felix",
            "status" : "In Progress"
    })

    response = client.post("/jobs", json={
            #"jobid" : "67",
            "username" : "JaneUserName",
            "address" : "Duck City",
            "description" : "Build my shelf",
            "fixerName" : "Fix it felix",
            "status" : "In Progress"
    })

    #with app.app_context():
        #from models2 import Job
    #    job = Job.query.filter_by(user_name="JohnUserName").all()

    response = client.get("/jobs/users/JohnUserName")
    data = response.get_json()
    assert response.status_code == 200
    #assert Job.query.count() == 2

    assert "jobs" in data
    assert len(data["jobs"]) == 2  # John has 2 jobs

    # Optionally, check the content
    descriptions = [job["description"] for job in data["jobs"]]
    assert "Mow my lawn gang" in descriptions
    assert "paint my house" in descriptions

    response = client.get("/jobs/MarioMario")
    assert response.status_code == 404


def test_get_jobs_by_fixer(client,app):
    response = client.post("/jobs", json={
            #"jobid" : "67",
            "username" : "JohnUserName",
            "address" : "Duff City",
            "description" : "Mow my lawn gang",
            "fixerName" : "Fix it felix",
            "status" : "In Progress"
    })

    response = client.post("/jobs", json={
            #"jobid" : "67",
            "username" : "JohnUserName",
            "address" : "Duff City",
            "description" : "paint my house",
            "fixerName" : "Wreck it Ralph",
            "status" : "In Progress"
    })

    response = client.post("/jobs", json={
            #"jobid" : "67",
            "username" : "JaneUserName",
            "address" : "Duck City",
            "description" : "Build my shelf",
            "fixerName" : "Fix it felix",
            "status" : "In Progress"
    })


    response = client.get("/jobs/fixer/Fix it felix")
    data = response.get_json()
    assert response.status_code == 200
    #assert Job.query.count() == 2

    assert "jobs" in data
    assert len(data["jobs"]) == 2  
    
    descriptions = [job["description"] for job in data["jobs"]]
    assert "Mow my lawn gang" in descriptions
    assert "Build my shelf" in descriptions

    response = client.get("/jobs/fixer/MarioMario")
    assert response.status_code == 404

'''
def test_assign_fixer(client, app):
    #Posts a fixer value to as specific job
    response = client.post()

    with app.app_context(): 
        from models2 import Job
        job = Job.query.filter_by(fixer_name=).first()
        assert response.status_code == 200
        assert response.get_json()["fixerName"] == ""
'''

'''
def test_get_user(client, app):
    person = {
        "username": "JohnUserName",
        #"password": "Secret123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "John.Doe@gmail.com"
    }

    response = client.post("/users", json=person)

    response2 = client.get()
'''


#def test_create_user(client, app):
#    response = client.post("/create_user")