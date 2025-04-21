import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/auth";

import { Dropdown, Space } from "antd";
import { DownOutlined } from '@ant-design/icons'


const Header = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const dispatch = useDispatch();

  const items = [
    {
      key: '1',
      label: 'Товары',
      children: [
        {
          key: '2-1',
          label: (
            <a href="/products/create/">
              Добавить товар.
            </a>
          )
        },
        {
          key: '2-2',
          label: '4th menu item',
        },
      ],
    }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">Магазин Мебели</div>
      <ul className="navbar-links">
        <li><a href="/">Главная</a></li>
        <li><a href="/catalog">Каталог</a></li>
        {isAdmin ? (<li><Dropdown menu={{ items }}>
          <a onClick={e => e.preventDefault()}>
            <Space>
              Админ меню
              <DownOutlined />
            </Space>
          </a>
        </Dropdown></li>): ("")}
        {isAuthenticated ? (
          <>
            <li><a href="/profile">Профиль</a> / <a href="#" onClick={(e)=>{e.preventDefault(); dispatch(logout());}}>Выход</a></li>
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