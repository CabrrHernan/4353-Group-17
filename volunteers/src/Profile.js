import { useState, useEffect } from 'react';
import './Profile.css';
import default_image from './default_profilepic.png';
import DatePicker from 'react-multi-date-picker';
import "react-multi-date-picker/styles/layouts/prime.css"
import {format} from 'date-fns'; 
import axios from 'axios';




function Profile({authState}){
      const username = authState.username;
      console.log("profile", username);
      const [isEditing, setIsEditing] = useState(false);
      const [userProfile, setUserProfile] = useState({
        pic: default_image,
        userName: "name",
        fullName: 'null',
        email:'null',
        address: 'null',
        city: 'null',
        state: 'null',
        zip: 'null',
        skills: ['null'],
        preferences: 'None',
        availability: [],
      },[]);

      useEffect(() => {
        axios.get('/api/get_profile', {
          params: {
            user: username  
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          setUserProfile(response.data);
          
        })
        .catch(error => {
          console.error('There was an error fetching profile data', error);
        });
      }, [username]);
      
    

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
      console.log(userProfile)
      e.preventDefault();
        axios.post('/api/update_profile', 
          {'data':userProfile, 'user': username})
        .then((response) => {
          setIsEditing(false);
          console.log(response.data.message);
        })
        .catch(error => {
          console.error('Error', error);
        });
    }

    const states = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
    
    const skillsOptions = ['Communication','Leadership','Technology','Management'];
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
                disabled= {true}
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
        
                <label>Address</label>
                <input
                type="text"
                name="address"
                maxLength="100"
                value={userProfile.address}
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
        
                <label >Availability</label>
                {isEditing ? (

                    <DatePicker
                      class = "date-picker"
                      name="availability"
                      multiple
                      value={userProfile.availability}
                      onChange={changeDate}
                    />
                ) : (
                  userProfile.availability === 'null' ? (
                    <p>No availability selected</p>
                  ) : (
                    <ul>
                      {userProfile.availability.map((date, index) => (
                        <li key={index}>{format(date, 'MMMM d yyyy')}</li>
                      ))}
                    </ul>
                  )
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
