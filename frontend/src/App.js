import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';

import Layout from "./components/Layout.jsx";
import Home from './pages/Home.jsx';

function App() {
  return (
    <>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route index  element={<Home />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
    </>
  );
}

export default App;
