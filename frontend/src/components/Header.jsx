import React from "react";
// import "./Navbar.css"; // Можно подключить стили отдельно

const Header = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Магазин Мебели</div>
      <ul className="navbar-links">
        <li><a href="/">Главная</a></li>
        <li><a href="/about">О нас</a></li>
        <li><a href="/contact">Контакты</a></li>
      </ul>
    </nav>
  );
};

export default Header;