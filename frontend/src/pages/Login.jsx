import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { login } from '../actions/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const msg = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };

  const onFinish = async ({ email, password }) => {
    setLoading(true);

    try {
      const action = await dispatch(login(email, password));

      if (action.type === 'LOGIN_SUCCESS') {
        msg('success', 'Успешный вход!');
        navigate('/profile');
      } else {
        msg('error', 'Ошибка входа. Проверьте email и пароль.');
      }
    } catch (error) {
      msg('error', 'Ошибка входа. Проверьте email и пароль.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="login-form"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Пожалуйста, введите email!' },
            { type: 'email', message: 'Некорректный email!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
