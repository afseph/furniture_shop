import React from "react";
import { Layout, Menu, Dropdown, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/auth";

import { DownOutlined, HomeOutlined, ShopOutlined, SettingOutlined, UserOutlined, LogoutOutlined, ShoppingCartOutlined, OrderedListOutlined, LoginOutlined } from "@ant-design/icons";

const { Header } = Layout;

const CHeader = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const dispatch = useDispatch();

  const adminMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href="/products/create/">Добавить товар</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="/categories/create/">Менеджер категорий</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="/orders/manager/">Менеджер заказов</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>Магазин Мебели</div>
      <Menu theme="dark" mode="horizontal" style={{ marginLeft: "auto" }}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <a href="/">Главная</a>
        </Menu.Item>
        <Menu.Item key="catalog" icon={<ShopOutlined />}>
          <a href="/catalog">Каталог</a>
        </Menu.Item>
        {isAdmin && (
          <Menu.Item key="admin" icon={<SettingOutlined />}>
            <Dropdown overlay={adminMenu}>
              <a onClick={e => e.preventDefault()}>
                <Space>
                  Админ меню
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </Menu.Item>
        )}
        {isAuthenticated ? (
          <>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              <a href="/profile">Профиль</a>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              <a href="#" onClick={e => { e.preventDefault(); dispatch(logout()); }}>Выход</a>
            </Menu.Item>
            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
              <a href="/cart">Корзина</a>
            </Menu.Item>
            <Menu.Item key="orders" icon={<OrderedListOutlined />}>
              <a href="/orders">Заказы</a>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="login" icon={<LoginOutlined />}>
              <a href="/login">Вход</a>
            </Menu.Item>
            <Menu.Item key="register" icon={<LoginOutlined />}>
              <a href="/register">Регистрация</a>
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
};

export default CHeader;