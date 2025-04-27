import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message } from "antd";
import axios from "axios";

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/get/`);
      setOrders(response.data);
    } catch (error) {
      message.error("Ошибка при загрузке заказов");
    } finally {
      setLoading(false);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  const showDeleteConfirm = (id) => {
    setSelectedOrderId(id);
    setIsModalVisible(true);
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/orders/cancel/${selectedOrderId}/`);
      message.success("Заказ удален успешно");
      fetchOrders();
    } catch (error) {
      message.error("Ошибка при удалении заказа");
    } finally {
      setIsModalVisible(false);
      setSelectedOrderId(null);
    }
  };
  

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Пользователь",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Сумма заказа",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => `${price.toFixed(2)} ₽`,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => showDeleteConfirm(record.id)}>
        Удалить
        </Button>
      ),
    },
  ];

  return (
    <div>
        <Modal
            title="Подтвердите удаление"
            open={isModalVisible}
            onOk={handleDelete}
            onCancel={() => setIsModalVisible(false)}
            okText="Удалить"
            cancelText="Отмена"
            >
            <p>Вы уверены, что хотите удалить заказ?</p>
        </Modal>
      <h2 className="text-xl mb-4">Управление заказами</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <h4>Товары:</h4>
              {record.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 8 }}>
                  <b>Артикул:</b> {item.product_type_art} <br />
                  <b>Количество:</b> {item.quantity} <br />
                  <b>Цена при заказе:</b> {item.price_at_order} ₽<br />
                  <b>Характеристики:</b>
                  <ul>
                    {item.product_type.characteristics.map((char) => (
                      <li key={char.id}>
                        {char.name}: {char.value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default OrdersManager;
