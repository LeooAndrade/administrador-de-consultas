const express = require('express');
const routers = require('./routes/rotas');
const app = express();

app.use(express.json());
app.use(routers)

app.listen(3000);