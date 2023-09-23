const { uri } = require("../token");

//подключаем Mongo
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const MongoDBclient = new MongoClient(uri);
const db = MongoDBclient.db("vpnSAILess");

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
//добовление оплаты в базу
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

//добавление срока подписки в базу к ключам
const addEndDate = async (userId) => {
  try {
    const dateEnd = new Date();
    dateEnd.setDate(date.getDate() + 31);
    await MongoDBclient.connect();

    const employees = db.collection("users");
    await employees.updateOne(
      { userId: userId },
      {
        $set: {
          timeEnd: `${dateEnd.getFullYear()} ${dateEnd.getMonth()} ${dateEnd.getDate()}`,
        },
      }
    );

    await MongoDBclient.close();
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  MongoDBclient,
  db,
  findUserAndAdd,
  findUserHaveKey,
  visionKeyUser,
  searchAndKeyIssuance,
  findArrayOrderId,
  findPaymentForId,
  updatingPaymentStatus,
  writePayment,
  addEndDate
};
