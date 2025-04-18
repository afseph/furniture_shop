import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Row, Col, Tag, Typography, List, Divider, Spin } from 'antd';
import axios from 'axios';

const ProductList = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryId = params.get('category_id');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 состояние загрузки

  const { Title, Text } = Typography;

  useEffect(() => {
    const getProducts = async (category_id) => {
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
        setLoading(false); // ✅ загрузка завершена
      }
    };

    getProducts(categoryId);
  }, [categoryId]);

  // 🔄 Спиннер при загрузке
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
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
