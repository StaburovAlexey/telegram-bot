const { match } = require("assert");
const { url } = require("inspector");
const cron = require("node-cron");
// импортируем модуль для работы с файловой системой
const fs = require("fs");
const {
  inline_keyboard,
  extendKey,
  appBtn,
  backButton,
  adminBtn,
  checkBtn,
} = require("./inline_keyboard");
const { bot, APIKEY, MERCHANTID, uri } = require("./token");
//=====================================
const https = require("node:https");
//подключаем Mongo
const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const MongoDBclient = new MongoClient(uri);
const db = MongoDBclient.db("vpnSAILess");
const dataPay = {
  amount: "50",
  currency: "RUB",
  to_currency: "TON",
  network: "TON",
  order_id: "",
  lifetime: "300",
};
const myId = 807148322;

//==================
console.log("bot activated");
bot.on("polling_error", console.log);
cron.schedule("*/5 * * * * *", async () => {
  arrayNotPaid();
});
//проверка оплаты для cron
async function payCheck() {}
//перебор неоконченных оплат
async function arrayNotPaid() {
  try {
    await MongoDBclient.connect();

    const employees = db.collection("payment");
    const payments = await employees.find({ isFinal: false }).toArray();
    await MongoDBclient.close();

    payments.forEach((payment) => {
      dataPay.order_id = payment.orderId;

      const jsonData = JSON.stringify(dataPay).replace(/\//gm, "\\/");
      const sign = require("crypto")
        .createHash("md5")
        .update(Buffer.from(jsonData).toString("base64") + APIKEY)
        .digest("hex");

      const options = {
        hostname: "api.cryptomus.com",
        path: "/v1/payment",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          merchant: MERCHANTID,
          sign: sign,
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          const payFile = JSON.parse(body);

          const orderId = payFile.result["order_id"];
          const isFinal = payFile.result["is_final"];
          if (
            payFile.result["is_final"] === true &&
            (payFile.result["payment_status"] === "wrong_amount" ||
            payFile.result["payment_status"] === "paid_over" ||
            payFile.result["payment_status"] === "paid")
          ) {
            updatingPaymentStatus(orderId, isFinal);
            bot.sendMessage(
              payment.userId,
              `Оплата по заказу №${payment.orderId} прошла успешно! В течении 15-30 минут ключ будет продлен.`
            );
          } else if (
            payFile.result["is_final"] === true ||
            payFile.result["is_final"] === "cancel"
          ) {
            updatingPaymentStatus(orderId, isFinal);
            bot.sendMessage(
              payment.userId,
              `время предоставления ссылки для оплаты по заказу №${payment.orderId}истекло. попробуйте заплатить сново`
            );
          }
        });
      });

      req.on("error", (error) => {
        console.error(error);
      });

      req.write(jsonData);
      req.end();
    });
  } catch (e) {
    console.log(e);
  }
}
//добавляем юзера в базу
const InsertUser = async (user) => {
  try {
    await MongoDBclient.connect();

    const employees = db.collection("users");
    await employees.insertOne(user);

    await MongoDBclient.close();
  } catch (e) {
    console.log(e);
  }
};
//проверка юзера в базе если его нет то добаляем в базу
const findUserAndAdd = async (user, userId) => {
  try {
    await MongoDBclient.connect();
    console.log("Успешно подключились к базе данных");

    const findId = await db.collection("users").findOne({ userId: userId });
    if (!findId) {
      await InsertUser(user);
    } else {
      console.log("Пользователь уже добавлен");
    }

    await MongoDBclient.close();
    console.log("Закрыли подключение");
  } catch (e) {
    console.log(e);
  }
};
//проверка есть ли ключ у пользователя
const findUserHaveKey = async (userId) => {
  try {
    await MongoDBclient.connect();

    const employees = db.collection("users");
    const user = await employees.findOne({ userId: userId });

    await MongoDBclient.close();
    //возвращаем есть ли ключ
    if (user.key) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};
//показать ключ пользователя
const visionKeyUser = async (userId) => {
  try {
    await MongoDBclient.connect();

    const employees = db.collection("users");
    const user = await employees.findOne({ userId: userId });

    await MongoDBclient.close();
    //возвращаемключ
    return user.key;
  } catch (e) {
    console.log(e);
  }
};
//поиск не используемового ключа и выдача
const searchAndKeyIssuance = async (userId) => {
  try {
    await MongoDBclient.connect();

    const employeeskey = db.collection("keys");
    const key = await employeeskey.findOne({ userId: { $exists: false } });
    if (key) {
      key.userId = userId;
      // Обновить документ в коллекции
      await employeeskey.updateOne({ _id: key._id }, { $set: key });
      await giveKey(userId, key);
    } else {
      console.log('Документ без свойства "key" не существует в коллекции');
    }

    await MongoDBclient.close();
  } catch (e) {
    console.log(e);
  }
};
//добовление пользователю ключа
const giveKey = async (userId, key) => {
  try {
    await MongoDBclient.connect();

    const employeesuser = db.collection("users");
    const user = await employeesuser.findOne({ userId: userId });

    user.key = [key.url, key.urlName];

    await employeesuser.updateOne({ _id: user._id }, { $set: user });

    await MongoDBclient.close();
  } catch (e) {
    console.log(e);
  }
};
//добовление оплаты в массив
const writePayment = async (userId, order_id, amount, url, is_final) => {
  try {
    await MongoDBclient.connect();

    const employees = db.collection("payment");
    await employees.insertOne({
      userId: userId,
      orderId: order_id,
      amount: amount,
      url: url,
      isFinal: is_final,
    });

    await MongoDBclient.close();
  } catch (e) {
    console.log(e);
  }
};
const Find = async () => {
  try {
    await MongoDBclient.connect();
    console.log("Успешно подключились к базе данных");

    const AllDocuments = await db.collection("payment").find().toArray();
    console.log(AllDocuments);

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
async function pay(userId, message_id, sum) {
  const randomValue = await generateOrderId();
  dataPay.order_id = randomValue;
  dataPay.amount = sum;
  sendPay(dataPay, userId, message_id);
}
//генерация order_id и проверка на повторение
async function generateOrderId() {
  // Создать функцию для генерации случайного значения из цифр и букв
  function generateRandomValue() {
    // Создать пустую строку для хранения случайного значения
    let randomValue = "";
    // Сгенерировать 15 случайных чисел от 0 до 9 и добавить их к строке
    for (let i = 0; i < 15; i++) {
      randomValue += Math.floor(Math.random() * 10);
    }

    // Сгенерировать 15 случайных букв от A до Z и добавить их к строке
    for (let i = 0; i < 15; i++) {
      randomValue += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    // Вернуть случайное значение
    return randomValue;
  }
  const randomValue = generateRandomValue();
  const find = await findArrayOrderId(randomValue);
  if (find === true) {
    generateOrderId();
  } else {
    return randomValue;
  }
}
//есть ли сгенерированый ордер в базе возвращает булево значение
const findArrayOrderId = async (randomValue) => {
  try {
    await MongoDBclient.connect();
    const employees = db.collection("payment");
    const payments = await employees.find({ orderId: randomValue }).toArray();
    await MongoDBclient.close();
    if (payments.length == 0) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.log(e);
  }
};
//поиск оплаты по id юзера
const findPaymentForId = async (userId) => {
  try {
    await MongoDBclient.connect();

    const employees = db.collection("payment");
    const payment = await employees
      .find({ userId: userId, isFinal: false })
      .limit(1)
      .sort({ $natural: -1 })
      .toArray();

    await MongoDBclient.close();
    //возвращаем платеж
    return payment;
  } catch (e) {
    console.log(e);
  }
};
//обновление статуса оплаты в базе
const updatingPaymentStatus = async (orderId, isFinal) => {
  try {
    await MongoDBclient.connect();

    const employees = db.collection("payment");
    await employees.updateOne(
      { orderId: orderId },
      {
        $set: { isFinal: isFinal },
      }
    );

    await MongoDBclient.close();
  } catch (e) {
    console.log(e);
  }
};
//проверка оплаты пользователя
async function checkPayUser(dataPay, userId) {
  try {
    const payment = await findPaymentForId(userId);
    dataPay.order_id = payment[0].orderId;
    const jsonDataPay = JSON.stringify(dataPay).replace(/\//gm, "\\/");

    const sign = require("node:crypto")
      .createHash("md5")
      .update(Buffer.from(jsonDataPay).toString("base64") + APIKEY)
      .digest("hex");

    const options = {
      hostname: "api.cryptomus.com",
      path: "/v1/payment",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: MERCHANTID,
        sign: sign,
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        const payFile = JSON.parse(body);
        if (
          payFile.result["is_final"] === true &&
          (payFile.result["payment_status"] === "paid" ||
            payFile.result["payment_status"] === "paid_over" ||
            payFile.result["payment_status"] === "wrong_amount")
        ) {
          const orderId = payFile.result["order_id"];
          const isFinal = payFile.result["is_final"];
          updatingPaymentStatus(orderId, isFinal);
          bot.sendMessage(
            payment[0].userId,
            "Оплата прошла успешно! В течении 15-30 минут ключ будет продлен."
          );
        } else if (
          payFile.result["is_final"] === true &&
          payFile.result["payment_status"] === "cancel"
        ) {
          bot.sendMessage(
            payment[0].userId,
            "cсылка устарела, продлите ключ заного"
          );
        } else {
          bot.sendMessage(payment[0].userId, "в процессе");
        }
      });
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.write(jsonDataPay);

    req.end();
  } catch (e) {
    console.log(e);
  }
}
//отправка запроса на оплату
function sendPay(dataPay, userId, message_id) {
  const jsonDataPay = JSON.stringify(dataPay).replace(/\//gm, "\\/");

  const sign = require("node:crypto")
    .createHash("md5")
    .update(Buffer.from(jsonDataPay).toString("base64") + APIKEY)
    .digest("hex");

  const options = {
    hostname: "api.cryptomus.com",
    path: "/v1/payment",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      merchant: MERCHANTID,
      sign: sign,
    },
  };

  const req = https.request(options, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      //получаем массив из body
      const payFile = JSON.parse(body);
      const order_id = payFile.result["order_id"];
      const amount = payFile.result["amount"];
      const url = payFile.result["url"];
      const is_final = payFile.result["is_final"];
      writePayment(userId, order_id, amount, url, is_final);
      //добавляем даные по заказу пользователю

      bot.editMessageText(
        `Ваша ссылка на оплату  по заказу №${order_id}
      ${url}
      после перехода по ссылке и оплаты, нажмите кнопку "проверить платеж"`,
        {
          chat_id: userId,
          message_id: message_id,
          reply_markup: {
            inline_keyboard: [...checkBtn],
          },
        }
      );
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(jsonDataPay);

  req.end();
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
              inline_keyboard: [...extendKey],
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
                [backButton],
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
            [{ text: "150руб месяц безлимит", callback_data: `pay150` }],
            [{ text: "50 руб 15ГБ трафика", callback_data: `pay50` }],
            [backButton],
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
    //проверить оплату
    case "checkpay":
      checkPayUser(dataPay, userId);
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

bot.onText(/\/test/, (msg, [source, match]) => {
  const userId = msg.from.id;

  Find();
});

bot.onText(/\/del/, (msg, [source, match]) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const user = {
    id: userId,
    name: msg.from.username,
  };
  del(userId);
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

bot.onText(/\/pay/, (msg) => {
  const chatId = msg.from.id;
});
