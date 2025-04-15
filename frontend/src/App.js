import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from "./components/Layout.jsx";
import Home from './pages/Home.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route index  element={<Home />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
