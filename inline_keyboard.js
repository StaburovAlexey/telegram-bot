const backButton = {
  text: `↩ Назад`,
  callback_data: 'back',
};

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

const bay_keyboard = [
  [
    {
      text: "1 месяц / 120руб",
      callback_data: "1m",
    },
  ],
  [
    {
      text: "3 месяца / 360руб",
      callback_data: "3m",
    },
  ],
  [
    backButton,
  ],
];

const extend_keyboard = [
  [
    {
      text: "1 месяц / 120руб",
      callback_data: "1m-ext",
    },
  ],
  [
    {
      text: "3 месяца / 360руб",
      callback_data: "3m-ext",
    },
  ],
  [
    {
      text: "6 месяцев / 720руб",
      callback_data: "6m-ext",
    },
  ],
  [
    {
      text: "12 месяцев / 1440руб",
      callback_data: "12m-ext",
    },
  ],
  [
    {
      text: "Назад",
      callback_data: "back",
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
  [
    backButton,
  ],
]

const appBtn = [
  [
    {
      text:'🤖 Android',
      url: 'https://play.google.com/store/apps/details?id=com.v2ray.ang&hl=ru&gl=US&pli=1',
    },
    {
      text:'🍎 iOS',
      url: 'https://apps.apple.com/us/app/foxray/id6448898396',
    }
  ],
  [
    backButton,
  ]
]
module.exports = {
  inline_keyboard,
  bay_keyboard,
  extend_keyboard,
  extendKey,
  appBtn,
  backButton
};
