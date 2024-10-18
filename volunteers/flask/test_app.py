#to test navigate to flask folder and run this command: python -m unittest discover
#so do:
# cd volunteers
# cd flask
#python -m unittest discover

import unittest
from app import app

class TestProfileAndVolunteerHistory(unittest.TestCase):

    def setUp(self):
        # Set up the test client
        self.app = app.test_client()
        self.app.testing = True

    # Test for getting profile
    def test_get_profile(self):
        response = self.app.get('/api/get_profile')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'userName', response.data)
        self.assertIn(b'fullName', response.data)

    # Test for updating profile with valid data
    def test_update_profile_valid(self):
        valid_profile_data = {
            'fullName': 'Jane Doe',
            'address1': '123 Main St',
            'city': 'Houston',
            'state': 'TX',
            'zip': '77004',
            'skills': ['run', 'jump'],
            'availability': ['2024-10-10'],
        }
        response = self.app.post('/api/update_profile', json=valid_profile_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Profile updated successfully', response.data)

    # Test for updating profile with invalid data (missing fields)
    def test_update_profile_invalid(self):
        invalid_profile_data = {
            'fullName': '',  # Empty full name (should fail validation)
            'address1': '123 Main St',
            'city': 'Houston',
            'state': 'TX',
            'zip': '77004',
            'skills': [],
            'availability': []
        }
        response = self.app.post('/api/update_profile', json=invalid_profile_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Full name is required', response.data)

    # Test for getting volunteer history
    def test_get_volunteer_history(self):
        response = self.app.get('/api/volunteer_history')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'eventName', response.data)
        self.assertIn(b'role', response.data)

if __name__ == '__main__':
    unittest.main()
