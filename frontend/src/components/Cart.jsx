import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  List,
  Card,
  Typography,
  Spin,
  Alert,
  Button,
  Popconfirm,
  message,
} from "antd";

const { Title, Text } = Typography;

const Cart = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isAuth) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuth]);

  const msg = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };

  const fetchCart = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/cart/get/`)
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки корзины:", err);
        message.error("Не удалось загрузить корзину");
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/cart/remove/?product_type_art=${id}`)
      .then(() => {
        message.success("Товар удален из корзины");
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => {
        message.error("Не удалось удалить товар");
      });
  };

  // TODO:
  const handleOrder = async () => {
    setSubmitting(true);
    try {
      const { data: allProducts } = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/types/all/`
      );
  
      // Проверяем наличие по art
      const insufficientItems = cartItems.filter((cartItem) => {
        const art = cartItem.product_type.art;
        const product = allProducts.find((p) => p.art === art);
        return !product || product.amount < cartItem.quantity;
      });


      if (insufficientItems.length > 0) {
        msg('error', "Некоторые товары отсутствуют на складе или недостаточное количество")
        return;
      }
  
      await axios.post(`${process.env.REACT_APP_API_URL}/orders/create/`);
      msg('success', "Заказ успешно оформлен");
      setCartItems([]);
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      msg('error', "Не удалось оформить заказ");
    } finally {
      setSubmitting(false);
    }
  };
  
  

  const totalSum = cartItems.reduce(
    (sum, item) => sum + item.product_type.price * item.quantity,
    0
  );

  if (!isAuth) {
    return (
      <Alert
        message="Доступ запрещён"
        description="Корзина доступна только для авторизованных пользователей."
        type="warning"
        showIcon
      />
    );
  }

  if (loading) {
    return <Spin tip="Загрузка корзины..." size="large" />;
  }

  if (cartItems.length === 0) {
    return <Alert message="Корзина пуста" type="info" showIcon />;
  }

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Title level={3}>Ваша корзина</Title>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={`Товар ID: ${item.product_type.product_id}`}
              extra={
                <Popconfirm
                  title="Удалить товар?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Да"
                  cancelText="Нет"
                >
                  <Button danger>Удалить</Button>
                </Popconfirm>
              }
            >
              <Text strong>Артикул:</Text> {item.product_type.art} <br />
              <Text strong>Количество:</Text> {item.quantity} <br />
              <Text strong>Цена:</Text> {item.product_type.price} ₽ <br />
              <Text strong>Сумма:</Text>{" "}
              {item.product_type.price * item.quantity} ₽ <br />
              <Text strong>Характеристики:</Text>
              <ul style={{ marginTop: 8 }}>
                {item.product_type.characteristics.map((char) => (
                  <li key={char.id}>
                    {char.name}: {char.value}
                  </li>
                ))}
              </ul>
            </Card>
          </List.Item>
        )}
      />

      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4}>Итого: {totalSum} ₽</Title>
        <Button
          type="primary"
          size="large"
          onClick={handleOrder}
          loading={submitting}
        >
          Оформить заказ
        </Button>
      </div>
    </div>
  );
};

export default Cart;
