import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const LoginProtector = ({ children }) => {
    if (localStorage.getItem('userType')) {
        if (localStorage.getItem('userType') === 'customer') {
            return <Navigate to='/home' replace />;
        } else if (localStorage.getItem('userType') === 'admin') {
            return <Navigate to='/admin' replace />;
        }
    }
  
    return children;
}

LoginProtector.propTypes = {
    children: PropTypes.node.isRequired
};

export default LoginProtector;
