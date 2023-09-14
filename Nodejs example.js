const https = require('https');

const data = {
    amount: '15',
    currency: 'USD',
    network: 'tron',
    order_id: '1',
    url_callback: 'https://example.com'
};

const APIKEY = 'your_api_key';
const MERCHANTID = 'your_merchant_id';

const jsonData = JSON.stringify(data).replace(/\//mg, "\\/");
const sign = require('crypto').createHash('md5').update(Buffer.from(jsonData).toString('base64') + APIKEY).digest('hex');

const options = {
    hostname: 'api.cryptomus.com',
    path: '/v1/payment/services',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'merchant': MERCHANTID,
        'sign': sign
    }
};

const req = https.request(options, res => {
    let body = '';
    res.on('data', chunk => {
        body += chunk;
    });
    res.on('end', () => {
        console.log(body);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(jsonData);
req.end();
