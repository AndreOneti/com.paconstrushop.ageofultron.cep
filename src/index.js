'use strict';

const express = require('express');

const app = express();

// Carrega as Rotas
const indexRoute = require('./routes/index-route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilita o CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use('/', indexRoute);

module.exports = app;