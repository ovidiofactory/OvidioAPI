const appName = "Node Js Api Ovidio";
const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

// Configurar cabeceras y cors
// app.use((req, res, next) => {
//  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//  next();
// });

// END-POINT PASARELA
const PAYMENT_GP_TOKEN_URL = "https://api.huli.io/practice/v2/payment/gp/token";

app.get('/',(req, res) =>{
    res.send(appName);
})

app.post('/practice/v2/payment/gp/token', (req, res) => {

    console.log(JSON.stringify(req.body));

    var data = JSON.stringify({
          name: req.body.name,
          number: req.body.number,
          cvc: req.body.cvc,
          expirationMonth: req.body.expirationMonth,
          expirationYear: req.body.expirationYear,
          nickname: req.body.nickname,
          e:1
    });

    var datatoken = JSON.stringify({
      "api_key": "feU5neXF7QAkLzkdi4MJhdkE/i7bFlv3EJEP2rfp4r8"
    });
      
    var configtoken = {
      method: 'post',
      url: 'https://api.huli.io/practice/v2/authorization/token',
      headers: { 
        'cache-control': 'no-cache', 
        'Content-Type': 'application/json'
      },
      data : datatoken
    };
    var token = "";
    axios(configtoken)
    .then(function (response) {
      token = response.data.data.jwt;
    
      var config = {
        method: 'post',
        url: PAYMENT_GP_TOKEN_URL,
        headers: { 
          'id_organization': '1',//req.headers.id_organization, 
          'Authorization': token,//req.headers.authorization, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
        .then(function (response) {
          // console.log(req);
          res.send(response.data);
      })
      .catch(function (err) {
        var error = JSON.stringify({
            code: "HCO00014",
            msg: "An unexpected errors has happen"
        });
        res.send(error);
        console.log(err);
      });      
    })
    .catch(function (error) {
      // console.log(error);
    });
});
 
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`${appName} , escuchando en puerto: ${port}`));
