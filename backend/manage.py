import asyncio
import sys

from app.commands.create_superuser import create_superuser

commands = {
    'createsuperuser': create_superuser
}

def main():
    if len(sys.argv) < 2:
        print('Укажите команду. Например: python manage.py createsuperuser')
        return
    
    command = sys.argv[1]
    if command not in commands:
        print(f'Неизвестная команда: {command}')
        print(f'Доступные команды: {', '.join(commands.keys())}')
        return
    
    asyncio.run(commands[command]())

if __name__ == '__main__':
    main()