
import './Home.css';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';



export const Menu = () => {
    let user = "Volunteer";
    return ( 
        <nav className="menu">
            <h1>Welcome, {user}</h1>
            <a href="/">Home</a>
            <a href="/Profile/">Profile</a>
            <a href="/Events/">Events</a>
            <a href="/Notifications/">Notifications</a>
            <a href="/logout">Log Out</a>
        </nav>
     );
}

const messagesData = [
    { id: 1, title: 'Message 1', time: 'just now', content: 'Message content 1' },
    { id: 2, title: 'Message 2', time: '2 minutes ago', content: 'Message content 2' },
    { id: 3, title: 'Message 3', time: '5 minutes ago', content: 'Message content 3' },
    { id: 4, title: 'Message 4', time: '10 minutes ago', content: 'Message content 4' }
];


export const Messages = ({ messages = messagesData }) => {
    return (
        <ToastContainer className="toast-container">
            {messages.length ===0 ?(
                <p>No new messages</p>
            ):(
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
            )}
        </ToastContainer>
    );
}




export const Widget = ({className,Header,Body}) =>{
    let buttons;
    if(className === "notifications"){
        buttons =  <ButtonGroup>
                <Button variant="Secondary">New</Button>
                <Button variant="Secondary">Old</Button>
            </ButtonGroup>;
    }
    else if(className === "events"){
        buttons =  <ButtonGroup>
                <Button variant="Secondary">Upcoming</Button>
                <Button variant="Secondary">Pending</Button>
                <Button variant="Secondary">Past</Button>
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

export const Home = () =>{
    return(
        <div className = "home">
            <Menu/>
            <div  className="widget-container">
                <Widget className = "events" Header = {<h2>Events</h2>} Body = {<p>Null</p>}/>
    
                <Widget className = "notifications" Header = {<h2>Notifications</h2>} Body = {<Messages/>}/>

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