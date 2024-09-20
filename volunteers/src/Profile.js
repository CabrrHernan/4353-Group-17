import { useState } from 'react';
import './Profile.css';
import default_image from './default_profilepic.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {format} from 'date-fns'; 



const Profile = () =>{
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        pic: default_image,
        userName: 'Default',
        fullName: 'Afro Man',
        email:'yahoo@gmail.com',
        address1: '4455 University Drive',
        city: 'Houston',
        state: 'TX',
        zip: '77204',
        skills: ['run','swim'],
        preferences: 'None',
        availability: [Date('09-20-2024')],
      });

    const states = ['TX', 'CA', 'NY', 'FL'];
    const skillsOptions = ['run','jump','climb','swim'];
    return (
        <div className="widget">
            <div className='profile'>
                <h2>Profile</h2>
                <div className="profile-picture">
                    <img src={userProfile.pic} />
                </div>

            <form className={isEditing ? 'editing' : 'viewing'}>
    
                <label>User Name</label>
                <input
                type="text"
                name="userName"
                maxLength="50"
                value={userProfile.userName}
                disabled={!isEditing}
                />

                <label>Full Name</label>
                <input
                type="text"
                name="fullName"
                maxLength="50"
                value={userProfile.fullName}
                disabled={!isEditing}
                />

                <label>Email</label>
                <input
                type="text"
                name="email"
                maxLength="50"
                value={userProfile.email}
                disabled={!isEditing}
                />
        
                <label>Address 1</label>
                <input
                type="text"
                name="address1"
                maxLength="100"
                value={userProfile.address1}
                disabled={!isEditing}
                />
        

                <label>City</label>
                <input
                type="text"
                name="city"
                maxLength="100"
                value={userProfile.city}
                disabled={!isEditing}
                />
        
                <label>State</label>
                <select name="state" value={userProfile.state} disabled={!isEditing}>
                {states.map((state, index) => (
                    <option key={index} value={state}>
                    {state}
                    </option>
                ))}
                </select>
        
                <label>Zip Code</label>
                <input
                type="text"
                name="zip"
                maxLength="9"
                minLength="5"
                value={userProfile.zip}
                disabled={!isEditing}
                />

                <label>Skills</label>
                <select name="skills" multiple value={userProfile.skills} disabled={!isEditing}>
                {skillsOptions.map((skill, index) => (
                    <option key={index} value={skill}>
                    {skill}
                    </option>
                ))}
                </select>
        
                <label>Preferences</label>
                <textarea name="preferences" value={userProfile.preferences} disabled={!isEditing} />
        
                <label>Availability</label>
        {isEditing ? (
          <DatePicker
            multiple
            inline
            isMultiSelect
          />
        ) : (
          <ul>
            {userProfile.availability.map((date, index) => (
              <li key={index}>{format(date,'MMMM d yyyy')} </li>
            ))}
          </ul>
        )}

                <button type="button" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Save' : 'Edit'}
                </button>
            </form>
          </div>
        </div>
      );
    };
    
export default Profile;