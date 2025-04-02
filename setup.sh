#!/bin/bash

# Обновление системы и установка необходимых пакетов
echo "Обновление системы и установка зависимостей..."
sudo apt update -y
sudo apt upgrade -y
sudo apt install -y git nodejs npm nginx certbot python3-certbot-nginx

# Установка pm2 для фонового запуска сервера
echo "Установка pm2..."
sudo npm install -g pm2

# Клонирование репозитория
echo "Клонирование репозитория с GitHub..."
cd /root
git clone https://github.com/YOUR_USERNAME/sierra-team-site.git
cd sierra-team-site

# Установка зависимостей проекта
echo "Установка зависимостей проекта..."
npm install

# Запуск сервера в фоновом режиме
echo "Запуск сервера в фоновом режиме..."
pm2 start server.js
pm2 startup
pm2 save

# Открытие портов 80 и 443
echo "Открытие портов 80 и 443..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Настройка Nginx
echo "Настройка Nginx..."
sudo bash -c 'cat << EOF > /etc/nginx/sites-available/sierra
server {
    listen 80;
    server_name 185.112.102.133 mc.projectsierra.linkpc.net projectsierra.linkpc.net;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF'

# Активация конфигурации Nginx
sudo ln -s /etc/nginx/sites-available/sierra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Настройка SSL с помощью Certbot
echo "Настройка SSL с помощью Certbot..."
sudo certbot --nginx --email hyenabekzod@gmail.com --agree-tos --no-eff-email -d mc.projectsierra.linkpc.net -d projectsierra.linkpc.net

# Проверка доступа
echo "Проверка доступа к сайту..."
curl https://185.112.102.133

echo "Установка завершена! Сайт доступен по https://185.112.102.133, https://mc.projectsierra.linkpc.net и https://projectsierra.linkpc.net"
