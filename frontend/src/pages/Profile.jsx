import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Descriptions, Button, Space, Modal, Form, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const Profile = () => {
    const profile = useSelector(state => state.profile);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [form] = Form.useForm();

    const handleEdit = (field) => {
        setCurrentField(field);
        form.setFieldsValue({ value: profile[field] });
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            console.log(`Новое значение для ${currentField}:`, values.value);
            setIsModalOpen(false);
            form.resetFields();
            // Здесь можно сделать dispatch в Redux или отправить запрос на сервер
        });
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
