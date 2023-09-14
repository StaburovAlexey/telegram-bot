const connect = async () =>{
  try {
      await MongoDBclient.connect()
      console.log("Успешно подключились к базе данных")
      await MongoDBclient.close()
      console.log("Закрыли подключение")
  } catch (e) {
      console.log(e)
  }
}

connect()
const Count = async () =>{
  try {
      await MongoDBclient.connect()
      console.log("Успешно подключились к базе данных")

      const AllDocuments = await db.collection('keys').find().toArray()
      console.log("Количество документов в базе данных:", AllDocuments.length)

      await MongoDBclient.close()
      console.log("Закрыли подключение")
  } catch (e) {
      console.log(e)
  }
}

Count()


const employee = {
   patronymic: 'Olegovich',
   surname: 'Eparskii',
   age: 45,
   salary: 260000,
   department: 'DevRel',
   date_of_birth: '15.11.1977',
   first_name: 'Anton'
}

const InsertUser = async (user) =>{
   try {
       await MongoDBclient.connect()
       console.log("Успешно подключились к базе данных")

       const employees = MongoDBclient.db('vpnsailess').collection('users')
       await employees.insertOne(user)

       await MongoDBclient.close()
       console.log("Закрыли подключение")
   } catch (e) {
       console.log(e)
   }
}

Insert()

const Update = async () =>{
  try {
      await MongoDBclient.connect()
      console.log("Успешно подключились к базе данных")

      const employees = MongoDBclient.db('testdb').collection('employees')
      await employees.findOneAndUpdate({first_name: 'Anton'} , { $set: {first_name: "Antoshka"}})

      await MongoDBclient.close()
      console.log("Закрыли подключение")
  } catch (e) {
      console.log(e)
  }
}

Update()

const insertManyKey = async () => {
  try {
    await MongoDBclient.connect();
    console.log("Успешно подключились к базе данных");

    const employees = db.collection("keys");
    await employees.insertMany([
      {
        url: "vless://a495429c-e6b8-44f7-9e06-6ad8fdb8bf9b@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-uihmhal6",
      },
      {
        url: "vless://3156fd65-b1ae-42b7-a4c1-301a7fb6e793@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-pf8m1t9n",
      },
      {
        url: "vless://69f1f5fe-5289-4aa9-a7d2-aab1695a9bd0@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-rgzmxwap",
      },
      {
        url: "vless://87352198-f9f2-43be-b7a8-a92e45ecebca@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-du69q7j7",
      },
      {
        url: "vless://1d8e20cf-aa74-4539-a3e5-ef3329b5481d@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-6sat0hx4",
      },
      {
        url: "vless://6b9eb6cf-5286-45ed-9d52-b1cc1d08f4ae@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-cywkc5tu",
      },
      {
        url: "vless://4dac375e-57b5-4c14-8898-7366fab5d141@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-mvdp8ztr",
      },
      {
        url: "vless://969c2186-35e9-4af4-872b-c382cd0c2f22@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-07f6z8va",
      },
      {
        url: "vless://209d4f9c-aa1f-4916-8a6f-9159e658d7eb@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-lo6mhaq7",
      },
      {
        url: "vless://ec945ccb-a9e4-4443-967f-5b53ec6a9b76@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-mroa9w9t",
      },
      {
        url: "vless://3f895b2c-294c-4ea0-af18-16be8df57e72@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-8hu6afa0",
      },
      {
        url: "vless://1c1c411f-be9e-4db0-a9b6-30596f1f21a4@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-0a6l2ai1",
      },
      {
        url: "vless://f5e37e84-7f40-48c1-8cb2-03ffa33f0f5d@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-yh2bd792",
      },
      {
        url: "vless://74a8b131-a4c6-4f9e-8331-03298a6c7214@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-t189shes",
      },
      {
        url: "vless://de293b32-3734-4410-b131-49d8b4d5d8a1@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-kmv1uuee",
      },
      {
        url: "vless://3d99049a-93ed-4f0c-b75d-c9568ffaa2d0@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-9v25dvwl",
      },
      {
        url: "vless://02cc8f80-b38b-4e2a-80c5-8b4af2f45b2a@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-xi46xt8c",
      },
      {
        url: "vless://3573e634-7e8e-4531-bdd8-51fd55d9fa77@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-dfn53gw5",
      },
      {
        url: "vless://34a01f4c-8178-4226-b4cf-a56824de0e9b@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-u10a5ppv",
      },
      {
        url: "vless://6c0a5963-1efb-4603-9f12-5d3128aaf925@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-35lc2jyj",
      },
      {
        url: "vless://1083053b-ff37-44ea-8469-6c2e6d14ab24@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-o9h48ozz",
      },
      {
        url: "vless://2ecf8413-af4d-4ba0-bbf1-186330a3db6e@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-jt4imrax",
      },
      {
        url: "vless://e6cad103-8a37-4ca2-a166-6143e590e244@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-96jf48za",
      },
      {
        url: "vless://7b32c1d1-ac63-4238-8216-b1fff7f7d9d9@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-f2v121z9",
      },
      {
        url: "vless://0a6e3d6b-dd90-40b2-8b83-2d207393c31f@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-mjxe1ihj",
      },
      {
        url: "vless://5e786a19-2105-4e7d-8cdc-3ae9ff87e073@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-2zz80teh",
      },
      {
        url: "vless://7aa85072-a21b-49d8-9743-e10132f2b58c@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-snp9gkte",
      },
      {
        url: "vless://c10940b3-9928-4cbd-9022-5e318403cb34@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-g2e8udlr",
      },
      {
        url: "vless://cab23bda-47c3-4ef5-804a-94791b709d3a@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-zrqnl6k1",
      },
      {
        url: "vless://49f46c7d-ace3-4f15-a394-7e3879416f96@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-x6s1wrq3",
      },
      {
        url: "vless://4db59080-c011-4567-bd06-b12aa967d03c@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-5ad2oqrx",
      },
      {
        url: "vless://549122dd-9b86-490b-93a4-0b4373014cda@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-exrdsms6",
      },
      {
        url: "vless://a783b62c-7fea-4158-8480-148244f44c3b@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-vej0dqvo",
      },
      {
        url: "vless://b197c339-9576-4816-88e3-c8504715cbae@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-l02j4kls",
      },
      {
        url: "vless://79ba9d85-e992-4e95-9b05-70941453449d@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-iyxtdmdu",
      },
      {
        url: "vless://14d69223-0972-494e-b95f-9c13cc91ed35@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-j8viii26",
      },
      {
        url: "vless://0ca6bd4d-a51c-4cc6-9a46-0c91ab120ede@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-8zek2o68",
      },
      {
        url: "vless://91d41d13-5446-46b6-ae96-059fc7afb9a8@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-n8s72mh1",
      },
      {
        url: "vless://896823c7-ca8e-48b9-acad-17659f27f867@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-t71hmeq4",
      },
      {
        url: "vless://f6e49ae8-acc4-46a4-9375-8da66ef88a08@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-1u3qxo85",
      },
      {
        url: "vless://8cb3f47d-7679-4ec8-899c-e0da6af54875@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-uj8a6rrw",
      },
      {
        url: "vless://01957c5e-517f-4d63-b33e-1b35f2b9cfaf@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-1lsz4rq6",
      },
      {
        url: "vless://79f0eb0b-2aa9-4b68-b4c6-700cf3ff25ed@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-unvmbwxu",
      },
      {
        url: "vless://6639c0c3-0e94-4282-86be-01e503c4b1b4@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-4satde4j",
      },
      {
        url: "vless://e8ff2e43-8c2a-4904-a3a9-22353b734368@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-hjore99s",
      },
      {
        url: "vless://15e7aead-f50f-4b40-a567-f986c717dde0@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-prel9p3k",
      },
      {
        url: "vless://b7040a6b-936c-464c-b625-ee540a1e2da1@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-jxbwbfv4",
      },
      {
        url: "vless://b7f1db2a-a4ac-4b76-a7b9-658421e9a642@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-hlf943h4",
      },
      {
        url: "vless://57aacc37-3eb8-4abf-8750-2263654466f3@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-zodg4nkx",
      },
      {
        url: "vless://39cdab29-19e0-4d4a-a094-63d15e02fa59@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-1n8pmtio",
      },
      {
        url: "vless://aeecae30-68a7-418f-8ffb-5e7019a33098@185.198.166.175:433?type=tcp&security=reality&fp=firefox&pbk=pb58TfnOxa7mx7kqEDOfWp-n4K5ZOlD7PRxMsw2NUB8&sni=dutchexpatshop.com&sid=a070c948&spx=%2F",
        urlName: "vpnSAILess-q7ysil9c",
      },
    ]);

    await MongoDBclient.close();
    console.log("Закрыли подключение");
  } catch (e) {
    console.log(e);
  }
};


//проверка оплаты пользователя
async function checkPayUser(dataPay, userId) {
  const payment = await findPaymentForId(userId);
  // добавляем в dataPay номер заказа у пользователя
  dataPay.order_id = payment.orderId;
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
      if (payFile.result["is_final"] === true) {
        bot.sendMessage(
          payment.userId,
          "Оплата прошла успешно! В течении 15-30 минут ключ будет продлен."
        );
      } else {
        bot.sendMessage(payment.userId, "eeeee");
      }
    });

    req.on("error", (error) => {
      console.error(error);
    });

    req.write(jsonDataPay);

    req.end();
  });
}
