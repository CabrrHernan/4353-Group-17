from flask import Flask, request,jsonify
from flask_cors import CORS
import time
import bcrypt
import jwt
import psycopg2
from psycopg2 import OperationalError, extras
from datetime import datetime, timedelta
from models import db, User, Event, VolunteerHistory, EventMatch
from reports import reports
from datetime import datetime, timedelta, timezone

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:Coogs4life!@volunteers.clscceyqorgh.us-east-2.rds.amazonaws.com/volunteers"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

CORS(app)

app.register_blueprint(reports)

SECRET_KEY = 'your_secret_key'

DATABASE_CONFIG = {
    "host": 'volunteers.clscceyqorgh.us-east-2.rds.amazonaws.com',
    "user": 'postgres',
    "port": 5432,
    "dbname": 'volunteers',
    "password": 'Coogs4life!'
}


def is_admin(username):
    return username == 'admin'

def get_connection(retries=3, delay=2):
    for attempt in range(retries):
        try:
            conn = psycopg2.connect(**DATABASE_CONFIG)
            print("Successfully connected to the database.")
            return conn
        except OperationalError as e:
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

@app.route('/admin', methods=['GET'])
def admin_page():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"message": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    try:
        data = jwt.decode(token, 'your_secret_key', algorithms=['HS256'])
        if not is_admin(data['username']):
            return jsonify({"message": "Unauthorized"}), 403
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

    return jsonify({"message": "Welcome to the admin page"}), 200



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

    # Helper function for field validation
    def validate_field(data, field, max_length, error_message):
        if not data.get(field) or (max_length and len(data[field]) > max_length):
            return jsonify({"message": error_message}), 400
        return None  # If validation passes

    # Validate required fields
    required_fields = {
        'name': (100, "Event name is required and must be less than 100 characters"),
        'start_date': (None, "Start date is required"),
        'end_date': (None, "End date is required"),
        'description': (500, "Description is required and must be less than 500 characters"),
        'location': (200, "Location is required and must be less than 200 characters"),
        'urgency_level': (None, "Urgency level is required"),
        'required_skills': (None, "Required skills are mandatory"),
        'capacity': (None, "Capacity is required"),
    }
    
    for field, (length, message) in required_fields.items():
        validation_response = validate_field(data, field, length, message)
        if validation_response:
            return validation_response

   

    required_skills = data['required_skills']

    # Map urgency level to corresponding integer
    urgency_mapping = {"Low": 1, "Medium": 2, "High": 3}
    urgency_level = urgency_mapping.get(data.get('urgency_level', '').capitalize())
    if urgency_level is None:
        return jsonify({"message": "Invalid urgency level. Valid values are 'Low', 'Medium', or 'High'."}), 400

    # Database connection handling
    conn = None
    try:
        conn = get_connection()
        if not conn:
            raise Exception("Database connection failed")

        with conn.cursor() as cursor:
            # Set default value for is_full if not provided
            is_full = data.get('is_full', False)  # Default to False if not included

            # Insert event into the database
            cursor.execute("""
                INSERT INTO events (name, start_date, end_date, description, urgency_level, required_skills, capacity, is_full, location)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (
                data['name'], data['start_date'], data['end_date'], data['description'],
                urgency_level, required_skills, data['capacity'], is_full, data['location']
            ))

            event_id = cursor.fetchone()[0]
            conn.commit()
            return jsonify({"id": event_id, "message": "Event created successfully"}), 201

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"message": f"Database error: {str(e)}"}), 500

    finally:
        if conn:
            conn.close()



@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    conn = get_connection()

    cur = conn.cursor()

    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    if cur.fetchone() is not None:
        cur.close()
        conn.close()
        return jsonify({"message": "Username already exists"}), 400


    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cur.execute("INSERT INTO users (username, password, email) VALUES (%s, %s, %s)", 
                (username, hashed_password, email))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "User created successfully."}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    conn = get_connection()
    cur = conn.cursor(cursor_factory=extras.DictCursor)

    try:
        cur.execute("SELECT username, password, id, is_admin FROM users WHERE username = %s", (username,))
        user_record = cur.fetchone()

        if user_record is None:
            return jsonify({"message": "Invalid credentials"}), 401
        
        stored_password = user_record['password'].tobytes()

        if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return jsonify({"message": "Invalid credentials"}), 401

        token = jwt.encode({
            'username': username,
            'id': user_record['id'],
            'is_admin': user_record['is_admin'],
            'isLoggedIn': True,
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Login successful", "token": token, "is_admin": user_record['is_admin']}), 200

    finally:
        cur.close()
        conn.close()




@app.route('/api/event_status', methods = ['POST'])
def event_status():
    data = request.get_json()
    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500
    try:
        cur = conn.cursor()
        cur.execute("""UPDATE event_matches
            SET status = %s
            WHERE event_id = %s""", (data['value'],data['id']))
        conn.commit()
        print(cur.rowcount)
    except Exception as e:
        print("Error updating event status:", e)
        conn.rollback()
        return jsonify({"message": "Error updating event status"}), 500
    finally:
        cur.close()
        conn.close()

    return(jsonify({"message":"Success"}))

@app.route('/api/read_message', methods=['POST'])
def read_message():
    data = request.get_json() 
    message_id = data['id']
    print(message_id)

    if not message_id:
        return jsonify({"message": "Message ID is required."}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        sql = "UPDATE notifications SET is_read = %s WHERE id = %s"
        cursor.execute(sql, (True, message_id))
        
        if cursor.rowcount == 0:
            return jsonify({"message": "No message found with the given ID."}), 404
        
        conn.commit()
        return jsonify({"message": "Message marked as read successfully."}), 200
    except Exception as e:
        print("Error updating message:", e)
        conn.rollback()
        return jsonify({"message": "Error marking message as read."}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/messages', methods = ['GET'])
def get_messages():
    user = request.args['user']
    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500
    try:
        cur = conn.cursor()
        cur.execute("""SELECT u.id as user_id, n.id, n.message, n.is_read, n.type, n.time
                    FROM users u
                    JOIN notifications n ON u.id = n.user_id
                    WHERE u.username = %s""", (user,)
        )
        
        msg = cur.fetchone()
        messages = list()
        while(msg):
            msgObj = {
                'id':msg[1], 'content':msg[2], 'read':msg[3], 'title':msg[4], 'time':msg[5]
            }
            messages.append(msgObj)
            msg = cur.fetchone()

        return jsonify(messages), 200
    except Exception as e:
        print("Error fetching messages:", e)
        return jsonify({"message": "Error fetching messages"}), 500
    finally:
        cur.close()
        conn.close()


@app.route('/api/user_events', methods = ['GET'])
def user_events():
    user = request.args['user']
    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500
    try:
        cur = conn.cursor(cursor_factory=extras.NamedTupleCursor)
        cur.execute("""SELECT em.event_id, e.name, e.description, e.location, e.start_date, e.end_date, em.status
            FROM users u
            JOIN event_matches em ON u.id = em.user_id
            JOIN events e ON em.event_id = e.id
            WHERE u.username = %s""", (user,))
        events = list()
        event = cur.fetchone()
  
        while(event):
            eventObj = {
                'id' :event[0], 'title' : event[1], 'content' : event[2], 'date' : event[4], 'status': event[6]
            }
            events.append(eventObj)
            event = cur.fetchone()

        print(events)

        return jsonify(events), 200
    except Exception as e:
        print("Error fetching user events:", e)
        return jsonify({"message": "Error fetching user events"}), 500
    finally:
        cur.close()
        conn.close()
    


@app.route('/api/get_profile', methods=['GET'])
def get_profile():
    user = request.args['user']
    
    if not user:
        print('No user ID')
        return jsonify({"message": "User ID is required"}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT username, fullname, email, address, city, state, zip, skills, preferences, availability
            FROM users
            WHERE username = %s
        """, (user,))
        user = cursor.fetchone()
        userVals = list()
        for val in user:
            if val is None:
                userVals.append('null')
            else:
                userVals.append(val)
        if user:
            profile = {
                'userName': userVals[0],
                'fullName':userVals[1],
                'email': userVals[2],
                'address': userVals[3],
                'city': userVals[4],
                'state': userVals[5],
                'zip': userVals[6],
                'skills': userVals[7],
                'preferences': userVals[8],
                'availability': userVals[9],
            }

            return jsonify(profile), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        print("Error fetching user profile:", e)
        return jsonify({"message": "Error fetching user profile"}), 500
    finally:
        cursor.close()
        conn.close()


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
    data = request.get_json()
    profile = data['data']
    user = data['user']
    print(profile)
    print(user)
    # Validate profile data
    '''validation_error = validate_profile(profile)
    if validation_error:
        return jsonify({"message": validation_error}), 400
    '''
    
    if not user:
        return jsonify({"message": "No user found"}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        # Update user profile in the database
        update_fields = {k: v for k, v in profile.items() if v != 'null' and v is not None}
        print(update_fields)
        if not update_fields:
            return jsonify({"message": "No valid fields to update."}), 400
        set_clause = ", ".join(["{} = %s".format(field) for field in update_fields.keys()])
        values = list(update_fields.values()) + [user] 
        

        sql = "UPDATE users SET " + set_clause + " WHERE userName = %s"
       
        print(sql)
        print(values)
        cursor.execute(sql,values)
        conn.commit()
        print(cursor.rowcount)
        return jsonify({"message": "Profile updated successfully."}), 200
    except Exception as e:
        print("Error updating profile:", e)
        conn.rollback()
        return jsonify({"message": "Error updating profile"}), 500
    finally:
        cursor.close()
        conn.close()



@app.route('/api/volunteer_history', methods=['GET'])
def get_volunteer_history():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT vh.participation_date, e.name, vh.rating
            FROM volunteer_history vh
            JOIN events e ON vh.event_id = e.id
            WHERE vh.user_id = %s
        """, (user_id,))
        history = cursor.fetchall()
        history_list = []
        for record in history:
            history_list.append({
                'date': record[0].strftime('%Y-%m-%d'),
                'eventName': record[1],
                'rating': record[2],
                'status': 'Completed'  # Set as "Completed" for all entries
            })
        return jsonify(history_list), 200
    except Exception as e:
        print("Error fetching volunteer history:", e)
        return jsonify({"message": "Error fetching volunteer history"}), 500
    finally:
        cursor.close()
        conn.close()




if __name__ == '__main__':
    app.run(debug=True)