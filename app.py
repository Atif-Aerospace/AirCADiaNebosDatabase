from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///AirCADia_Nebos.db'
db = SQLAlchemy(app)


@app.route('/')
def index():
    return "Hello, World!"


@app.route('/aircadia')
def aaa():
    return "Hello, AirCADia!"





@app.route('/get-projects', methods=["GET"])
def get_projects():
    projectsJson = []
    # projects
    projects = Project.query.all()
    for project in projects:
        projectJson = {
            "name": project.name,
            "end_point": project.end_point
        }
        projectsJson.append(projectJson)
    res = make_response(jsonify(projectsJson), 200)
    return res


# Table for storing users
class User(db.Model):
    __tablename__ = 'Users'
    id = db.Column("ID", db.Integer, primary_key = True)
    name = db.Column("Name", db.String(50))
    #location = db.Column(db.String(50))
    #date_created = db.Column(db.DateTime, dafault = datetime.now)
    username = db.Column("Username", db.String(50), unique=True)
    password = db.Column("Password", db.String(50))
    projects = db.relationship("Project", secondary="UsersProjects")


# Table for storing projects
class Project(db.Model):
    __tablename__ = 'Projects'
    id = db.Column("ID", db.Integer, primary_key = True)
    name = db.Column("Name", db.String(50))
    end_point = db.Column("EndPoint", db.String(50))
    #value = db.Column(db.String(50))
    #date_created = db.Column(db.DateTime, dafault = datetime.now)


# Table for storing users-projects
class UserProject(db.Model):
    __tablename__ = 'UsersProjects'
    id = db.Column("ID", db.Integer, primary_key=True)
    user_id = db.Column("UserID", db.Integer, db.ForeignKey('Users.ID'))
    project_id = db.Column("ProjectID", db.Integer, db.ForeignKey('Projects.ID'))
    user = db.relationship(User, backref=db.backref("UsersProjects", cascade="all, delete-orphan"))
    project = db.relationship(Project, backref=db.backref("UsersProjects", cascade="all, delete-orphan"))








if __name__ == '__main__':
    app.run(debug=True, port=3000)