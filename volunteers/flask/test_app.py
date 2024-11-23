import unittest
from app import app

class TestProfileAndVolunteerHistory(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # Test for getting profile with a valid user_id
    def test_get_profile(self):
        response = self.app.get('/api/get_profile', query_string={'user_id': 1})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'userName', response.data)
        self.assertIn(b'email', response.data)  # Adjust based on actual response fields

    # Test for getting profile with an invalid user_id
    def test_get_profile_invalid(self):
        response = self.app.get('/api/get_profile', query_string={'user_id': 999})
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'User not found', response.data)

    # Test for updating profile with valid data
    def test_update_profile_valid(self):
        valid_profile_data = {
            'data': {  # Wrapped in a "data" key
                'fullName': 'Jane Doe',
                'address': '123 Main St',
                'city': 'Houston',
                'state': 'TX',
                'zip': '77004',
                'skills': 'run, jump',
                'preferences': 'Remote',
                'availability': ['morning']
            },
            'user': 'testuser'  # Add "user" field
        }

        response = self.app.post('/api/update_profile', json=valid_profile_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Profile updated successfully', response.data)

    # Test for updating profile with invalid data (missing fields)
    def test_update_profile_invalid(self):
        invalid_profile_data = {
            'data': {  # Wrapped in a "data" key
                'fullName': '',  # Empty full name (should fail validation)
                'address': '123 Main St',
                'city': 'Houston',
                'state': 'TX',
                'zip': '77004',
                'skills': '',
                'preferences': '',
                'availability': []
            },
            'user': 'testuser'  # Add "user" field
        }

        response = self.app.post('/api/update_profile', json=invalid_profile_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Full name is required', response.data)

    # Test for unauthorized access to profile update
    def test_update_profile_unauthorized(self):
        invalid_profile_data = {
            'data': {  # Wrapped in a "data" key
                'fullName': 'Unauthorized User',
                'address': '456 Main St',
                'city': 'Houston',
                'state': 'TX',
                'zip': '77005',
                'skills': 'hacking',
                'preferences': 'None',
                'availability': ['evening']
            },
            'user': ''  # Empty user (unauthorized)
        }

        response = self.app.post('/api/update_profile', json=invalid_profile_data)
        self.assertEqual(response.status_code, 401)
        self.assertIn(b'Unauthorized access', response.data)

    # Test for getting volunteer history with a valid user_id
    def test_get_volunteer_history(self):
        response = self.app.get('/api/volunteer_history', query_string={'user_id': 1})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'eventName', response.data)
        self.assertIn(b'date', response.data)
        self.assertIn(b'rating', response.data)  # Adjust based on actual response fields

    # Test for getting volunteer history with an invalid user_id
    def test_get_volunteer_history_invalid(self):
        response = self.app.get('/api/volunteer_history', query_string={'user_id': 999})
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'No volunteer history found', response.data)

class TestLogin(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_login_valid(self):
        response = self.app.post('/api/login', json={
            'username': 'testuser',
            'password': 'password'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login successful', response.data)
        self.assertIn(b'token', response.data)

    def test_login_invalid(self):
        response = self.app.post('/api/login', json={
            'username': 'invaliduser',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn(b'Invalid credentials', response.data)

    def test_login_missing_credentials(self):
        response = self.app.post('/api/login', json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Missing username or password', response.data)

class TestCreateEvent(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_create_event_valid(self):
        response = self.app.post('/api/create_event', json={
            'name': 'New Event',
            'start_date': '2023-01-01T10:00:00',
            'end_date': '2023-01-01T12:00:00',
            'description': 'Event Description',
            'location': 'Event Location',
            'urgency_level': 'High',
            'required_skills': 'Skills',
            'capacity': 100,
            'is_full': False
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Event created successfully', response.data)

    def test_create_event_invalid(self):
        response = self.app.post('/api/create_event', json={
            'name': '',
            'start_date': '2023-01-01T10:00:00',
            'end_date': '2023-01-01T12:00:00',
            'description': 'Event Description',
            'location': 'Event Location',
            'urgency_level': 'High',
            'required_skills': 'Skills',
            'capacity': 100,
            'is_full': False
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Event name is required', response.data)

    def test_create_event_unauthorized(self):
        response = self.app.post('/api/create_event', json={
            'name': 'Unauthorized Event',
            'start_date': '2023-01-01T10:00:00',
            'end_date': '2023-01-01T12:00:00',
            'description': 'Unauthorized event description',
            'location': 'Event Location',
            'urgency_level': 'Low',
            'required_skills': 'None',
            'capacity': 50,
            'is_full': False
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn(b'Unauthorized to create event', response.data)

class TestReports(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_volunteer_report_json(self):
        response = self.app.get('/report/volunteers?format=json')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'username', response.data)

    def test_event_report_json(self):
        response = self.app.get('/report/events?format=json')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'event_name', response.data)

    def test_volunteer_report_csv(self):
        response = self.app.get('/report/volunteers?format=csv')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'text/csv')

    def test_event_report_csv(self):
        response = self.app.get('/report/events?format=csv')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'text/csv')

    def test_volunteer_report_pdf(self):
        response = self.app.get('/report/volunteers?format=pdf')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/pdf')

    def test_event_report_pdf(self):
        response = self.app.get('/report/events?format=pdf')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/pdf')

    def test_report_invalid_format(self):
        response = self.app.get('/report/volunteers?format=xml')
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Invalid report format', response.data)

    if __name__ == '__main__':
        unittest.main()