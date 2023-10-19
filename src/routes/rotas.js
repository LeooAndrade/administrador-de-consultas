const express = require('express');
const consultas = require('../controllers/controladores')
const app = express();


app.get('/consultas', consultas.consultasMedicas)
//Esse end-point deverá listar todas as consultas médicas







module.exports = app