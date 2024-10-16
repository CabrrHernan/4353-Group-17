import { useState, useEffect } from 'react';
import './Profile.css';
import default_image from './default_profilepic.png';
import DatePicker from 'react-multi-date-picker';
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
          setUserProfile(response.data);
        })
      .catch(error => {
        console.error('There was an error fetching profile data', error);
      });
    },[]);

    const handleChange = (e) =>{
      console.log(e);
      const { name, value } = e.target;
      setUserProfile((prevState) =>({
        ...prevState,
        [name]: value || ""}));
    };

    const handleMultiSelectChange = (e) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setUserProfile((prevState) => ({
        ...prevState,
        skills: selectedOptions,
      }));
    };


    const changeDate = (selectedDates) => {
      setUserProfile((prevState) => ({
        ...prevState,
        availability: selectedDates || [],
      }));
    };

    const handleSubmit =(e)=>{
      e.preventDefault();
        axios.post('/api/update_profile', {
          headers: {
            scheme: 'https',
          },
          userProfile})
        .then((response) => {
          setIsEditing(false);
          console.log(response.data.message);
        })
        .catch(error => {
          console.error('Error', error);
        });
    }

    const states = ['TX', 'CA', 'NY', 'FL'];
    const skillsOptions = ['run','jump','climb','swim'];
    return (
        <div className="widget">
            <div className='profile'>
                <h2>Profile</h2>
                <div className="profile-picture">
                    <img src={ default_image} alt = 'default'/>
                </div>

            <form className={isEditing ? 'editing' : 'viewing'} id = 'profileForm' onSubmit={handleSubmit}>
    
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
                <textarea name="preferences" value={userProfile.preferences} onChange = {handleChange} disabled={!isEditing} />
        
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
                  <button type="submit" value ="submit" form = 'profileForm'>Save</button> :
                  <button type="button" onClick={(e)=>{e.preventDefault(); setIsEditing(true)}}>Edit</button>
                }
            </form>
          </div>
        </div>
      );
    };
    
export default Profile;
