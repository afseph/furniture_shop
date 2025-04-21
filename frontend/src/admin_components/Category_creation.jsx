import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Spin, List, Card, Space, Popconfirm, message } from "antd";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const CategoryManager = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Получение категорий
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/products/categories/`);
      setCategories(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке категорий", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Создание категории
  const onFinish = async (values) => {
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      await axios.post(`${API}/products/category/add/`, { name: values.name });
      form.resetFields();
      setSuccess(true);
      fetchCategories();
    } catch (err) {
      const message = err.response?.data?.detail || "Ошибка при создании категории";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Удаление категории
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/products/category/delete/${id}`);
      message.success("Категория удалена");
      fetchCategories();
    } catch (err) {
      message.error("Ошибка при удалении");
    }
  };

  // Обновление категории
  const handleUpdate = async (id) => {
    if (!editValue.trim()) return;
    try {
      await axios.put(`${API}/products/category/update`, { id, name: editValue });
      message.success("Категория обновлена");
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      message.error("Ошибка при обновлении");
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      {/* Форма создания */}
      <div style={{ flex: 1 }}>
        <h2>Добавить категорию</h2>

        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
        {success && <Alert type="success" message="Категория успешно создана!" showIcon style={{ marginBottom: 16 }} />}

        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Название категории"
              name="name"
              rules={[{ required: true, message: "Введите название категории" }]}
            >
              <Input placeholder="Например, Комоды" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Создать
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>

      {/* Список категорий */}
      <div style={{ flex: 1 }}>
        <h2>Существующие категории</h2>
        <List
          bordered
          dataSource={categories}
          renderItem={(item) => (
            <List.Item>
              <Card size="small" style={{ width: "100%" }}>
                {editingId === item.id ? (
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <Button type="primary" onClick={() => handleUpdate(item.id)}>
                      Сохранить
                    </Button>
                    <Button onClick={() => setEditingId(null)}>Отмена</Button>
                  </Space>
                ) : (
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <span>{item.name}</span>
                    <Space>
                      <Button type="link" onClick={() => {
                        setEditingId(item.id);
                        setEditValue(item.name);
                      }}>
                        Редактировать
                      </Button>
                      <Popconfirm
                        title="Удалить категорию?"
                        onConfirm={() => handleDelete(item.id)}
                        okText="Да"
                        cancelText="Нет"
                      >
                        <Button danger type="link">Удалить</Button>
                      </Popconfirm>
                    </Space>
                  </Space>
                )}
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default CategoryManager;
