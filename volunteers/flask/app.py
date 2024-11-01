from flask import Flask, request,jsonify
from flask_cors import CORS
import time
import bcrypt
import jwt
import pg8000
from datetime import datetime, timedelta

from datetime import datetime, timedelta, timezone
app = Flask(__name__)
CORS(app)

DATABASE_CONFIG = {
    "host": "localhost",
    "user": "postgres",
    "port": 5432,
    "database": "4353",
    "password": "4353"
}


def get_connection(retries=3, delay=2):
    for attempt in range(retries):
        try:
            conn = pg8000.connect(**DATABASE_CONFIG)
            return conn
        except pg8000.DatabaseError as e:
            print(f"Database connection error on attempt {attempt + 1}: {e}")
            time.sleep(delay)
    print("Failed to connect to the database after multiple attempts.")
    return None


@app.route('/index')
def index():
    conn = get_connection()
    conn.close()
    return "Connected to the database!"


users = {}

SECRET_KEY = 'your_secret_key'

@app.route('/')
def home():
    return "Welcome to the API"

volunteers = []
users = []

events = [
        {'id': 1, 'title': 'Event 1', 'date': '2024-09-19', 'content': 'Event 1 Description', 'status': 'accepted'},
        {'id': 2, 'title': 'Event 2', 'date': '2024-10-20', 'content': 'Event 2 Description', 'status': 'pending'},
        {'id': 3, 'title': 'Event 3', 'date': '2025-02-18', 'content': 'Event 3 Description', 'status': 'pending'},
        {'id': 4, 'title': 'Event 4', 'date': '2024-08-02', 'content': 'Event 4 Description', 'status': 'passed'},
        {'id': 5, 'title': 'Hackathon', 'date': '2024-09-19', 'content': 'Hackathon Event', 'status': 'accepted', 'requiredSkill': 'Programming'},
        {'id': 6, 'title': 'Fundraising Campaign', 'date': '2024-10-20', 'content': 'Fundraising Campaign', 'status': 'accepted', 'requiredSkill': 'Project Management'}
]

volunteers = [
    {'id': 1, 'name': 'John Doe', 'profile': 'Programming'},
    {'id': 2, 'name': 'Jane Smith', 'profile': 'Project Management'}
]

@app.route('/api/volunteers', methods=['GET'])
def get_volunteers():
    return jsonify(volunteers),200
messages= [
        { 'id': 1, 'title': 'Message 1', 'time': 'just now', 'content': 'Message content 1' , 'read': 0},
        { 'id': 2, 'title': 'Message 2', 'time': '2 minutes ago', 'content': 'Message content 2', 'read': 1},
        { 'id': 3, 'title': 'Message 3', 'time': '5 minutes ago', 'content': 'Message content 3', 'read': 1 },
        { 'id': 4, 'title': 'Message 4', 'time': '10 minutes ago', 'content': 'Message content 4', 'read': 0 }
    ]

@app.route('/api/users', methods=['GET'])
def get_users():
    global users  
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, username, email, location, skills, preferences FROM users")
        users = cursor.fetchall()  
        
        users_list = [{'id': u[0], 'username': u[1], 'email': u[2], 'location': u[3], 'skills': u[4], 'preferences': u[5]} for u in users]
        return jsonify(users_list), 200
    except Exception as e:
        print("Error fetching users:", e)
        return jsonify({"message": "Error fetching users"}), 500
    finally:
        cursor.close()
        conn.close()



@app.route('/api/match', methods=['POST'])
def match_user():
    data = request.get_json()
    user_id = data.get('volunteer_id')  # Use 'volunteer_id' from the form
    manual_event_id = data.get('manual_event_id')

    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = conn.cursor()
    try:
        # Insert matched user and event into the database with status 'pending'
        cursor.execute("""
            INSERT INTO event_matches (user_id, event_id, status)
            VALUES (%s, %s, 'pending') RETURNING id
        """, (user_id, manual_event_id))
        
        match_id = cursor.fetchone()[0]
        conn.commit()
        
        return jsonify({"message": "Volunteer matched successfully!", "match_id": match_id}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()



@app.route('/api/events', methods=['GET'])
def get_events():
    global events  
    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, name, description, location, required_skills, urgency_level, start_date, end_date, capacity, is_full FROM events")
        event_rows = cursor.fetchall()  

        # Convert tuples to a list of dictionaries
        events = [
            {
                'id': row[0],
                'name': row[1],
                'description': row[2],
                'location': row[3],
                'required_skills': row[4],
                'urgency_level': row[5],
                'start_date': row[6],
                'end_date': row[7],
                'capacity': row[8],
                'is_full': row[9],
            } for row in event_rows
        ]

        return jsonify(events), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/api/create_event', methods=['POST'])
def create_event():
    data = request.get_json()

    required_fields = {
        'name': (100, "Event name is required and must be less than 100 characters"),
        'start_date': (None, "Start date is required"),
        'end_date': (None, "End date is required"),
        'description': (500, "Description is required and must be less than 500 characters"),
        'urgency_level': (None, "Urgency level is required"),
        'required_skills': (None, "Required skills are mandatory"),
        'capacity': (None, "Capacity is required"),
    }

    for field, (length, message) in required_fields.items():
        if not data.get(field) or (length and len(data[field]) > length):
            return jsonify({"message": message}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        with conn.cursor() as cursor:
            # Set default value for is_full if not provided
            is_full = data.get('is_full', False)  # Default to False if not included

            cursor.execute("""
                INSERT INTO events (name, start_date, end_date, description, urgency_level, required_skills, capacity, is_full)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (data['name'], data['start_date'], data['end_date'], data['description'], 
                  data['urgency_level'], data['required_skills'], data['capacity'], is_full))  # Use is_full here

            event_id = cursor.fetchone()[0]
            conn.commit()
            return jsonify({"id": event_id, "message": "Event created successfully"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        conn.close()

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
        'exp': datetime.now(timezone.utc) + timedelta(hours=1)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({"message": "Login successful", "token": token})


@app.route('/api/event_status', methods = ['POST'])
def event_status():
    data = request.get_json()
    for event in events:
        if event['id'] == data['id']:
            event['status'] = data['value']
    print(events)
    return(jsonify({"message":"Success"}))

@app.route('/api/read_message', methods = ['POST'])
def read_message():
    id = request.get_json()
    print(id)
    return(jsonify({"message":"Success"}))

@app.route('/api/messages', methods = ['GET'])
def get_messages():
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


def validate_profile(profile):
    if not profile.get('fullName') or len(profile['fullName']) > 50:
        return "Full name is required and must be less than 50 characters."
    if not profile.get('address') or len(profile['address']) > 100:
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


@app.route('/api/update_profile', methods=['POST'])
def update_profile():
    profile = request.get_json()
    print(profile)
    # Validate profile data
    validation_error = validate_profile(profile)
    print(validation_error)
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



if __name__ == '__main__':
    app.run(debug=True)