from app import *

db.create_all()

project1 = Project(name='Wind Turbine', end_point='http://127.0.0.1:5000/')
db.session.add(project1)
project2 = Project(name='Aircraft Design', end_point='http://127.0.0.1:5000/')
db.session.add(project2)

user1 = User(name='Atif Riaz', username='atif.riaz@outlook.com', password='Potatocar452')
user1.projects.append(project1)
user1.projects.append(project2)
db.session.add(user1)

db.session.commit()


# project3 = Project(name='New Project', end_point='http://127.0.0.1:5000/')
# db.session.add(project3)
# user = User.query.filter_by(name = 'Atif Riaz').first()
# print(len(user.projects))
# user.projects.append(project3)
# db.session.commit()
# userafter = User.query.filter_by(name = 'Atif Riaz').first()
# print(len(userafter.projects))