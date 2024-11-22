# to test navigate to flask folder and run this command: python -m unittest discover
# so do:
# cd volunteers
# cd flask
# python -m unittest discover

import unittest
from app import app

class TestProfileAndVolunteerHistory(unittest.TestCase):

    def setUp(self):
        # Set up the test client
        self.app = app.test_client()
        self.app.testing = True

    # Test for getting profile with a valid user_id
    def test_get_profile(self):
        response = self.app.get('/api/get_profile', query_string={'user_id': 1})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'userName', response.data)
        self.assertIn(b'email', response.data)  # Adjust based on actual response fields

    # Test for updating profile with valid data
    def test_update_profile_valid(self):
        valid_profile_data = {
            'user_id': 1,  # Add user_id for updating the profile
            'fullName': 'Jane Doe',
            'address': '123 Main St',  # Adjusted field name
            'city': 'Houston',
            'state': 'TX',
            'zip': '77004',
            'skills': 'run, jump',  # Adjusted to match expected format
            'preferences': 'Remote',
            'availability': ['morning']
        }
        response = self.app.post('/api/update_profile', json=valid_profile_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Profile updated successfully', response.data)

    # Test for updating profile with invalid data (missing fields)
    def test_update_profile_invalid(self):
        invalid_profile_data = {
            'user_id': 1,  # Include user_id for testing
            'fullName': '',  # Empty full name (should fail validation)
            'address': '123 Main St',
            'city': 'Houston',
            'state': 'TX',
            'zip': '77004',
            'skills': '',
            'availability': []
        }
        response = self.app.post('/api/update_profile', json=invalid_profile_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Full name is required', response.data)

    # Test for getting volunteer history with a valid user_id
    def test_get_volunteer_history(self):
        response = self.app.get('/api/volunteer_history', query_string={'user_id': 1})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'eventName', response.data)
        self.assertIn(b'date', response.data)
        self.assertIn(b'rating', response.data)  # Adjust based on actual response fields

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

if __name__ == '__main__':
    unittest.main()
