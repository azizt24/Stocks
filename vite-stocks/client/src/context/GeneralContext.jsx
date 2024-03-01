import { createContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for props validation
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  const inputs = { username, email, usertype, password };
  const navigate = useNavigate();

  const login = async () => {
    try {
      const loginInputs = { email, password };
      await axios.post('http://localhost:6001/login', loginInputs)
        .then((res) => {
          localStorage.setItem('userId', res.data._id);
          localStorage.setItem('userType', res.data.usertype);
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('email', res.data.email);
          localStorage.setItem('balance', res.data.balance);

          navigate(res.data.usertype === 'customer' ? '/home' : '/admin');
        })
        .catch((err) => {
          console.error(err);
          alert("Login failed");
        });
    } catch (err) {
      console.error(err);
    }
  };

  const register = async () => {
    try {
      await axios.post('http://localhost:6001/register', inputs)
        .then((res) => {
          localStorage.setItem('userId', res.data._id);
          localStorage.setItem('userType', res.data.usertype);
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('email', res.data.email);
          localStorage.setItem('balance', res.data.balance);

          navigate(res.data.usertype === 'customer' ? '/home' : '/admin');
        })
        .catch((err) => {
          console.error(err);
          alert("Registration failed");
        });
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider value={{
      login,
      register,
      logout,
      username,
      setUsername,
      email,
      setEmail,
      password,
      setPassword,
      usertype,
      setUsertype
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

// PropTypes validation for children
GeneralContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Define children as required and of type node
};

export default GeneralContextProvider;
