import './Home.css';
import Menu from './Menu';
import Profile from './Profile';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import {format} from 'date-fns'; 
import { useEffect, useState } from 'react';
import axios from 'axios';



function Messages({authState}){
    const user = authState.username;
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState(false); 
    const [filterMessages, setFilterMessages] = useState([]);

    useEffect(()=>{
        axios.get('/api/messages', {
          params: {
            user: user
          }
      })
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching messages', error);
      });
    },[user]);

    
    
  

    const handleRead = (id) => {
      console.log(id);
      const updatedMessages = messages.map(msg => {
        if (msg.id === id) {
          return { ...msg, read: 1 }; 
        }
        return msg; 
      });
      setMessages(updatedMessages);
      axios.post("/api/read_message", 
        {'id':id})
        .then(response => {
          console.log(response.data); 
        }).catch(error => {
          console.error('There was an error updating messages', error);
        });
    };

    useEffect(() => {
      setFilterMessages(messages.filter((message) => message.read === filter));
    }, [messages, filter]);
    
    return (
        <div className = "widget">
            <h2>Notifications</h2>
            <div className = "filter-buttons">
                <Button  className={filter === false ? 'active' : ''}  variant="Secondary"
                    onClick={() => setFilter(false)}
                >New</Button>
                <Button className={filter === true ? 'active' : ''}  variant="Secondary"
                    onClick={() => setFilter(true)}
                >Old</Button>
            </div>
            {filterMessages.length === 0 && filter === false && (
                <p>No new messages</p>
            )}
            {filterMessages.length === 0 && filter === true && (
                <p>No old messages</p>
            )}

            {filterMessages.length > 0  && (
          
            <ToastContainer className="toast-container">
                {
                
                filterMessages.map((msg) => (
                    <Toast className = "message-container" key={msg.id} onClose={(e) => {e.preventDefault(); handleRead(msg.id)}}>
                        <Toast.Header className="message-header"  closeButton = {msg.read === false}>
                        
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
            )}    
        </div> 
    );
};

function Events({authState}){

    const user = authState.username;
    const [events, setEvents] = useState([]);
    useEffect(() =>{
        axios.get('/api/user_events', {
          params: {
            user: user
          }
      })
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the events!', error);
      });
  }, [user]);




    const [filter, setFilter] = useState('accepted'); 

    const handleStatus = async(id,value) =>{
      console.log(id, value);
      const updatedEvents = events.map(e => {
        if (e.id === id) {
          return { ...e, status: value }; 
        }
        return e; 
      });
      setEvents(updatedEvents);
      axios.post("/api/event_status", 
        {'id': id, 'value':value}
      )
        .then(response => {
          console.log(response.data); 
        }).catch(error => {
          console.error('There was an error updating event status', error);
        });
    }

    const getStatus = (eventDate, originalStatus) => {
        const currentDate = new Date();
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
                {format(new Date(event.date),'MMMM d yyyy')}
              </p>
              <p className="event-content">{event.content}</p>
              <span className={`event-status ${getStatus(new Date(event.date), event.status)}`}>
                {getStatus(new Date(event.date), event.status)}
                </span>
                {getStatus(new Date(event.date), event.status) === 'pending' ? 
                <div className = 'status-buttons'>
                  <button type = 'button' className = "status-button accept" id = 'accept' value = 'accept' onClick = {() =>handleStatus(event.id, 'accepted')}>Accept</button> 
                  <button type = 'button'className = "status-button decline" id = 'decline' value = 'decline' onClick = {() => handleStatus(event.id,'declined')}>Decline</button> </div>
                 : null}
                 
            </li>
          ))}
        </ul>
      )}
        </div>
    )
}

function Home({ authState  }) {

    return(
        <div className = "home">
      <Menu authState={authState} />
            <div  className="widget-container">
                <Events authState = {authState}/>
    
                <Messages authState = {authState} />

                <Profile authState = {authState}/>
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