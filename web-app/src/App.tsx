import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navigation from './routes/navigation/navigation.component';
import Generate from './routes/generate/generate.component';
import { useEffect } from 'react';
import { onAuthStateChangedListner } from './utils/firebase/firebase.utils';
import { useAppDispatch } from './store/store';
import { asyncUserActions } from './store/user/user.slice';
import { deviceTypeActions } from './store/deviceType/deviceType.slice';
import { Model } from './routes/model/model.component';
import { AuthRedirectHandler } from './routes/auth/auth.component';
import { Admin } from './routes/admin/admin.component';
import { ModelPicker } from './routes/ModelPicker/ModelPicker.component';
import TestLogin from './routes/testLogin/testLogin.component';

function App() {

  const dispatch = useAppDispatch()

  // check for Firebase login
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListner(async (user) => {
      const currentPath = window.location.pathname;
      // Assuming the URL pattern is "/model/{modelId}"
      const match = currentPath.match(/model\/(.+)/);
      let instaUserName = "";
      if (match) {
        instaUserName = match[1];
      }
  
      if (!user) {
        dispatch(asyncUserActions.fetchUserData({isLoggedIn: false, instaUserName}))
        return
      }
      dispatch(asyncUserActions.fetchUserData({isLoggedIn: true, instaUserName}))
    })
    return unsubscribe
  }, [])

  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      dispatch(deviceTypeActions.updateDeviceWidth({width: window.innerWidth}))
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Navigation />} >
        <Route index element={<Generate />} />
        <Route path='mymodel' element={<Model />} />
        <Route path='auth' element={<AuthRedirectHandler />} />
        <Route path='admin' element={<Admin />} />
        <Route path='models' element={<ModelPicker />} />
        <Route path='model/:modelId' element={<Generate />} />
      </Route>
      <Route path='/testLogin' element={<TestLogin />}/>
    </Routes>
  );
}

export default App;
