from flask import Flask, request,jsonify
from flask_cors import CORS
import bcrypt
import jwt
from datetime import datetime, timedelta
app = Flask(__name__)
CORS(app)


users = {}

SECRET_KEY = 'your_secret_key'

@app.route('/')
def home():
    return "Welcome to the API"

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if username in users:
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    users[username] = {
        'email': email,
        'password': hashed_password
    }
    
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username not in users:
        return jsonify({"message": "Invalid credentials"}), 401

    stored_password = users[username]['password']
    if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        'username': username,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({"message": "Login successful", "token": token})

@app.route('/api/events', methods= ['GET'])
def get_events():
    events = [
        {'id': 1, 'title': 'Event 1', 'date': '2024-09-19', 'content': 'Event 1 Description', 'status': 'accepted'},
        {'id': 2, 'title': 'Event 2', 'date': '2024-10-20', 'content': 'Event 2 Description', 'status': 'accepted'},
        {'id': 3, 'title': 'Event 3', 'date': '2025-02-18', 'content': 'Event 3 Description', 'status': 'pending'},
        {'id': 4, 'title': 'Event 4', 'date': '2024-08-02', 'content': 'Event 4 Description', 'status': 'passed'}
    ]
    return jsonify(events)

@app.route('/api/messages', methods = ['GET'])
def get_messages():
    messages= [
        { 'id': 1, 'title': 'Message 1', 'time': 'just now', 'content': 'Message content 1' , 'read': 0},
        { 'id': 2, 'title': 'Message 2', 'time': '2 minutes ago', 'content': 'Message content 2', 'read': 1},
        { 'id': 3, 'title': 'Message 3', 'time': '5 minutes ago', 'content': 'Message content 3', 'read': 1 },
        { 'id': 4, 'title': 'Message 4', 'time': '10 minutes ago', 'content': 'Message content 4', 'read': 0 }
    ]
    return jsonify(messages)

@app.route('/api/get_profile', methods = ['GET'])
def get_profile():
    profile = {
        'pic': 'NA',
        'userName': 'Default',
        'fullName': 'Johnny Bravo',
        'email':'yahoo@gmail.com',
        'address': '4455 University Drive',
        'city': 'Houston',
        'state': 'TX',
        'zip': '77204',
        'skills': ['run','swim'],
        'preferences': 'None',
        'availability': [],
    }
    return jsonify(profile)

@app.route('/api/update_profile', methods= ['POST'])
def update_profile():
    profile = request.get_json()
    print(profile)
    return jsonify({"message":"Success"})

if __name__ == '__main__':
    app.run(debug=True)