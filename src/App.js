import { AuthProvider } from './context/authContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './pages/Register';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <Router>
          <Switch>
            <Route path='/register'>
              <Register />
            </Route>
            <PrivateRoute path='/dashboard' component={Dashboard} />
            <Route path='/' exact>
              <Login />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
      <p style={{ position: 'absolute', bottom: 0, left: 0 }}>
        Created by Miguel Buising{' '}
      </p>
    </div>
  );
}

export default App;
