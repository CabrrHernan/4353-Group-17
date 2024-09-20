
import './Home.css';
import Menu from './Menu';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const messagesData = [
    { id: 1, title: 'Message 1', time: 'just now', content: 'Message content 1' , read: 0},
    { id: 2, title: 'Message 2', time: '2 minutes ago', content: 'Message content 2', read: 1},
    { id: 3, title: 'Message 3', time: '5 minutes ago', content: 'Message content 3', read: 1 },
    { id: 4, title: 'Message 4', time: '10 minutes ago', content: 'Message content 4', read: 0 }
];

const eventsData = [
    {id: 1, title: 'Event 1', date: Date(2024, 9, 19, 12, 30), content: 'Event 1 Description', status: 'accepted'},
    {id: 2, title: 'Event 2', date: Date(2024, 10, 20, 12, 30), content: 'Event 2 Description', status: 'accepted'},
    {id: 3, title: 'Event 3', date: Date(2025, 2, 18, 8), content: 'Event 3 Description', status: 'pending'},
    {id: 4, title: 'Event 4', date: Date(2024, 8, 2, 16, 45), content: 'Event 4 Description', status: 'accepted'},
];



function Messages({ messages = messagesData}){
    
    if(messages.length === 0){
        return(<p>No new messages</p>);
    }
    return (
        <div className = "widget">
            <h2>Notifications</h2>
            <ButtonGroup>
                <Button  className = "new" variant="Secondary">New</Button>
                <Button className ="old" variant="Secondary">Old</Button>
            </ButtonGroup>
            <ToastContainer className="toast-container">
                {
                messages.map((msg) => (
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
    return(
        <div className = "widget">
            <h2>Events</h2>

        </div>
    )
}


function Widget({className,Header,Body}){
    let buttons;
    if(className === "events"){
        buttons =  <ButtonGroup>
                <Button className = "upcoming" variant="Secondary">Upcoming</Button>
                <Button className = "pending" variant="Secondary">Pending</Button>
                <Button className = "past" variant="Secondary">Past</Button>
            </ButtonGroup>;
    }
    else{
        buttons = null;
    }
    return(
        <div className = "widget" >
            {Header}
            {buttons}
            {Body}
        </div>
    );
}

function Home(){
    
    return(
        <div className = "home">
            <Menu/>
            <div  className="widget-container">
                <Widget className = "events" Header = {<h2>Events</h2>} Body = {<p>Null</p>}/>
    
                <Messages/>

                <Widget className = "profile-view" Header = {<h2>Profile</h2>} Body = {<p>User info</p>}/>
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