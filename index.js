const express = require("express");
const cors = require('cors');
const services = require('./service');
const bodyParser = require('body-parser');
const app = express();


const allowedOrigins = [
    'capacitor://localhost',
    'capacitor-electron://*',
    'capacitor-electron://-',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://localhost:9876'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
  };


// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/today', cors(corsOptions), async function (req, res) {
    const info = await services.bitCointToday();

    let body = {
        status: 500,
        data: [],
        message: 'Error.',
        date: ''
    }

    if(info.data.data == undefined){
        body = {
            status: 404,
            data: [],
            message: 'Servicio sin funcionar.',
            date: info.date
        }
    }else{
        body = {
            status: 200,
            data: info.data.data,
            message: 'Resultado cargado correctamente.',
            date: info.date
        }
    }
    
  res.send(body);
});
app.get('/lastFifteenDays', cors(corsOptions), async function (req, res) {
    const info = await services.bitCointLast15Days();
    let body = {
        data: [],
        message: 'Error',
        status: 500
    }
    
    if(info.length > 0){
        body = {
            data: info,
            message: 'Resultados cargados últimos 15 días',
            status: 200
        }
    }else{
        body = {
            data: [],
            message: 'No se pudo cargar los resultados de los últimos 15 días',
            status: 404
        }
    }
    
  res.send(body);
});


app.post('/bydate', cors(corsOptions), async function (req, res) {
    const info = await services.bitCointByDate(req.body.item);

    let body = {
        status: 200,
        data: info,
        message: 'Resultados cargados para la fecha: '+req.body.item,
        date: req.body.item
    }
    
  res.send(body);
});

app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});