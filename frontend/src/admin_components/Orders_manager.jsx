import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Select, Spin, Tag, Input, Space, Slider, Drawer } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOrder, setSortOrder] = useState('ascend');
  const [priceLimits, setPriceLimits] = useState([0, 10000]);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/admin/all/`);
      const ordersData = response.data;
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      const prices = ordersData.map(order => order.total_price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceLimits([minPrice, maxPrice]);
      setPriceRange([minPrice, maxPrice]);
    } catch (error) {
      message.error('Не удалось получить заказы');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/orders/admin/delete/${orderId}`);
      message.success('Заказ удалён');
      fetchOrders();
    } catch (error) {
      message.error('Не удалось удалить заказ');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/orders/admin/update/status/${orderId}`, null, { params: { new_status: newStatus } });
      message.success('Статус заказа обновлён');
      fetchOrders();
    } catch (error) {
      message.error('Не удалось обновить статус');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];
    if (statusFilter !== 'all') {
      data = data.filter(order => order.status === statusFilter);
    }
    if (userIdFilter) {
      data = data.filter(order => order.user_id.toString().includes(userIdFilter));
    }
    data = data.filter(order => order.total_price >= priceRange[0] && order.total_price <= priceRange[1]);
    data.sort((a, b) => sortOrder === 'ascend' ? a.total_price - b.total_price : b.total_price - a.total_price);
    setFilteredOrders(data);
  }, [statusFilter, userIdFilter, priceRange, sortOrder, orders]);

  const resetFilters = () => {
    setStatusFilter('all');
    setUserIdFilter('');
    setPriceRange(priceLimits);
    setSortOrder('ascend');
  };

  const renderItems = (items) => {
    return items.map(item => (
      <div key={item.id}>
        <Tag>{item.product_type.art}</Tag> x{item.quantity}
      </div>
    ));
  };

  const columns = [
    {
      title: 'ID заказа',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'ID пользователя',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => updateOrderStatus(record.id, value)}
          loading={updatingOrderId === record.id}
        >
          <Option value="new">New</Option>
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: 'Итоговая сумма',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => `${price}₽`
    },
    {
      title: 'Товары',
      dataIndex: 'items',
      key: 'items',
      render: (items) => renderItems(items)
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Вы уверены, что хотите удалить заказ?"
          onConfirm={() => deleteOrder(record.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Button danger>Удалить</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Управление заказами (Админ)</h1>
      <Button type="primary" onClick={() => setDrawerVisible(true)} style={{ marginBottom: 16 }}>
        Фильтры
      </Button>
      <Drawer
        title="Фильтры"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: '100%' }}
          >
            <Option value="all">Все статусы</Option>
            <Option value="new">New</Option>
            <Option value="pending">Pending</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
          <Input
            placeholder="Фильтр по ID пользователя"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          />
          <div>
            <span>Диапазон цены:</span>
            <Slider
              range
              min={priceLimits[0]}
              max={priceLimits[1]}
              step={10}
              value={priceRange}
              onChange={(value) => setPriceRange(value)}
            />
          </div>
          <Select
            value={sortOrder}
            onChange={(value) => setSortOrder(value)}
            style={{ width: '100%' }}
          >
            <Option value="ascend">Цена: сначала дешевле</Option>
            <Option value="descend">Цена: сначала дороже</Option>
          </Select>
          <Button onClick={resetFilters} type="default" block>
            Сбросить фильтры
          </Button>
        </Space>
      </Drawer>
      {loading ? <Spin /> : <Table dataSource={filteredOrders} columns={columns} rowKey="id" />}
    </div>
  );
};

export default AdminOrders;
