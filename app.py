from flask import Flask, jsonify, request, make_response, render_template
from flask import render_template, redirect, url_for, flash
from flask_login import UserMixin, LoginManager
from flask_login import login_user, login_required, current_user, logout_user
from flask_login import login_required, current_user # After login - Profile
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS


from werkzeug.security import generate_password_hash, check_password_hash

from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret-key-goes-here'
socketio = SocketIO(app)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///AirCADia_Nebos.db'
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return User.query.get(int(user_id))


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/aircadia_nebos')
@login_required
def aircadia_nebos():
    return render_template('AircadiaNebos/AirCADiaNebos.html')

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name)


@app.route('/aircadia')
def aaa():
    return "Hello, AirCADia!"


@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/signup', methods=['POST'])
def signup_post():
    # code to validate and add user to database goes here
    email = request.form.get('email')
    username = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database

    if user: # if a user is found, we want to redirect back to signup page so user can try again
        flash('Email address already exists')
        return redirect(url_for('signup'))

    # create a new user with the form data. Hash the password so the plaintext version isn't saved.
    new_user = User(name=name, email=email, username=username, password=generate_password_hash(password, method='sha256'))

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()
    return redirect(url_for('login'))


@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login_post():
    # login code goes here
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()

    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return redirect(url_for('login')) # if the user doesn't exist or password is wrong, reload the page

    # if the above check passes, then we know the user has the right credentials
    login_user(user, remember=remember)
    return redirect(url_for('profile'))





@app.route('/logout')
def logout():
    logout_user()
    return 'Logout'





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
class User(UserMixin, db.Model):
    __tablename__ = 'Users'
    id = db.Column("ID", db.Integer, primary_key = True)
    name = db.Column("Name", db.String(50))
    email = db.Column("Email", db.String(50), unique=True)
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






#Events
@socketio.on('message')
def handle_message(msg):
    print('get message:'+ msg)
    send(msg, broadcast=True)


@socketio.on('create_data')
def handle_create_data(json):
    print('received json: ' + str(json))
    emit('create_data', json, broadcast=True)

@socketio.on('create_model')
def handle_create_model(json):
    print('received json: ' + str(json))
    emit('create_model', json, broadcast=True)


@socketio.on('create_workflow')
def handle_create_workflow(json):
    print('received json: ' + str(json))
    emit('create_workflow', json, broadcast=True)



if __name__ == '__main__':
    #socketio.run(app, debug=True)
    app.run(debug=True, port=3000)