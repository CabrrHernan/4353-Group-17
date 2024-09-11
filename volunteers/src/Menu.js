import './Menu.css';

const Menu = () => {
    return ( 
        <nav className="menu">
            <h1>Volunteers</h1>
            <a href="/">Home</a>
            <a href="/Profile/">Profile</a>
            <a href="/Events/">Events</a>
            <a href="/Notifications/">Notifications</a>
            <a href="/logout">Log Out</a>
        </nav>
     );
}
 
export default Menu;

