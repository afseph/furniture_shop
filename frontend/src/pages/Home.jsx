import React from "react";
import { Layout, Typography, Card, Row, Col, Button, Divider } from "antd";

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function HomePage() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "50px", background: "#f0f2f5" }}>
          <div style={{ background: "#f0f2f5", padding: 24, minHeight: 380, marginBottom: "30px" }}>
            <div style={{ textAlign: "center" }}>
                <Title>MebelStore</Title>
                <Paragraph>Это главная страница нашего магазина мебели. Добро пожаловать!</Paragraph>
            </div>
            
            <Divider><Title level={2}>Наши приемущества</Title></Divider>
            <Row gutter={[16, 16]} style={{ marginTop: "40px" }}>
            <Col xs={24} sm={12} md={8}>
              <Card title="Высокое качество" bordered={false}>
                Мы используем только проверенные материалы и современное производство.
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Доступные цены" bordered={false}>
                Оптимальные предложения для любого бюджета без потери качества.
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Индивидуальный подход" bordered={false}>
                Подбираем решения под ваши уникальные потребности и желания.
              </Card>
            </Col>
          </Row>
  
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Button type="primary" size="large" href="/catalog">
                В КАТАЛОГ
              </Button>
            </div>
          </div>
  
            <Divider><Title level={2}>О нас</Title></Divider>
          <div style={{ background: "#f0f2f5", padding: 24, marginBottom: "30px" }}>
            <Paragraph>
              Мы - команда профессионалов в области мебели. Наша миссия — создавать комфортные пространства для жизни и работы.
            </Paragraph>
          </div>
  
            <Divider><Title level={2}>Контакты</Title></Divider>
          <div style={{ background: "#f0f2f5", padding: 24 }}>
            <Paragraph>
              Адрес: г. Москва, ул. Примерная, д. 1
              <br />
              Телефон: +7 (495) 123-45-67
              <br />
              Email: info@mebel.ru
            </Paragraph>
          </div>
        </Content>
      </Layout>
    );
  }
