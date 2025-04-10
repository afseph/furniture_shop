class RBProduct:
    def __init__(self, product_id: int | None = None):
        self.id = product_id

        
    def to_dict(self) -> dict:
        data = {'id': self.id}
        # Создаем копию словаря, чтобы избежать изменения словаря во время итерации
        filtered_data = {key: value for key, value in data.items() if value is not None}
        return filtered_data


class RBCharacteristic:
    def __init__(self, id:int|None = None, name: str|None = None, value: str|None = None):
        self.id = id
        self.name = name
        self.value = value

    def to_dict(self) -> dict:
        data = {'id': self.id,
                'name': self.name,
                'value':self.value}
        # Создаем копию словаря, чтобы избежать изменения словаря во время итерации
        filtered_data = {key: value for key, value in data.items() if value is not None}
        return filtered_data