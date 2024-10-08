
import './Home.css';
import Menu from './Menu';
import Profile from './Profile';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {format} from 'date-fns'; 
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Explicitly setting Axios to use the xhr adapter for browser environments.
const instance = axios.create({
  adapter: axios.defaults.adapter,
});










function Messages(){
    const [messages, setMessages] = useState([]);
    useEffect(()=>{
        axios.get('/api/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the events!', error);
      });
    },[]);
    

    const [filter, setFilter] = useState(0); 
    const filterMessages = messages.filter(message => message.read === filter);
    if(filterMessages.length === 0 && filter === 0){
        return(<p>No new messages</p>);
    }
    else if(filterMessages.length === 1 && filter === 1){
        return(<p>No old messages</p>);
    }
    return (
        <div className = "widget">
            <h2>Notifications</h2>
            <div className = "filter-buttons">
                <Button  className={filter === 0 ? 'active' : ''}  variant="Secondary"
                    onClick={() => setFilter(0)}
                >New</Button>
                <Button className={filter === 1 ? 'active' : ''}  variant="Secondary"
                    onClick={() => setFilter(1)}
                >Old</Button>
            </div>
            <ToastContainer className="toast-container">
                {
                filterMessages.map((msg) => (
                    <Toast className = "message-container"key={msg.id}>
                        <Toast.Header className="message-header">
                            <strong className="message-title">{msg.title}</strong>
                            <small className="message-time">{msg.time}</small>
                        </Toast.Header>
                        <Toast.Body className="message-body">
                            {msg.content}
                        </Toast.Body>
                    </Toast>
                    ))
                }
            </ToastContainer>
        </div> 
    );
};

function Events(){
    
    const [events, setEvents] = useState([]);
    useEffect(() =>{
        axios.get('/api/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the events!', error);
      });
  }, []);

    const [filter, setFilter] = useState('accepted'); 
    const getStatus = (eventDate, originalStatus) => {
        const currentDate = new Date();
        console.log(eventDate);
        return eventDate < currentDate ? 'passed' : originalStatus;
      };
      const filteredEvents = events.filter(event => getStatus(new Date(event.date), event.status) === filter);
    return(
        <div className = "widget">
            <h2>Events</h2>
            <div className="filter-buttons">
                <button 
                className={filter === 'accepted' ? 'active' : ''} 
                onClick={() => setFilter('accepted')}
                >
                Accepted
                </button>
                <button 
                className={filter === 'pending' ? 'active' : ''} 
                onClick={() => setFilter('pending')}
                >
                Pending
                </button>
                <button 
                className={filter === 'passed' ? 'active' : ''} 
                onClick={() => setFilter('passed')}
                >
                Passed
                </button>
            </div>
        {filteredEvents.length === 0 ? (
            <p>No {filter} events.</p>
        ) : (
        <ul className="events-list">
          {filteredEvents.map((event) => (
            <li key={event.id} className="event-item">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-date">
                {format(event.date,'MMMM d yyyy')}
              </p>
              <p className="event-content">{event.content}</p>
              <span className={`event-status ${getStatus(new Date(event.date), event.status)}`}>
                {getStatus(new Date(event.date), event.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
        </div>
    )
}

function Home({ setAuthState }) {
    return(
        <div className = "home">
      <Menu setAuthState={setAuthState} />
            <div  className="widget-container">
                <Events/>
    
                <Messages/>

                <Profile/>
            </div>
            <footer className ="foot">
                <p>
                    FAQs | Contact Us
                </p>
            </footer>
        </div>
    );
}
export default Home;