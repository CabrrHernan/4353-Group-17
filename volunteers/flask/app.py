from flask import Flask, request,jsonify
from flask_cors import CORS
import bcrypt
import jwt
import pg8000
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

DATABASE_CONFIG = {
    "host": "localhost",
    "user": "postgres",
    "port": 5432,
    "database": "4353",
    "password": "4353"
}


def get_connection():
    try:
        conn = pg8000.connect(**DATABASE_CONFIG)
        return conn
    except pg8000.DatabaseError as e:
        print("Database connection error:", e)
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
    print('Received data:', data)  # Log the incoming data for debugging
    user_id = data.get('user_id')  # Change 'volunteer_id' to 'user_id'
    manual_event_id = data.get('manual_event_id')

    # Ensure the IDs are integers for consistent matching
    user = next((u for u in users if u['id'] == int(user_id)), None)
    matched_event = None

    if user and not manual_event_id:
        # Match based on required skills
        matched_event = next((e for e in events if e['required_skill'] in user['skills']), None)
    elif manual_event_id:
        # Match based on manually selected event
        matched_event = next((e for e in events if e['id'] == int(manual_event_id)), None)

    if user and matched_event:
        return jsonify({'user': user, 'event': matched_event}), 200

    return jsonify({"message": "No match found"}), 404

@app.route('/api/events', methods=['GET'])
def get_events():
    global events  
    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, title, date, content, status, required_skill FROM events")
        event_rows = cursor.fetchall()  

        # Convert tuples to a list of dictionaries
        events = [
            {
                'id': row[0],
                'title': row[1],
                'date': row[2],
                'content': row[3],
                'status': row[4],
                'required_skill': row[5],
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

    # Validating required fields
    required_fields = {
        'title': (100, "Title is required and must be less than 100 characters"),
        'date': (None, "Date is required"),
        'content': (500, "Content is required and must be less than 500 characters"),
        'status': (['accepted', 'pending', 'passed'], "Status is required and must be 'accepted', 'pending', or 'passed'"),
        'requiredSkill': (None, "Required skill is mandatory"),
    }

    for field, (length, message) in required_fields.items():
        if not data.get(field) or (length and len(data[field]) > length):
            return jsonify({"message": message}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO events (title, date, content, status, required_skill)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """, (data['title'], data['date'], data['content'], data['status'], data['requiredSkill']))
        event_id = cursor.fetchone()[0]
        conn.commit()
        return jsonify({"id": event_id, "message": "Event created successfully"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
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
        'exp': datetime.utcnow() + timedelta(hours=1)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({"message": "Login successful", "token": token})



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



if __name__ == '__main__':
    app.run(debug=True)