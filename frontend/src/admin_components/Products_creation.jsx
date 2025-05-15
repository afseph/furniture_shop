import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Space,
  Divider,
  Card,
  message
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Option } = Select;

const ProductCreate = () => {
  const [form] = Form.useForm();
  const categories = useSelector((state) => state.categories.categories);
  const [existingArts, setExistingArts] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const msg = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };

  // Загрузка всех существующих артикулов
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/types/all/`);
        if (Array.isArray(res.data)) {
          const arts = res.data.map((type) => type.art?.toString().toLowerCase());
          setExistingArts(arts);
        }
      } catch (error) {
        console.error('Ошибка при получении артикулов:', error);
        msg('warning', 'Не удалось загрузить список артикулов');
      }
    };

    fetchProductTypes();
  }, []);

  const onFinish = async (values) => {
    const newArts = values.product_types.map(pt => pt.art?.toString().toLowerCase());
    const duplicateExisting = newArts.find(art => existingArts.includes(art));
    const duplicateLocal = newArts.find((art, i, arr) => arr.indexOf(art) !== i);

    if (duplicateExisting) {
      msg('error', `Артикул "${duplicateExisting}" уже существует в системе`);
      return;
    }

    if (duplicateLocal) {
      msg('error', `Артикул "${duplicateLocal}" используется несколько раз`);
      return;
    }

    try {
      msg('loading', 'Создание товара...');

      const productRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/products/add/`,
        {
          title: values.title,
          description: values.description,
          category_id: values.category_id,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const product_id = productRes.data.product_id;

      for (const type of values.product_types) {
        const typeRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/products/types/add/`,
          {
            product_id,
            art: type.art,
            amount: type.amount,
            price: type.price,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const product_type_id = typeRes.data.type_id;

        for (const char of type.characteristics || []) {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/products/characteristic/add/`,
            {
              producttype_art: product_type_id,
              name: char.name,
              value: char.value,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }

      msg('success', 'Товар успешно создан!');
      form.resetFields();
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      msg('error', 'Ошибка при создании товара');
    }
  };

  return (
    <Card title="Создание товара" style={{ maxWidth: 900, margin: '0 auto' }}>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ product_types: [] }}
      >
        <Form.Item
          name="title"
          label="Название товара"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
          rules={[{ required: true, message: 'Введите описание' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="category_id"
          label="Категория"
          rules={[{ required: true, message: 'Выберите категорию' }]}
        >
          <Select placeholder="Выберите категорию">
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider orientation="left">Варианты товара</Divider>

        <Form.List name="product_types">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Card
                  key={key}
                  type="inner"
                  title={`Вариант #${index + 1}`}
                  style={{ marginBottom: 24 }}
                  extra={
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: 'red' }}
                    />
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'art']}
                    label="Артикул"
                    rules={[{ required: true, message: 'Введите артикул' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'amount']}
                    label="Остаток"
                    rules={[{ required: true, message: 'Введите количество' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'price']}
                    label="Цена"
                    rules={[{ required: true, message: 'Введите цену' }]}
                  >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.List name={[name, 'characteristics']}>
                    {(charFields, { add: addChar, remove: removeChar }) => (
                      <>
                        <Divider orientation="left">Характеристики</Divider>
                        {charFields.map(({ key: charKey, name: charName, ...charRest }) => (
                          <Space
                            key={charKey}
                            style={{ display: 'flex', marginBottom: 8 }}
                            align="baseline"
                          >
                            <Form.Item
                              {...charRest}
                              name={[charName, 'name']}
                              rules={[{ required: true, message: 'Название характеристики' }]}
                            >
                              <Input placeholder="Название (например, Цвет)" />
                            </Form.Item>
                            <Form.Item
                              {...charRest}
                              name={[charName, 'value']}
                              rules={[{ required: true, message: 'Значение характеристики' }]}
                            >
                              <Input placeholder="Значение (например, Черный)" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => removeChar(charName)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => addChar()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Добавить характеристику
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Добавить вариант товара
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить товар
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductCreate;
