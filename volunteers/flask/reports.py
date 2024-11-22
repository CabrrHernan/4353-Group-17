from flask import Blueprint, jsonify, send_file, request
import csv
from io import StringIO, BytesIO
from reportlab.pdfgen import canvas
from models import db, User, Event, VolunteerHistory, EventMatch

reports = Blueprint('reports', __name__)

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
    try:
        events = db.session.query(Event, EventMatch).join(EventMatch, Event.id == EventMatch.event_id).all()
        event_report = []
        for event, match in events:
            volunteers = User.query.filter(User.id.in_([m.user_id for m in match])).all()
            volunteer_names = [volunteer.username for volunteer in volunteers]
            event_report.append({
                'event_name': event.name,
                'event_date': event.date,
                'volunteers_assigned': volunteer_names
            })

        format_type = request.args.get('format', 'json').lower()
        if format_type == 'csv':
            return generate_csv(event_report, 'event_report.csv')
        elif format_type == 'pdf':
            return generate_pdf(event_report, 'event_report.pdf')
        else:
            return jsonify(event_report), 200
    except Exception as e:
        print(f"Error fetching event report: {e}")
        return jsonify({'error': 'Failed to fetch event report'}), 500
