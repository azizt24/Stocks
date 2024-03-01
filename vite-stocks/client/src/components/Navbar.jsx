import { useContext } from 'react'; // React import removed for React 17+
import { Link } from 'react-router-dom'; // Use Link for navigation
import { GeneralContext } from '../context/GeneralContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const usertype = localStorage.getItem('userType'); // Retrieve user type
    const { logout } = useContext(GeneralContext); // Use context for logout

    return (
        <div className="navbar">
            <h3>SB Stocks {usertype === 'admin' && '(Admin)'}</h3>

            <div className="nav-options">
                {!usertype ? (
                    <ul>
                        <li className='header-li'><a href="#home">Home</a></li>
                        <li className='header-li'><a href="#about">About</a></li>
                        <li className='header-li'><a href="#home">Join now</a></li>
                    </ul>
                ) : (
                    <>
                        <Link to="/home">Home</Link>
                        {usertype === 'customer' ? (
                            <>
                                <Link to="/portfolio">Portfolio</Link>
                                <Link to="/history">History</Link>
                                <Link to="/profile">Profile</Link>
                            </>
                        ) : (
                            usertype === 'admin' && (
                                <>
                                    <Link to="/users">Users</Link>
                                    <Link to="/all-orders">Orders</Link>
                                    <Link to="/all-transactions">Transactions</Link>
                                </>
                            )
                        )}
                        <button onClick={logout}>Logout</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
