import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Card,
    Descriptions,
    Button,
    Space,
    Modal,
    Form,
    Input,
    message,
} from 'antd';
import {
    EditOutlined,
    LockOutlined,
} from '@ant-design/icons';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { UPDATE_USER_PROFILE_SUCCESS } from '../actions/types';


const Profile = () => {
    const profile = useSelector((state) => state.profile);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();
    const msg = (type, content) => {
        messageApi.open({ type, content });
    };

    const apiEndpoints = {
        first_name: '/auth/update/name',
        last_name: '/auth/update/lastname/',
        email: '/auth/update/email/',
        phone_number: '/auth/update/phone/',
    };

    const handleEdit = (field) => {
        setCurrentField(field);
        form.setFieldsValue({ value: profile[field] });
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const { value } = await form.validateFields();

            if (!currentField || !apiEndpoints[currentField]) {
                msg('error', 'Обновление этого поля не поддерживается.');
                return;
            }

            const payload = { [currentField]: value };
            const response = await axios.put(`${process.env.REACT_APP_API_URL}`+apiEndpoints[currentField], payload);

            if (response.data?.status === 'success') {
                const updatedProfile = {
                    ...profile,
                    [currentField]: value,
                };

                dispatch({
                    type: UPDATE_USER_PROFILE_SUCCESS,
                    payload: updatedProfile,
                });

                msg('success', 'Изменения сохранены!');
                setIsModalOpen(false);
                form.resetFields();
            } else {
                msg('error', 'Сервер не подтвердил обновление.');
                console.warn('Ответ API:', response.data);
            }
        } catch (err) {
            if (err.response.data.detail){
                msg('error', `Ошибка при сохранении! ${err.response.data.detail}`);
            }else{
                msg('error', `Ошибка при сохранении!`);
            }
            console.error(err);
        }
    };

    const handlePasswordChange = async () => {
        try {
            const { old_password, new_password } = await passwordForm.validateFields([
                'old_password',
                'new_password',
                'confirm_password',
            ]);

            const response = await axios.put(`${process.env.REACT_APP_API_URL}/auth/update/password/`, {
                old_password,
                new_password,
            });

            if (response.data?.status === 'success') {
                msg('success', 'Пароль успешно изменён');
                setIsPasswordModalOpen(false);
                passwordForm.resetFields();
            } else {
                msg('error', 'Не удалось изменить пароль');
                console.warn('Ответ API:', response.data);
            }
        } catch (err) {
            msg('error', `Ошибка при изменении пароля! ${err.response.data.detail}`);
            console.error(err);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const renderItem = (label, field) => (
        <Descriptions.Item label={label}>
            <Space>
                {profile[field] || 'Не указано'}
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(field)}
                />
            </Space>
        </Descriptions.Item>
    );

    if (!isAuthenticated) return navigate('/login')

    return (
        <>
            {contextHolder}
            <Card
                title="Профиль пользователя"
                style={{ maxWidth: 600, margin: '0 auto', marginTop: 40 }}
            >
                <Descriptions column={1} bordered>
                    {renderItem('Email', 'email')}
                    {renderItem('Имя', 'first_name')}
                    {renderItem('Фамилия', 'last_name')}
                    {renderItem('Телефон', 'phone_number')}
                </Descriptions>
            </Card>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button
                    icon={<LockOutlined />}
                    type="primary"
                    onClick={() => setIsPasswordModalOpen(true)}
                >
                    Изменить пароль
                </Button>
            </div>

            {/* Модалка редактирования полей */}
            <Modal
                title={`Редактирование поля: ${currentField}`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="value"
                        label="Новое значение"
                        rules={[{ required: true, message: 'Пожалуйста, введите значение' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Модалка смены пароля */}
            <Modal
                title="Изменение пароля"
                open={isPasswordModalOpen}
                onOk={handlePasswordChange}
                onCancel={() => {
                    setIsPasswordModalOpen(false);
                    passwordForm.resetFields();
                }}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form form={passwordForm} layout="vertical">
                    <Form.Item
                        label="Старый пароль"
                        name="old_password"
                        rules={[{ required: true, message: 'Введите старый пароль' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Новый пароль"
                        name="new_password"
                        rules={[
                            { required: true, message: 'Введите новый пароль' },
                            { min: 5, message: 'Пароль должен быть минимум 5 символов' },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Подтвердите новый пароль"
                        name="confirm_password"
                        dependencies={['new_password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Подтвердите новый пароль' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Profile;
