import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';

import Layout from "./components/Layout.jsx";
import Home from './pages/Home.jsx';
import LoginForm from './pages/Login.jsx';
import RegisterForm from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route index  element={<Home />}/>
            <Route path='/login' element={<LoginForm />}/>
            <Route path='/register' element={<RegisterForm />}/>
            <Route path='/profile' element={<Profile />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
    </>
  );
}

export default App;
