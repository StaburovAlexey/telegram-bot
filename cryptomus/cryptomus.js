const {
  updatingPaymentStatus,
  writePayment,
  MongoDBclient,
  db,
  addEndDate
} = require("../dataBase/dataBase");

const {
  inline_keyboard,
} = require("../inline_keyboard");
const { bot, APIKEY, MERCHANTID } = require("../token");
const https = require("node:https");
const dataPay = {
  amount: "50",
  currency: "RUB",
  to_currency: "TON",
  network: "TON",
  order_id: "",
  lifetime: "300",
  subtract: "100",
};
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
            addEndDate(payment.userId)
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
      после оплаты ожидайте уведомление от бота о успешной оплате`,
        {
          chat_id: userId,
          message_id: message_id,
          reply_markup: {
            inline_keyboard: inline_keyboard,
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

module.exports = {
  arrayNotPaid,
  sendPay,
  dataPay,
};
