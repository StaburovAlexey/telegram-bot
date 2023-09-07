const backButton = {
  text: `↩ Назад`,
  callback_data: "back",
};

const adminBtn = [
  [
    {
      text: "Количество пользователей",
      callback_data: "message_user",
    },
  ],
  [
    {
      text: "Количество активных ключей",
      callback_data: "message_active_key",
    },
  ],
  [
    {
      text: "Количество ключей",
      callback_data: "message_key",
    },
  ],
];
const inline_keyboard = [
  [
    {
      text: "💰Купить ключ",
      callback_data: "bay",
    },
  ],
  [
    {
      text: "🔑 Проверить наличие ключей",
      callback_data: "check",
    },
  ],
  [
    {
      text: "⚙️ Приложения для запуска",
      callback_data: "apps",
    },
  ],
  [
    {
      text: "💬 Связаться с разработчиком",
      callback_data: "feedback",
    },
  ],
];

const extendKey = [
  [
    {
      text: "⏳ Продлить ключ",
      callback_data: "extend_key",
    },
  ],
  [backButton],
];

const appBtn = [
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
];

module.exports = {
  inline_keyboard,
  extendKey,
  appBtn,
  backButton,
  adminBtn,
};
