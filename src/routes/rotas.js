const express = require('express');
const consultas = require('../controllers/controladores');
let { bodyValidatorMiddleware } = require('../middleware/bodyValidatorMiddleware');

const app = express();


app.get("/consultas", consultas.consultasMedicas);
//Esse end-point deverá listar todas as consultas médicas
app.post("/consultas", consultas.criarConsulta);
//Esse endpoint deverá criar uma consulta médica.
app.put("/consulta/:identificadorConsulta/paciente", bodyValidatorMiddleware, consultas.atualizarPacientes)
//Esse endpoint deverá atualizar apenas os dados do paciente.
app.delete("/consulta/:identificadorConsulta", consultas.deletarConsulta)
//Esse endpoint deve excluir uma consulta médica existente.
app.post("/consulta/finalizar", consultas.finalizarConsultaMedica)
//Esse endpoint deverá finalizar uma consulta com um texto de laudo válido do médico e registrar esse laudo e essa consulta finalizada.
app.get("/consulta/laudo", consultas.listarLaudos)
//Esse endpoint deverá retornar informações do laudo de uma consulta.
app.get("/consultas/medico", consultas.consultasAtendidasMedico)
//Esse endpoint deverá retornar todas as consultas que um profissiona atendeu.
module.exports = app