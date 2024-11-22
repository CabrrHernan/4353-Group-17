from flask import Blueprint, jsonify, send_file, request
from flask_cors import CORS
import csv
import time
from io import StringIO, BytesIO
from reportlab.pdfgen import canvas
import psycopg2
from psycopg2 import OperationalError, extras

from models import db, User, Event, VolunteerHistory, EventMatch

reports = Blueprint('reports', __name__)

DATABASE_CONFIG = {
    "host": 'volunteers.clscceyqorgh.us-east-2.rds.amazonaws.com',
    "user": 'postgres',
    "port": 5432,
    "dbname": 'volunteers',
    "password": 'Coogs4life!'
}

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
def generate_csv(data, filename):
    si = StringIO()
    writer = csv.writer(si)
    if data:
        writer.writerow(data[0].keys())  # Write headers
        for row in data:
            writer.writerow(row.values())  # Write data rows
    output = BytesIO()
    output.write(si.getvalue().encode('utf-8'))
    output.seek(0)
    return send_file(output, mimetype='text/csv', as_attachment=True, download_name=filename)

def generate_pdf(data, filename):
    output = BytesIO()
    pdf = canvas.Canvas(output)
    if data:
        pdf.drawString(50, 800, ', '.join(data[0].keys()))  # Draw headers
        y = 780
        for row in data:
            pdf.drawString(50, y, ', '.join(map(str, row.values())))
            y -= 20
    pdf.save()
    output.seek(0)
    return send_file(output, mimetype='application/pdf', as_attachment=True, download_name=filename)

@reports.route('/report/volunteers', methods=['GET'])
def get_volunteer_report():
    try:
        volunteers = db.session.query(User, VolunteerHistory).join(VolunteerHistory, User.id == VolunteerHistory.user_id).all()
        volunteer_report = []
        for user, history in volunteers:
            events = Event.query.filter(Event.id.in_([h.event_id for h in history])).all()
            event_names = [event.name for event in events]
            volunteer_report.append({
                'username': user.username,
                'email': user.email,
                'location': user.location,
                'skills': user.skills,
                'participated_events': event_names
            })

        format_type = request.args.get('format', 'json').lower()
        if format_type == 'csv':
            return generate_csv(volunteer_report, 'volunteer_report.csv')
        elif format_type == 'pdf':
            return generate_pdf(volunteer_report, 'volunteer_report.pdf')
        else:
            return jsonify(volunteer_report), 200
    except Exception as e:
        print(f"Error fetching volunteer report: {e}")
        return jsonify({'error': 'Failed to fetch volunteer report'}), 500

@reports.route('/report/events', methods=['GET'])
def get_event_report():
    conn = get_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = conn.cursor()
    try:
        print("Querying events and matches...")  # Debugging output
        
        cursor.execute("""
            SELECT 
                e.id AS event_id,
                e.name AS event_name,
                e.start_date,
                u.username AS volunteer_name
            FROM 
                events e
            LEFT JOIN 
                event_matches em ON e.id = em.event_id
            LEFT JOIN 
                users u ON em.user_id = u.id;
        """)

        event_rows = cursor.fetchall()

        # Print fetched rows for debugging
        print(f"Fetched event rows: {event_rows}") 
        
        if not event_rows:
            print("No event-match data found")
            return jsonify({'error': 'No events or matches found'}), 404
        
        # Initialize an empty dictionary to store event details
        events_dict = {}

        for row in event_rows:
            event_id = row[0]
            event_name = row[1]
            start_date = row[2]
            volunteer_name = row[3]
            
            # Check if the event already exists in the dictionary
            if event_id not in events_dict:
                events_dict[event_id] = {
                    'id': event_id,
                    'name': event_name,
                    'start_date': start_date,
                    'volunteers_assigned': []
                }

            # If there's a volunteer, add it to the list of volunteers for the event
            if volunteer_name:
                events_dict[event_id]['volunteers_assigned'].append(volunteer_name)

        # Convert the events_dict to a list for the final report
        event_report = list(events_dict.values())

        # If no events were found, return a 404 error
        if not event_report:
            return jsonify({'message': 'No event data available'}), 404
        
        print("Building response...")

        format_type = request.args.get('format', 'json').lower()
        if format_type == 'csv':
            print("Returning CSV response")
            return generate_csv(event_report, 'event_report.csv')
        elif format_type == 'pdf':
            print("Returning PDF response")
            return generate_pdf(event_report, 'event_report.pdf')
        else:
            print("Returning JSON response")
            return jsonify(event_report), 200

    except Exception as e:
        print(f"Error fetching event report: {e}")
        return jsonify({'error': f'Failed to fetch event report: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()
