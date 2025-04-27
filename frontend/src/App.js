import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

import PrivateRoute from './components/PrivateRoute.jsx';
import AuthenticatedRoute from './components/AuthenticatedRoute.jsx';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Защищённый роут для профиля */}
            <Route path="/profile" element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            } />

            <Route path="/catalog" element={<CategoryCatalog />} />
            <Route path="/products" element={<ProductList />} />

            {/* Только админ может создавать и редактировать продукты */}
            <Route path="/products/create" element={
              <PrivateRoute>
                <ProductCreate />
              </PrivateRoute>
            } />

            <Route path="/products/update/:productId" element={
              <PrivateRoute>
                <ProductEdit />
              </PrivateRoute>
            } />

            <Route path="/categories/create" element={
              <PrivateRoute>
                <CategoryManager />
              </PrivateRoute>
            } />

            {/* Защищённый роут для корзины и заказов */}
            <Route path="/cart" element={
              <AuthenticatedRoute>
                <Cart />
              </AuthenticatedRoute>
            } />

            <Route path="/orders" element={
              <AuthenticatedRoute>
                <OrdersManager />
              </AuthenticatedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
