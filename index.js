const { match } = require("assert");
const { url } = require("inspector");
const cron = require("node-cron");
const {
  inline_keyboard,
  extendKey,
  appBtn,
  backButton,
  adminBtn,
} = require("./inline_keyboard");

const { bot } = require("./token");
const {
  MongoDBclient,
  db,
  findUserAndAdd,
  findUserHaveKey,
  visionKeyUser,
  searchAndKeyIssuance,
  findArrayOrderId,
} = require("./dataBase/dataBase");
const { arrayNotPaid, sendPay, dataPay } = require("./cryptomus/cryptomus");

const myId = 807148322;
console.log("bot activated");
bot.on("polling_error", console.log);

//проверка статуса олпаты
cron.schedule("*/5 * * * * *", async () => {
  arrayNotPaid();
});
//проверка статуса подписки
cron.schedule("* * */13 * * *", async () => {
  checkSub();
});

const Find = async () => {
  try {
    await MongoDBclient.connect();
    console.log("Успешно подключились к базе данных");

    const AllDocuments = await db.collection("users").find().toArray();
    console.log(AllDocuments);

    await MongoDBclient.close();
    console.log("Закрыли подключение");
  } catch (e) {
    console.log(e);
  }
};
const Update = async (userId) => {
  try {
    await MongoDBclient.connect();
    console.log("Успешно подключились к базе данных");

    const employees = db.collection("users");
    await employees.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          timeEnd: `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`,
        },
      }
    );

    await MongoDBclient.close();
    console.log("Закрыли подключение");
  } catch (e) {
    console.log(e);
  }
};
const del = async (userId) => {
  try {
    await MongoDBclient.connect();
    console.log("Успешно подключились к базе данных");
    // Получить коллекцию
    const employees = db.collection("users");

    // Удалить все документы из коллекции
    await employees.deleteMany({});

    // Закрыть соединение с базой данных
    await MongoDBclient.close();
    console.log("Закрыли подключение");
  } catch (e) {
    console.log(e);
  }
};
//оплата
async function pay(userId, message_id, sum) {
  const randomValue = await generateOrderId();
  dataPay.order_id = randomValue;
  dataPay.amount = sum;
  sendPay(dataPay, userId, message_id);
}
// Создать функцию для генерации случайного значения из цифр и букв
function generateRandomValue() {
  let randomValue = "";
  const words =
    "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  var max_position = words.length - 1;
  for (i = 0; i < 20; ++i) {
    position = Math.floor(Math.random() * max_position);
    randomValue = randomValue + words.substring(position, position + 1);
  }
  // Вернуть случайное значение
  return randomValue;
}
//генерация order_id и проверка на повторение
async function generateOrderId() {
  const randomValue = generateRandomValue();
  const find = await findArrayOrderId(randomValue);
  if (find === true) {
    generateOrderId();
  } else {
    return randomValue;
  }
}

//проверка крон на состояние подписки
async function checkSub() {
  try {
    const date = new Date();
    const dateWarning = new Date();

    dateWarning.setDate(date.getDate() + 3);

    await MongoDBclient.connect();

    const users = await db.collection("users").find().toArray();

    await MongoDBclient.close();
    users.forEach((user) => {
      if (
        user.timeEnd ==
        `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`
      ) {
        bot.sendMessage(user.userId, "подписка закончилась");
      } else if (
        user.timeEnd ==
        `${dateWarning.getFullYear()} ${dateWarning.getMonth()} ${dateWarning.getDate()}`
      ) {
        bot.sendMessage(user.userId, "подписка закончится через 3 дня");
      }else{
        bot.sendMessage(myId,"Проверка пользователей на подписку")
      }
    });
  } catch (e) {
    console.log(e);
  }
}

//прослушиваем нажатие кнопок
bot.on("callback_query", async (query) => {
  const { chat, message_id, text } = query.message;
  const username = query.from.username;
  const userId = query.from.id;
  //есть ли ключ у юзера true/false
  const keyBooleen = await findUserHaveKey(userId);

  switch (query.data) {
    //кнопка купить ключ
    case "bay":
      if (keyBooleen === true) {
        bot.editMessageText(
          "У вас уже есть ключ. Для удобства просто продлите его",
          {
            chat_id: chat.id,
            message_id: message_id,
            reply_markup: {
              inline_keyboard: extendKey,
            },
          }
        );
      } else {
        searchAndKeyIssuance(userId);
        bot.editMessageText(
          "Вам выдан ключ с пробным периудом 2 дня. Потом просто продлите его.",
          {
            chat_id: userId,
            message_id: message_id,
            reply_markup: {
              inline_keyboard: [
                [{ text: "150руб месяц безлимит", callback_data: `pay150` }],
                [{ text: "50 руб 15ГБ трафика", callback_data: `pay50` }],
                [
                  {
                    text: "🔑 Показать ключ",
                    callback_data: "check",
                  },
                ],
                [
                  {
                    text: "🤖 Android",
                    url: "https://play.google.com/store/apps/details?id=com.v2ray.ang&hl=ru&gl=US&pli=1",
                  },
                  {
                    text: "🍎 iOS",
                    url: "https://apps.apple.com/us/app/foxray/id6448898396",
                  },
                ],
                [
                  {
                    text: `↩ Назад`,
                    callback_data: "back",
                  },
                ],
              ],
            },
          }
        );
      }

      break;
    // Возвращаемся на предыдущий экран
    case "back":
      bot.editMessageText(
        `vpnSAILess открывает доступ к свободному и безопасному интернету с любого устройства

  📱 Доступ к Instagram, Twitter, Facebook и другим недоступным ресурсам

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
      if (keyBooleen === true) {
        const key = await visionKeyUser(userId);
        bot
          .sendMessage(userId, `Ваш ключ №${key[1]}:`)
          .then(bot.sendMessage(userId, `${key[0]}`));
      } else {
        bot.editMessageText("у вас нет ключей", {
          chat_id: chat.id,
          message_id: message_id,
          reply_markup: {
            inline_keyboard,
          },
        });
      }
      break;
    // кнопка продлить ключ
    case "extend_key":
      bot.editMessageText("Выберете вид продления подписки", {
        chat_id: chat.id,
        message_id: message_id,
        reply_markup: {
          inline_keyboard: [
            [{ text: "💲 150руб месяц безлимит", callback_data: `pay150` }],
            [{ text: "💲 50 руб 15ГБ трафика", callback_data: `pay50` }],
            backButton,
          ],
        },
      });
      break;
    // оплата 150
    case "pay150":
      pay(userId, message_id, "150");
      break;
    //оплата 50
    case "pay50":
      pay(userId, message_id, "50");
      break;
    // //кнопка с програмами
    case "apps":
      bot.editMessageText(`Приложения для подключения:`, {
        chat_id: chat.id,
        message_id: message_id,
        reply_markup: {
          inline_keyboard: [appBtn, backButton],
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
    //проверить оплату
    case "checkpay":
      arrayNotPaid();
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
  const user = {
    userId: chatId,
    name: msg.from.username,
  };
  findUserAndAdd(user, userId);

  bot.sendMessage(
    chatId,
    `vpnSAILess открывает доступ к свободному и безопасному интернету с любого устройства

  📱 Доступ к Instagram, Twitter, Facebook и другим недоступным ресурсам

  🚀 Хорошая скорость и неограниченное число устройств

  🚧  VPN надежно защищен от блокировок`,
    {
      reply_markup: {
        inline_keyboard,
      },
    }
  );
});

bot.onText(/\/test/, (msg, [source, match]) => {
  const userId = msg.from.id;

  Find();
});

bot.onText(/\/del/, (msg, [source, match]) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  del(userId);
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
