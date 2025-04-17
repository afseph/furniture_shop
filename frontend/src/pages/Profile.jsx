import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Descriptions, Button, Space, Modal, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const UPDATE_USER_PROFILE_SUCCESS = 'UPDATE_USER_PROFILE_SUCCESS';

const Profile = () => {
    const profile = useSelector(state => state.profile);
    const dispatch = useDispatch();

    const [messageApi, contextHolder] = message.useMessage();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [form] = Form.useForm();

    const msg = (type, content) => {
        messageApi.open({
            type: type,
            content: content,
        });
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
                message.error('Обновление этого поля не поддерживается.');
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
                msg('error', 'Сервер не подтвердил обновление.')
                console.warn('Ошибка в ответе API:', response.data);
            }
        } catch (err) {
            msg('error', `Ошибка при сохранении! ${err.response.data.detail}`)
            console.error(err.response.data.detail);
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

    return (
        <>
        {contextHolder}
            <Card title="Профиль пользователя" style={{ maxWidth: 600, margin: '0 auto', marginTop: 40 }}>
                <Descriptions column={1} bordered>
                    {renderItem("Email", "email")}
                    {renderItem("Имя", "first_name")}
                    {renderItem("Фамилия", "last_name")}
                    {renderItem("Телефон", "phone_number")}
                </Descriptions>
            </Card>

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
        </>
    );
};

export default Profile;
