import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import { Toaster } from 'react-hot-toast';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkExpiration } from './redux/user/userSlice';
import PrivateRoute from './components/PrivateRoute';
import UserPrivateRoute from './components/UserPrivateRoute';
import EditCustomer from './dashboard/EditCustomer';

export default function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    // Check expiration immediately on load
    dispatch(checkExpiration());

    const interval = setInterval(() => {
      dispatch(checkExpiration());
    }, 1800000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <BrowserRouter>
    
      <Routes>
        <Route element={<UserPrivateRoute />}>
          <Route path='/sign-up' element={ <SignUp /> }></Route>
          <Route path='/' element={ <SignIn /> }></Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={ <Dashboard />}></Route>
          <Route path='/dashboard/edit/:cusId' element={ <EditCustomer />}></Route>
        </Route>
      </Routes>

      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 4000,
        }}
      />

    </BrowserRouter>
  )
}
