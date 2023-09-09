const { match } = require("assert");
const {
  inline_keyboard,
  extendKey,
  appBtn,
  backButton,
  adminBtn,
} = require("./inline_keyboard");

// импортируем модуль для работы с файловой системой
const fs = require("fs");

const myId = 807148322;
const btnsPeriod = ["1", "3"];

console.log("bot activated");
const { bot } = require("./token");

bot.on("polling_error", console.log);
//создание массива активных ключей
function creatKeyArray(usersArray) {
  const keys = [];
  usersArray.forEach((element) => keys.push([element[0]]));
  return keys;
}

//создание кнопок из массива ключей
function creatIdArray(arrayUsers) {
  const ids = [];
  arrayUsers["id"].forEach((element) => btns.push(element));
  return ids;
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
      bot.sendMessage(userId, "У вас есть, ключ. Просто продлите его.");
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

    case "back":
      // Возвращаемся на предыдущий экран

      bot.editMessageText(
        `vpnSAILess открывает доступ к свободному и безопасному интернету с любого устройства

  📱 Доступ к Instagram, Twitter, TikTok, Facebook и другим недоступным ресурсам
        
  🚀 Хорошая скорость и неограниченное число устройств
        
  🚧  VPN надежно защищен от блокировок`,
        {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          reply_markup: { inline_keyboard },
        }
      );
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
        bot.sendMessage(userId, `Ваш ключ`);
        bot.sendMessage(userId, `${userKey.key}`);
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
    
    case "message_key":
      if (userId === myId) {
        fs.readFile("dataKeys1m.json", "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const arrayKeys = JSON.parse(data);

          const length = arrayKeys.length;

          bot.editMessageText(`Ключей осталось ${length}`, {
            chat_id: chat.id,
            message_id: message_id,
            reply_markup: {
              inline_keyboard: [...adminBtn],
            },
          });
        });
      }
      break;

    case "message_user":
      if (userId === myId) {
        fs.readFile("user-data.json", "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const arrayUser = JSON.parse(data);

          const length = arrayUser.length;
          bot.editMessageText(`Пользователей ${length}`, {
            chat_id: chat.id,
            message_id: message_id,
            reply_markup: {
              inline_keyboard: [...adminBtn],
            },
          });
        });
      }
      break;

    case "message_active_key":
      if (userId === myId) {
        fs.readFile("user-data.json", "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const arrayUser = JSON.parse(data);
          const usersWithKey = arrayUser.filter((item) => item.key != 0).length;
          bot.editMessageText(`Активных ключей ${usersWithKey}`, {
            chat_id: chat.id,
            message_id: message_id,
            reply_markup: {
              inline_keyboard: [...adminBtn],
            },
          });
        });
      }
      break;
  }

  bot.answerCallbackQuery({
    callback_query_id: query.id,
  });
});
bot.onText(/\/admin/, (msg, [source, match]) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;

  if (userId === myId) {
    bot.sendMessage(
      userId,
      `
Команды админа:

/sendAll - отправить сообщение всем
/sendOne userId - отправить сообщение пользователю

    `,
      {
        reply_markup: {
          inline_keyboard: [...adminBtn],
        },
      }
    );
  }
});

bot.onText(/\/start/, (msg, [source, match]) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;

  storeUserData(userId, username, chatId);

  bot.sendMessage(
    chatId,
    `vpnSAILess открывает доступ к свободному и безопасному интернету с любого устройства

  📱 Доступ к Instagram, Twitter, TikTok, Facebook и другим недоступным ресурсам
    
  🚀 Хорошая скорость и неограниченное число устройств

  🚧  VPN надежно защищен от блокировок`,
    {
      reply_markup: {
        inline_keyboard,
      },
    }
  );
});

bot.onText(/\/sendAll (.+)/, (msg, [source, match]) => {
  const { id } = msg.chat;

  fs.readFile("user-data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const array = JSON.parse(data);

    array.forEach((user) => {
      bot.sendMessage(user.id, `${match}`);
    });
  });
});

bot.onText(/\/sendOne (.+)/, (msg, [source, match]) => {
  const { id } = msg.chat;
  fs.readFile("user-data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    //делаем из сообщения массив
    const matchArray = match.split(" ");
    //удаляем из массива сообщения id пользователя
    const newArray = matchArray.slice(1);
    //возвращаем строку
    const string = newArray.join(" ");

    const array = JSON.parse(data);

    const user = array.find((user) => user.id == `${matchArray[0]}`);

    if (user === undefined) {
      bot.sendMessage(myId, "Не нашел id");
    } else {
      bot.sendMessage(user.id, string);
    }
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
      ${match}`
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
