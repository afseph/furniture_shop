import './App.css';

import { BrowserRouter, Routes, Route, Router, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import store from './store.js';

import Layout from "./components/Layout.jsx";
import Home from './pages/Home.jsx';
import LoginForm from './pages/Login.jsx';
import RegisterForm from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import CategoryCatalog from './pages/Catalog.jsx';
import ProductList from './pages/Products.jsx';
import Cart from './components/Cart.jsx';
import OrdersManager from './pages/Orders.jsx';

import ProductCreate from './admin_components/Products_creation.jsx';
import ProductEdit from './admin_components/Products_update.jsx';
import CategoryManager from './admin_components/Category_manager.jsx';

const PrivateRoute = ({ children }) => {
  const isAdmin = useSelector(state => state.auth.isAdmin);
  if (isAdmin) {
    return children
  } else {
    return <Navigate to="/"/>;
  }
}

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
            <Route path='/catalog' element={<CategoryCatalog />}/>
            <Route path='/products' element={<ProductList />}/>
            <Route path='/products/create' element={<PrivateRoute><ProductCreate /></PrivateRoute>}/>
            <Route path='/products/update/:productId' element={<PrivateRoute><ProductEdit /></PrivateRoute>}/>
            <Route path='/categories/create' element={<PrivateRoute><CategoryManager/></PrivateRoute>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/orders' element={<OrdersManager />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
    </>
  );
}

export default App;
