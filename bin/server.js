const app = require('../src/index');
const http = require('http');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
console.log('API rodando em http://localhost:' + port);
