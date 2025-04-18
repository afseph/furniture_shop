import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const CategoryCatalog = () => {
  const categories = useSelector((state) => state.categories.categories);
  const navigate = useNavigate();

  if (!categories) return <Spin />;

  const handleCategoryClick = (id) => {
    navigate(`/products?category_id=${id}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Категории</h2>
      {categories.length === 0 ? (
        <Empty description="Категории не найдены" />
      ) : (
        <Row gutter={[16, 16]}>
          {categories.map((cat) => (
            <Col xs={24} sm={12} md={8} lg={6} key={cat.id}>
              <Card
                hoverable
                onClick={() => handleCategoryClick(cat.id)}
                style={{ width: '100%' }}
              >
                <Meta title={cat.name} description={`ID: ${cat.id}`} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CategoryCatalog;
