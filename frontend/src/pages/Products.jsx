import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Tag, Typography, List, Divider, Spin, Button, Space, Popconfirm, message } from 'antd';
import axios from 'axios';

const ProductList = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const params = new URLSearchParams(search);
  const categoryId = params.get('category_id');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { Title, Text } = Typography;

  const fetchProducts = async (category_id) => {
    try {
      const config = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/all/?category_id=${category_id}`, config);
      if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        console.warn('Полученные данные не массив:', res.data);
        setData([]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(categoryId);
  }, [categoryId]);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/products/delete/${productId}`);
      message.success("Товар удалён");
      fetchProducts(categoryId);
    } catch (error) {
      message.error("Ошибка при удалении товара");
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" tip="Загрузка товаров..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Товары</Title>
      <Row gutter={[16, 16]}>
        {data.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              title={product.title}
              bordered
              hoverable
              style={{ height: '100%' }}
            >
              <Text type="secondary">{product.category}</Text>
              <Divider />
              {product.product_types.map((type, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <Text strong>Арт. {type.art}</Text>
                  <br />
                  <Text>Цена: {type.price.toLocaleString()} ₽</Text>
                  <br />
                  <Text>Остаток: {type.amount} шт</Text>
                  <List
                    size="small"
                    dataSource={type.characteristics}
                    renderItem={(char) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Tag>{char.name}: {char.value}</Tag>
                      </List.Item>
                    )}
                  />
                </div>
              ))}
              {isAdmin && (
                <Space style={{ marginTop: 16 }}>
                  <Button type="primary" onClick={() => navigate(`/products/update/${product.id}`)}>Изменить</Button>
                  <Popconfirm
                    title="Удалить этот товар?"
                    onConfirm={() => handleDelete(product.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button danger>Удалить</Button>
                  </Popconfirm>
                </Space>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
