#from models2 import User

def test_connect_route(client,app):
    response = client.get("/users")
    assert response.status_code == 200

def test_create_user(client, app):
    response = client.post("/users", json={
        "username": "JohnUserName",
        #"password": "Secret123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "John.Doe@gmail.com"
    })

    print("response json: ", response.get_json())

    # Check HTTP response
    assert response.status_code == 201

    # Check DB
    with app.app_context():
        from models2 import User
        assert User.query.count() == 1
        user = User.query.first()
        assert user.user_name == "JohnUserName"


#def test_get_users(client):


#def test_create_user(client, app):
#    response = client.post("/create_user")