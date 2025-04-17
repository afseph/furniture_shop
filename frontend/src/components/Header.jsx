import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/auth";


const Header = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  return (
    <nav className="navbar">
      <div className="navbar-logo">Магазин Мебели</div>
      <ul className="navbar-links">
        <li><a href="/">Главная</a></li>
        {isAuthenticated ? (
          <>
            <li><a href="/profile">Профиль</a> / <a href="#" onClick={()=>{dispatch(logout())}}>Выход</a></li>
          </>
        ) : (
          <li><a href="/login">Вход</a> / <a href="/register">Регистрация</a></li>
        )}
        <li><a href="/contact">Контакты</a></li>
      </ul>
    </nav>
  );
};

export default Header;