
import './Home.css';
import Menu from './Menu';
import Profile from './Profile';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {format} from 'date-fns'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const messagesData = [
    { id: 1, title: 'Message 1', time: 'just now', content: 'Message content 1' , read: 0},
    { id: 2, title: 'Message 2', time: '2 minutes ago', content: 'Message content 2', read: 1},
    { id: 3, title: 'Message 3', time: '5 minutes ago', content: 'Message content 3', read: 1 },
    { id: 4, title: 'Message 4', time: '10 minutes ago', content: 'Message content 4', read: 0 }
];

const eventsData = [
    {id: 1, title: 'Event 1', date: new Date(2024, 9, 19, 12, 30), content: 'Event 1 Description', status: 'accepted'},
    {id: 2, title: 'Event 2', date: new Date(2024, 10, 20, 12, 30), content: 'Event 2 Description', status: 'accepted'},
    {id: 3, title: 'Event 3', date: new Date(2025, 2, 18, 8), content: 'Event 3 Description', status: 'pending'},
    {id: 4, title: 'Event 4', date: new Date(2024, 8, 2, 16, 45), content: 'Event 4 Description', status: 'accepted'},
];



function Messages({ messages = messagesData}){
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

function Events({events = eventsData}){
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