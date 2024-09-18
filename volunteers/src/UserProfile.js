import React, { useState } from 'react';

const UserProfile = () => {
    // Dummy user data
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');

    return (
        <div>
            <h1>User Profile</h1>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            {/* You can add forms to update the profile if needed */}
        </div>
    );
};

export default UserProfile;
