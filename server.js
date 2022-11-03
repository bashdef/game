// берём Express
let express = require('express');
const { dirname } = require('path');

// создаём Express-приложение
let app = express();
app.use('/', express.static(__dirname + '/'));

// создаём маршрут для главной страницы
// http://localhost:8080/
app.get('/', function(req, res) {
  res.sendfile('index.html');
});

// запускаем сервер на порту 8080
app.listen(8080);
// отправляем сообщение 
console.log('Сервер стартовал!');
console.log(__dirname);
 