import { useState, useEffect } from 'react';
import './Profile.css';
import default_image from './default_profilepic.png';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/prime.css';
import {format} from 'date-fns'; 
import axios from 'axios';



const Profile = () =>{
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
      pic: default_image,
      userName: "name",
      fullName: 'Afro Man',
      email:'yahoo@gmail.com',
      address1: '4455 University Drive',
      city: 'Houston',
      state: 'TX',
      zip: '77204',
      skills: ['run','swim'],
      preferences: 'None',
      availability: [],
    },[]);

      useEffect(()=>{
        axios.get('/api/get_profile')
      .then(response => {
          let profile = response.data;
          setUserProfile(response.data);
        })
      .catch(error => {
        console.error('There was an error fetching profile data', error);
      });
    },[]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUserProfile({...userProfile,[name]: value });
    };

    const handleMultiSelectChange = (e) => {
      const selectedOptions = [...e.target.selectedOptions].map(option => option.value);
      setUserProfile({ ...userProfile, skills : selectedOptions });
    };


    const changeDate = (vals) =>{

      setUserProfile({userProfile, availability : vals});
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        const response = await fetch('/api/update_profile',{
          method:'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(userProfile),
        });
        if(response.ok){
          const result = await response.json();
        }
        else{
          console.error("Error updating Profile");
        }
      }
      catch(error){
        console.error('Error', error);
      }
    };

    const states = ['TX', 'CA', 'NY', 'FL'];
    const skillsOptions = ['run','jump','climb','swim'];
    return (
        <div className="widget">
            <div className='profile'>
                <h2>Profile</h2>
                <div className="profile-picture">
                    <img src={ default_image} />
                </div>

            <form className={isEditing ? 'editing' : 'viewing'} onSubmit={handleSubmit}>
    
                <label>User Name</label>
                <input
                type="text"
                name="userName"
                maxLength="50"
                value={userProfile.userName}
                onChange={handleChange}
                disabled={!isEditing}
                />

                <label>Full Name</label>
                <input
                type="text"
                name="fullName"
                maxLength="50"
                value={userProfile.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                />

                <label>Email</label>
                <input
                type="text"
                name="email"
                maxLength="50"
                value={userProfile.email}
                onChange={handleChange}
                disabled={!isEditing}
                />
        
                <label>Address 1</label>
                <input
                type="text"
                name="address1"
                maxLength="100"
                value={userProfile.address1}
                onChange={handleChange}
                disabled={!isEditing}
                />
        

                <label>City</label>
                <input
                type="text"
                name="city"
                maxLength="100"
                value={userProfile.city}
                onChange={handleChange}
                disabled={!isEditing}
                />
        
                <label>State</label>
                <select name="state" value={userProfile.state} onChange={handleChange} disabled={!isEditing}>
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
                onChange={handleChange}
                disabled={!isEditing}
                />

                <label>Skills</label>
                <select name="skills" multiple value={userProfile.skills} onChange = {handleMultiSelectChange} disabled={!isEditing}>
                {skillsOptions.map((skill, index) => (
                    <option key={index} value={skill}>
                    {skill}
                    </option>
                ))}
                </select>
        
                <label>Preferences</label>
                <textarea name="preferences" value={userProfile.preferences} onChange={handleChange} disabled={!isEditing} />
        
                <label>Availability</label>
        {isEditing ? (
          <DatePicker
            name = "availability"
            multiple
            value = {userProfile.availability}
            onChange = {changeDate}
          />
        ) : (
          <ul>
            {userProfile.availability.map((date, index) => (
              <li key={index}>{format(date,'MMMM d yyyy')} </li>
            ))}
          </ul>
        )}
                {isEditing ? 
                  <button type="submit" onSubmit={handleSubmit} onClick={() => setIsEditing(!isEditing)}>Save</button> :
                  <button type="button" onClick={() => setIsEditing(!isEditing)}>Edit</button>

                }
            </form>
          </div>
        </div>
      );
    };
    
export default Profile;