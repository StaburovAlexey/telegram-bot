
# Сервис для продажи услуг через телеграм бота

![Static Badge](https://img.shields.io/badge/Telegram%20API-Bot%20API%206.9-blue) ![Static Badge](https://img.shields.io/badge/Node.js-18.18.0-rgb(86%2C165%2C69)) ![Static Badge](https://img.shields.io/badge/Javascript-ES6-rgb(255%2C204%2C0)) ![Static Badge](https://img.shields.io/badge/mongodb-6.1.0-rgb(89%2C174%2C86)) ![Static Badge](https://img.shields.io/badge/node%20telegram%20bot%20api-0.61.0-blue?link=https%3A%2F%2Fgithub.com%2Fyagop%2Fnode-telegram-bot-api)
###Логика:


### Что реализовано
1. Подключена оплата через сервис [Cryptomus](https://cryptomus.com/)
2. Настроена проверка статуса оплаты с помощью Cron
3. Проверка когда истекает подписка с помощью Cron
4. Подключена база данных Mongodb
5. Проверка наличия услуги у пользователя
6. Проверка наличия пользователя в базе при нажатие на /start
7. Генерация случайного 20значного ordered для совершения оплаты через Cryptomus
8. Проверка на совпадение orderId в базе оплат "payments".
