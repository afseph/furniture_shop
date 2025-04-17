import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { register } from '../actions/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

const RegisterForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const { Option } = Select;

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

  const onFinish = async ({ email, password, first_name, last_name, prefix, phone_number }) => {
    setLoading(true);

    const phone = prefix + phone_number

    try {
      const action = await dispatch(register(email, password, first_name, last_name, phone));

      if (action.type == 'REGISTER_SUCCESS') {
        msg('success', 'Успешная регестрация!');
        navigate('/login');
      } else {
        msg('error', action.detail);
      }
    } catch (error) {
      msg('error', 'Ошибка регистрации.');
    } finally {
      setLoading(false);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="+7">+7</Option>
      </Select>
    </Form.Item>
  );

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
          label="Имя"
          name="first_name"
          rules={[
            { required: true, message: 'Пожалуйста, введите имя!' },
            { min: 3, message:"Имя должено содержать минимум 3 символа!"}
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Фамилия"
          name="last_name"
          rules={[
            { required: true, message: 'Пожалуйста, введите фамилию!' },
            { min: 3, message:"Фамилия должена содержать минимум 3 символа!"}
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Номер телефона"
          name="phone_number"
          rules={[
            { required: true, message: 'Пожалуйста, введите номер телефона!' },
          ]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }, 
            { min: 5, message:"Пароль должен содержать минимум 5 символов!"}
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
        name="confirm"
        label="Подтвердите пароль"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Пожалуйста, подтвердите пароль!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пароли не совпадают!'));
            },
          }),
        ]}
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

export default RegisterForm;
