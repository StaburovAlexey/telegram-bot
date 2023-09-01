const {
  inline_keyboard,
  bay_keyboard,
  extend_keyboard,
  extendKey,
  appBtn,
  backButton,
} = require("./inline_keyboard");
// импортируем модуль для работы с файловой системой
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "6347079453:AAHpnwn959SH4yi4Oo4VWk7zpaC_LFCxS1U";
const myId = 807148322;
const btnsPeriod = ["1", "3"];

console.log("bot activated");

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.on("polling_error", console.log);

//создание кнопок из массива ключей
function creatBtnsKey(userKey) {
  const btns = [];
  userKey.forEach((element) =>
    btns.push([
      {
        text: element.name,
        callback_data: element.name,
      },
    ])
  );
  return btns;
}

//создание кнопок продления
function creatBtnsPeriod(btnsArray) {
  const btns = [];
  btnsArray.forEach((element) =>
    btns.push([
      {
        text: `⏳ ${element} месяц(а)`,
        callback_data: `${element}-ext`,
      },
    ])
  );
  btns.push([backButton]);
  return btns;
}

//создание кнопок покупки
function creatBtnBay(btnsArray) {
  const btns = [];
  btnsArray.forEach((element) =>
    btns.push([
      {
        text: `🛒 ${element} месяц(а)`,
        callback_data: `${element}-bay`,
      },
    ])
  );
  btns.push([backButton]);
  return btns;
}

//перебор массива и получение его длинны
function findArrayLength(array) {
  let length = 0;
  for (let i = 0; i < array.length; i++) {
    length++;
  }
  if (length === undefined) {
    return "Нет данных"; // если в массиве ничего не нашлось возвращаем строку
  }
  return length;
}

//поиск пользователя из массива
function findObjectInArray(array, property, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][property] === value) {
      return array[i];
    }
  }
  return null;
}
//добовляем пользователю ключ
function addPropertyToObject(object, property, value) {
  if (object[property] === undefined) {
    object[property] = [value];
  } else {
    object[property].push(value);
  }
}

//сохраняем массив пользователей в файл
function saveArrayToFile(array, filename) {
  fs.writeFile(filename, JSON.stringify(array, null, 2), (err) => {
    if (err) {
      console.error(err);
    }
  });
}
//получаем массив пользователей из файла
function createArrayFromFile(filename) {
  return JSON.parse(fs.readFileSync(filename));
}

//добавление нового пользователя в базу
function storeUserData(id, name, chat) {
  // Check if the user's data has already been recorded
  const data = fs.readFileSync("user-data.json");
  const users = JSON.parse(data);
  const user = users.find((user) => user.id === id);

  // Проверка на наличие пользователя в базе
  if (!user) {
    users.push({ id, name, chat, key: [] });
    fs.writeFileSync("user-data.json", JSON.stringify(users, null, 2));
  }
}

//ищем рандомный ключ из базы ключей
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
// удаляем найденный ключ из базы
function deleteElement(array, element) {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
}
//обновляем файл базы ключей
function saveFile(array, filename) {
  fs.writeFile(filename, JSON.stringify(array, null, 2), (err) => {
    if (err) {
      console.error(err);
    }
  });
}
//выдаем ключ пользователю
function getKeyExpendet(keybase, userId, period) {
  const filename = keybase;
  const arrayUser = createArrayFromFile("user-data.json");
  const object = findObjectInArray(arrayUser, "id", userId);
  //находим массив свойства 'key'
  const arrayKey = object.key;
  //получаем длинну массива 'key'
  let length = findArrayLength(arrayKey);
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const arrayKeys = JSON.parse(data);
    const randomElement = getRandomElement(arrayKeys);

    if (arrayKeys.length === 0) {
      console.log("Ключи закончились");
      bot.sendMessage(userId, "ключи закочились");
    } else if (length >= 1) {
      bot.sendMessage(userId, "дохуя ключей у тебя, не думаешь?");
    } else {
      addPropertyToObject(object, "key", randomElement);
      saveArrayToFile(arrayUser, "user-data.json");
      bot.sendMessage(
        userId,
        `Ваш ключ на ${period} месяц(а): 
${randomElement.key}`
      );
      deleteElement(arrayKeys, randomElement);
      saveFile(arrayKeys, filename);
    }
  });
}

//прослушиваем нажатие кнопок
bot.on("callback_query", (query) => {
  const { chat, message_id, text } = query.message;
  const username = query.from.username;
  const userId = query.from.id;
  //массив пользователей
  const arrayUsers = createArrayFromFile("user-data.json");
  //поиск пользователя по id
  const user = arrayUsers.find((user) => user.id === userId);
  const userKey = user.key[0];

  //привязка действий к кнопкам
  btnsPeriod.forEach((btn) => {
    if (query.data === `${btn}-ext` && btn === "1") {
      bot.sendMessage(
        userId,
        `заявка на продление ключа на 1 месяц отправлена

Ваш ключ:
'${userKey.key}'`
      );
      bot.sendMessage(
        myId,
        `запрос на продление от пользователя на 1 месяц:
       
      UserName: ${username}
      UserId:   ${userId}
      key:  ${userKey.name}
      `
      );
    } else if (query.data === `${btn}-ext` && btn === "3") {
      bot.sendMessage(
        userId,
        `заявка на продление ключа на 3 месяца отправлена
        
Ваш ключ:        
'${userKey.key}'`
      );
      bot.sendMessage(
        myId,
        `запрос на продление от пользователя на 3 месяцa:
       
      UserName: ${username}
      UserId:   ${userId}
      key:  ${userKey.name}
      `
      );
    } else if (query.data === `${btn}-bay`) {
      getKeyExpendet("dataKeys1m.json", userId, btn);
    }
  });

  if (query.data === "back") {
    // Возвращаемся на предыдущий экран

    bot.editMessageText("Выбыирайте", {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      reply_markup: { inline_keyboard },
    });
  }

  switch (query.data) {
    //кнопка купить ключ
    case "bay":
      if (userKey === undefined) {
        bot.editMessageText("Выберете срок подписки", {
          chat_id: chat.id,
          message_id: message_id,
          reply_markup: { inline_keyboard: [...creatBtnBay(btnsPeriod)] },
        });
      } else {
        bot.editMessageText(
          "У вас уже есть ключ. Для удобства просто продлите его",
          {
            chat_id: chat.id,
            message_id: message_id,
            reply_markup: {
              inline_keyboard: [...extendKey],
            },
          }
        );
      }

      break;

    //проверка наличи ключей
    case "check":
      if (userKey === undefined) {
        bot.editMessageText("у вас нет ключей", {
          chat_id: chat.id,
          message_id: message_id,
          reply_markup: {
            inline_keyboard,
          },
        });
      } else {
        bot.sendMessage(
          userId,
          `Ваш ключ:
${userKey.key}`
        );
      }

      break;
    //кнопка продлить ключ
    case "extend_key":
      bot.editMessageText("Выберете срок продления подписки", {
        chat_id: chat.id,
        message_id: message_id,
        reply_markup: { inline_keyboard: [...creatBtnsPeriod(btnsPeriod)] },
      });

      break;

    //кнопка с програмами
    case "apps":
      bot.editMessageText(`Приложения для подключения:`, {
        chat_id: chat.id,
        message_id: message_id,
        reply_markup: {
          inline_keyboard: [...appBtn],
        },
      });

      break;

    //кнопка "Связаться с разработчиком"
    case "feedback":
      bot.sendMessage(
        chat.id,
        `Опишите вашу проблему. Начните сообщение с /help`
      );
      break;
  }

  bot.answerCallbackQuery({
    callback_query_id: query.id,
  });
});

bot.onText(/\/start/, (msg, [source, match]) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;

  storeUserData(userId, username, chatId);

  bot.sendMessage(chatId, "выбирайте", {
    reply_markup: {
      inline_keyboard,
    },
  });
});

bot.onText(/\/help (.+)/, (msg, [source, match]) => {
  const { id } = msg.chat;
  bot
    .sendMessage(
      myId,
      `
      Запрос в поддержку:

      ID: ${msg.from.id}
      IDMessege: ${msg.message_id}
      Name: ${msg.from.username}
      text:
      ${msg.text}`
    )
    .then(() => {
      bot.sendMessage(id, "заявка отправлена!", {
        reply_markup: {
          inline_keyboard,
        },
      });
    });
});

bot.onText(/\/more/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Этот бот сделан для получения доступа к VPN на технологии VLESS xtls-reality. Если вкратце, то мы будем упаковывать свой трафик в HTTPS и прятаться за чужими доменами. То есть даже если провайдер будет проверять наш трафик то он получит данные и сертификат сайта за которым мы прикрываемся. И заблокировать у провайдеров всё это получится очень не скоро.
    ——————————————————————
    "VLESS является более новым, более продвинутым и безопасным протоколом. Обеспечивает проверку "свой/чужой" и изменение размеров пакетов для затруднения идентификации паттернов трафика. Это делает анализ трафика "снаружи" сложнее и защищает пользователей. Поэтому, на текущий момент VLESS является одним из самых современным и прогрессивных протоколов из всех представленных."

    Google (с)`
  );
});
