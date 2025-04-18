import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Checkbox,
  Divider,
  Card,
  message,
  Spin,
  Select
} from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const ProductEdit = () => {
  const { productId } = useParams();
  const [form] = Form.useForm();
  const categories = useSelector((state) => state.categories.categories);
  const [loading, setLoading] = useState(true);
  const [existingArts, setExistingArts] = useState([]);
  const [allCharacteristics, setAllCharacteristics] = useState([]);
  const [initialProductTypes, setInitialProductTypes] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const msg = (type, content) => {
    messageApi.open({ type, content });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const [productRes, allTypesRes, charRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/products/all/?product_id=${productId}`),
          axios.get(`${process.env.REACT_APP_API_URL}/products/types/all/`),
          axios.get(`${process.env.REACT_APP_API_URL}/products/characteristic/all/`)
        ]);

        const productList = productRes.data;
        const product = Array.isArray(productList) ? productList[0] : null;

        if (!product) {
          msg('error', 'Товар не найден');
          setLoading(false);
          return;
        }

        const allArts = allTypesRes.data
          .filter(t => t.product_id !== Number(productId))
          .map(t => t.art?.toString().toLowerCase());

        setExistingArts(allArts);
        setAllCharacteristics(charRes.data);

        const productTypesData = product.product_types.map((t) => {
          const charIds = t.characteristics.map((c) => c.id);
          return {
            id: t.id,
            originalArt: t.art, // сохранённый артикул
            art: t.art,
            amount: t.amount,
            price: t.price,
            selectedCharacteristics: charIds,
            initialCharacteristics: charIds,
            newCharacteristicName: '',
            newCharacteristicValue: ''
          };
        });

        setInitialProductTypes(productTypesData);

        form.setFieldsValue({
          title: product.title,
          description: product.description,
          category_id: product.category_id,
        });

        setTimeout(() => {
          form.setFieldsValue({ product_types: productTypesData });
        }, 0);

        setLoading(false);
      } catch (err) {
        console.error(err);
        msg('error', 'Ошибка при загрузке товара');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, form]);

  const onFinish = async (values) => {
    // Объединяем оригинальные поля
    values.product_types = values.product_types.map(pt => {
      const original = initialProductTypes.find(orig => orig.originalArt === pt.originalArt || orig.art === pt.art);
      return {
        ...pt,
        initialCharacteristics: original?.initialCharacteristics || [],
        originalArt: original?.originalArt || pt.art
      };
    });

    const newArts = values.product_types.map(pt => pt.art?.toString().toLowerCase());
    const duplicateExisting = newArts.find(art => existingArts.includes(art));
    const duplicateLocal = newArts.find((art, i, arr) => arr.indexOf(art) !== i);

    if (duplicateExisting) {
      msg('error', `Артикул "${duplicateExisting}" уже существует`);
      return;
    }

    if (duplicateLocal) {
      msg('error', `Артикул "${duplicateLocal}" используется несколько раз`);
      return;
    }

    try {
      msg('loading', 'Сохраняем изменения...');

      await axios.put(
        `${process.env.REACT_APP_API_URL}/products/update/${productId}`,
        {
          title: values.title,
          description: values.description,
          category_id: values.category_id,
        }
      );

      for (const type of values.product_types) {
        // обновляем product_type по старому артикулу
        await axios.put(
          `${process.env.REACT_APP_API_URL}/products/types/update/${type.originalArt}`,
          {
            art: type.art,
            amount: type.amount,
            price: type.price,
          }
        );

        // отвязываем только удалённые характеристики
        const selected = type.selectedCharacteristics || [];
        const initial = type.initialCharacteristics || [];
        const toUnbind = initial.filter(id => !selected.includes(id));

        for (const cid of toUnbind) {
          await axios.put(`${process.env.REACT_APP_API_URL}/products/characteristic/unbind/`, {
            producttype_art: type.art,
            characteristic_id: cid
          });
        }

        let newCharId = null;
        if (type.newCharacteristicName && type.newCharacteristicValue) {
          const res = await axios.post(`${process.env.REACT_APP_API_URL}/products/characteristic/add/`, {
            name: type.newCharacteristicName,
            value: type.newCharacteristicValue,
            producttype_art: type.art
          });
          newCharId = res.data.id;
        }

        const finalIds = [...selected, ...(newCharId ? [newCharId] : [])];

        for (const cid of finalIds) {
          await axios.put(`${process.env.REACT_APP_API_URL}/products/characteristic/bind/`, {
            producttype_art: type.art,
            characteristic_id: cid
          });
        }
      }

      msg('success', 'Изменения успешно сохранены!');
    } catch (err) {
      console.error(err);
      msg('error', 'Ошибка при сохранении');
    }
  };

  return (
    <Card title="Редактирование товара" style={{ maxWidth: 900, margin: '0 auto' }}>
      {contextHolder}
      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', padding: 48 }} />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Название товара" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="category_id" label="Категория" rules={[{ required: true }]}>
            <Select>
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Divider orientation="left">Варианты товара</Divider>
          <Form.List name="product_types">
            {(fields) => (
              <>
                {fields.map(({ key, name }) => (
                  <Card key={key} type="inner" title={`Вариант #${key + 1}`} style={{ marginBottom: 24 }}>
                    <Form.Item name={[name, 'art']} label="Артикул" rules={[{ required: true }]}>
                      <Input disabled/>
                    </Form.Item>
                    <Form.Item name={[name, 'amount']} label="Остаток" rules={[{ required: true }]}>
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={[name, 'price']} label="Цена" rules={[{ required: true }]}>
                      <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name={[name, 'selectedCharacteristics']} label="Характеристики">
                      <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        {allCharacteristics.map((c) => (
                          <Checkbox key={c.id} value={c.id} style={{ marginBottom: 4 }}>
                            {c.name}: {c.value}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>

                    <Divider orientation="left">Новая характеристика</Divider>
                    <Form.Item name={[name, 'newCharacteristicName']} label="Название">
                      <Input placeholder="например, Цвет" />
                    </Form.Item>
                    <Form.Item name={[name, 'newCharacteristicValue']} label="Значение">
                      <Input placeholder="например, Черный" />
                    </Form.Item>
                  </Card>
                ))}
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">Сохранить изменения</Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default ProductEdit;
