from models2 import User
from models2 import Job

def test_connect_route(client,app):
    response = client.get("/api/users")
    assert response.status_code == 200

    response = client.get("/api/jobs")
    assert response.status_code == 200

### Testing User routes/functions ###

def test_create_user(client,app, test_user_data):
    response = client.post("/api/users", json=test_user_data[0])
    assert response.status_code == 201
    with app.app_context():
        user = User.query.filter_by(user_name=test_user_data[0]["username"]).first()
        assert user.user_name == test_user_data[0]["username"]
        assert user.first_name == test_user_data[0]["firstName"]
        assert user.last_name == test_user_data[0]["lastName"]
        assert user.email == test_user_data[0]["email"]
        before = User.query.count()

    response = client.post("/api/users", json=test_user_data[1])
    assert response.status_code == 400
    with app.app_context():
        after = User.query.count()

        user = User.query.filter_by(
            user_name=test_user_data[1]["username"],
            email=test_user_data[1]["email"]
        ).filter(User.first_name==None).first()
        assert user is None

    assert after == before

def test_get_user(client,app, test_user_data):
    response = client.post("/api/users", json=test_user_data[0])
    assert response.status_code == 201
    with app.app_context():
        user =  User.query.filter_by(user_name=test_user_data[0]["username"]).first()

    response = client.get(f"/api/users/{user.userid}")
    data = response.get_json()
    assert data["username"] == "JohnUserName"
    assert response.status_code == 200

    response = client.get("/api/users/3456787654567")
    data = response.get_json()
    assert response.status_code == 404
    assert data["message"] == "User not found"

def test_authenticate_login(client,app, test_user_data):
    response = client.post("/api/users", json=test_user_data[0])
    assert response.status_code == 201
    with app.app_context():
        user = User.query.filter_by(user_name=test_user_data[0]["username"]).first()

    #Successful authentication
    response = client.post("/api/users/login", json={
        "username": test_user_data[0]["username"],
        "password": test_user_data[0]["password"]
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["username"] == user.user_name
    assert data["password"] == user.password
    assert data["firstName"] == user.first_name
    assert data["lastName"] == user.last_name
    assert data["email"] == user.email
    assert data["id"] == user.userid

    #Username no password
    response = client.post("/api/users/login", json={
        "username": test_user_data[0]["username"],
        "password": None
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["message"] == "Username or Password not found"

    #Password no username
    response = client.post("/api/users/login", json={
        "username": None,
        "password": test_user_data[0]["password"]
    })
    assert response.status_code == 400
    data = response.get_json()
    assert data["message"] == "Username or Password not found"

    #Incorrect Username
    response = client.post("/api/users/login", json={
        "username": "Bad Username",
        "password": test_user_data[0]["password"]
    })
    assert response.status_code == 401
    data = response.get_json()
    assert data["message"] == "Invalid Username or Password"

    #Incorrect Password
    response = client.post("/api/users/login", json={
        "username": test_user_data[0]["username"],
        "password": "Bad Password"
    })
    assert response.status_code == 401
    data = response.get_json()
    assert data["message"] == "Invalid Username or Password"



### Test Jobs Functions/Routes ###

def test_create_job(client,app, test_job_data):
    response = client.post("/api/jobs", json=test_job_data[0])
    assert response.status_code == 201
    with app.app_context():
        job = Job.query.filter_by(user_name=test_job_data[0]["username"]).first()
        assert job.user_name == test_job_data[0]["username"]
        assert job.address == test_job_data[0]["address"]
        assert job.description == test_job_data[0]["description"]
        assert job.fixer_name == test_job_data[0]["fixerName"]
        assert job.status == "Open"
        before = Job.query.count()
    
    response = client.post("/api/jobs", json=test_job_data[len(test_job_data)-1])
    assert response.status_code == 400
    with app.app_context():
        after = Job.query.count()

        job = Job.query.filter_by(
            user_name=test_job_data[len(test_job_data)-1]["username"],
        ).filter(Job.address==None).first()
        assert job is None

    assert after == before

def test_get_job(client,app, test_job_data):
    response = client.post("/api/jobs", json=test_job_data[0])
    assert response.status_code == 201
    with app.app_context():
        job = Job.query.filter_by(user_name=test_job_data[0]["username"]).first()

    response = client.get(f"/api/jobs/id/{job.jobid}")
    assert response.status_code == 200
    data = response.get_json()
    assert job.user_name == data["username"]
    assert job.address == data["address"]
    assert job.description == data["description"]
    assert job.fixer_name == data["fixerName"]

    response = client.get("/api/jobs/id/fghhbvfgvhbngtvbnyh678567896789")
    assert response.status_code == 404
    data = response.get_json()
    assert data["message"] == "Job not found"

def test_get_jobs(client,app, test_job_data):
    for i in range(0, len(test_job_data)-2):
        response = client.post("/api/jobs", json=test_job_data[i])
        assert response.status_code == 201

    response = client.get("/api/jobs")
    assert response.status_code == 200
    data = response.get_json()
    jobs = data["jobs"]
    assert len(jobs) == len(test_job_data) - 2

    for i, job in enumerate(jobs):
        assert job["username"] == test_job_data[i]["username"]
        assert job["address"] == test_job_data[i]["address"]
        assert job["description"] == test_job_data[i]["description"]
        assert job["fixerName"] == test_job_data[i]["fixerName"]

def test_get_job_by_user(client,app, test_job_data):
    for i in range(0, len(test_job_data)-2):
        response = client.post("/api/jobs", json=test_job_data[i])
        assert response.status_code == 201
    
    response = client.get(f"/api/jobs/users/{test_job_data[0]['username']}")
    assert response.status_code == 200
    data = response.get_json()
    jobs = data["jobs"]
    assert len(jobs) == len(test_job_data) - 2

    for i, job in enumerate(jobs):
        assert job["username"] == test_job_data[i]["username"]
        assert job["username"] != test_job_data[2]["username"]
        assert job["address"] == test_job_data[i]["address"]
        assert job["description"] == test_job_data[i]["description"]
        assert job["fixerName"] == test_job_data[i]["fixerName"]    

def test_get_job_by_fixer(client,app, test_job_data):
    for i in range(0, len(test_job_data)-1):
        response = client.post("/api/jobs", json=test_job_data[i])
        assert response.status_code == 201
    
    response = client.get(f"/api/jobs/fixer/{test_job_data[0]['fixerName']}")
    assert response.status_code == 200
    data = response.get_json()
    jobs = data["jobs"]
    assert len(jobs) == len(test_job_data) - 2

    for job in jobs:
        assert job["fixerName"] == test_job_data[0]["fixerName"]
        assert job["fixerName"] != test_job_data[1]["fixerName"]

def test_assign_fixer(client,app,test_job_no_fixer):
    response = client.post("/api/jobs", json=test_job_no_fixer)
    assert response.status_code == 201
    with app.app_context():
        job = Job.query.filter_by(user_name=test_job_no_fixer["username"]).first()

    response = client.put(f"/api/jobs/assign/fixer/{job.jobid}/Fixitfelix")
    assert response.status_code == 200
    with app.app_context():
        new_job = Job.query.filter_by(fixer_name="Fixitfelix").first()
    assert new_job is not None
    assert new_job.fixer_name == "Fixitfelix"
    assert new_job.status == "In Progress"
    data = response.get_json()
    assert data["message"] == "The fixer for the job has been assigned."

    response = client.put("/api/jobs/assign/fixer/34567897654456788654567876/Fixitfelix")
    assert response.status_code == 404
    data = response.get_json()
    assert data["message"] == "Job not found"

def test_set_job_complete(client,app,test_job_data):
    response = client.post("/api/jobs", json=test_job_data[0])
    assert response.status_code == 201
    with app.app_context():
        job = Job.query.filter_by(user_name=test_job_data[0]["username"]).first()

    response = client.put(f"/api/jobs/users/{job.user_name}/{job.jobid}")
    assert response.status_code == 200
    with app.app_context():
        job = Job.query.filter_by(user_name=test_job_data[0]["username"]).first()
    assert job.status == "Complete"

    response = client.put("/api/jobs/users/Frank/619")
    assert response.status_code == 404
    data = response.get_json()
    assert data["message"] == "Jobs not found"

   