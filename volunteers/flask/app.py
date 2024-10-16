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
events = [
    {'id': 1, 'title': 'Hackathon', 'date': '2024-09-19', 'content': 'Hackathon Event', 'status': 'accepted', 'requiredSkill': 'Programming'},
    {'id': 2, 'title': 'Fundraising Campaign', 'date': '2024-10-20', 'content': 'Fundraising Campaign', 'status': 'accepted', 'requiredSkill': 'Project Management'}
]
volunteers = [
    {'id': 1, 'name': 'John Doe', 'profile': 'Programming'},
    {'id': 2, 'name': 'Jane Smith', 'profile': 'Project Management'}
]

messages= [
        { 'id': 1, 'title': 'Message 1', 'time': 'just now', 'content': 'Message content 1' , 'read': 0},
        { 'id': 2, 'title': 'Message 2', 'time': '2 minutes ago', 'content': 'Message content 2', 'read': 1},
        { 'id': 3, 'title': 'Message 3', 'time': '5 minutes ago', 'content': 'Message content 3', 'read': 1 },
        { 'id': 4, 'title': 'Message 4', 'time': '10 minutes ago', 'content': 'Message content 4', 'read': 0 }
    ]


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


@app.route('/api/read_message', methods = ['POST'])
def read_message():
    id = request.get_json()
    print(id)
    return(jsonify({"message":"Success"}))


@app.route('/api/messages', methods = ['GET'])
def get_messages():
    return jsonify(messages)


@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()

    # Validating required fields
    if not data.get('title') or len(data['title']) > 100:
        return jsonify({"message": "Title is required and must be less than 100 characters"}), 400

    if not data.get('date'):
        return jsonify({"message": "Date is required"}), 400

    if not data.get('content') or len(data['content']) > 500:
        return jsonify({"message": "Content is required and must be less than 500 characters"}), 400

    if not data.get('status') or data['status'] not in ['accepted', 'pending', 'passed']:
        return jsonify({"message": "Status is required and must be 'accepted', 'pending', or 'passed'"}), 400

    if not data.get('requiredSkill'):
        return jsonify({"message": "Required skill is mandatory"}), 400

    event_id = len(events) + 1
    new_event = {
        'id': event_id,
        'title': data['title'],
        'date': data['date'],
        'content': data['content'],
        'status': data['status'],
        'requiredSkill': data['requiredSkill']
    }
    events.append(new_event)
    return jsonify(new_event), 201


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

# Profile validation function
def validate_profile(profile):
    if not profile.get('fullName') or len(profile['fullName']) > 50:
        return "Full name is required and must be less than 50 characters."
    if not profile.get('address1') or len(profile['address1']) > 100:
        return "Address 1 is required and must be less than 100 characters."
    if not profile.get('city') or len(profile['city']) > 100:
        return "City is required and must be less than 100 characters."
    if not profile.get('state') or len(profile['state']) != 2:
        return "State must be a 2-character code."
    if not profile.get('zip') or len(profile['zip']) < 5 or len(profile['zip']) > 9:
        return "Zip code must be between 5 and 9 characters."
    if not profile.get('skills') or len(profile['skills']) == 0:
        return "At least one skill is required."
    if not profile.get('availability') or len(profile['availability']) == 0:
        return "Availability dates are required."
    return None

# Profile update route with validation
@app.route('/api/update_profile', methods=['POST'])
def update_profile():
    profile = request.get_json()
    
    # Validate profile data
    validation_error = validate_profile(profile)
    if validation_error:
        return jsonify({"message": validation_error}), 400
    
    print(profile)
    return jsonify({"message": "Profile updated successfully."}), 200


@app.route('/api/volunteer_history', methods=['GET'])
def get_volunteer_history():
    volunteer_history = [
        {'date': '2023-05-10', 'eventName': 'Event Helper', 'role': 'Helper', 'hours': 4, 'status': 'Completed'},
        {'date': '2023-07-22', 'eventName': 'Fundraiser', 'role': 'Fundraiser', 'hours': 6, 'status': 'Completed'},
        {'date': '2023-08-14', 'eventName': 'Social Media Coordinator', 'role': 'Coordinator', 'hours': 3, 'status': 'Completed'}
    ]
    return jsonify(volunteer_history)


@app.route('/api/match', methods=['POST'])
def match_volunteer():
    data = request.get_json()
    volunteer_id = data.get('volunteer_id')
    manual_event_id = data.get('manual_event_id')

    volunteer = next((v for v in volunteers if v['id'] == volunteer_id), None)
    matched_event = None

    if volunteer and not manual_event_id:
        matched_event = next((e for e in events if e['requiredSkill'] == volunteer['profile']), None)
    elif manual_event_id:
        matched_event = next((e for e in events if e['id'] == manual_event_id), None)

    if volunteer and matched_event:
        return jsonify({'volunteer': volunteer, 'event': matched_event}), 200
    return jsonify({"message": "No match found"}), 404

if __name__ == '__main__':
    app.run(debug=True)