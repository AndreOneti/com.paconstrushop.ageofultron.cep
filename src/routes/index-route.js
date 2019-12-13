'use strict';

const express = require('express');
const router = express.Router();

const correio = require('../app');

router.post('/', (req, res, next) => {
  if (req.body.servico) {
    let { servico, pesoMin, pesoMax, estado } = req.body;
    correio(servico, pesoMin, pesoMax, estado);
    res.status(200).send({
      message: "Procesando em background"
    });
  } else {
    res.status(404).send({
      message: "Body missing"
    });
  }
});

module.exports = router;