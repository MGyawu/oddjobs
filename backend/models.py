from config import db

#Defines User class that inherents from db.Model
#Defines the fields that is object will have
class User(db.Model):
    userid = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), unique=False, nullable=False)
    first_name = db.Column(db.String(100), unique=False, nullable=False)
    last_name = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(100), unique=False, nullable=False)

    #Converts above fields -> Python Dict -> Json
    def to_json(self):
        return{
            "id" : self.id,
            "username" : self.user_name,
            "firstName" : self.first_name,
            "lastName" : self.last_name,
            "email" : self.email
        }


#Defines Job class that inherents from db.Model
#Defines the fields that is object will have
class Job(db.Model):
    jobid = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), unique=False, nullable=False)
    address = db.Column(db.String(100), unique=False, nullable=False)
    description = db.Column(db.String(300), unique=False, nullable=False)
    fixer_name = db.Column(db.String(100), unique=False, nullable=False)
    status = db.Column(db.String(100), unique=False, nullable=False)


    #Converts above fields -> Python Dict -> Json
    def to_json(self):
        return{
            "jobid" : self.id,
            "username" : self.user_name,
            "address" : self.address,
            "description" : self.description,
            "fixerName" : self.fixer_name,
            "status" : self.status
        }

