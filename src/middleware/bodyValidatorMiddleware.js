let { consultas } = require("../db/bancodedados")

const bodyValidatorMiddleware = (req, res, next) => {
    //Atualizar dados de consulta medica
    // Verificar se foi passado todos os campos no body da requisição
    const { nome, cpf, dataNascimento, email, celular, senha } = req.body;

    const bodyArrayValues = [nome, cpf, dataNascimento, celular, email, senha];
    const hasBodyError = bodyArrayValues.some(item => item === null || item === undefined);

    if (hasBodyError) {
        return res.status(404).json({ message: 'Insira todos os campos corretamente' })
    }

    next();
};

module.exports = {
    bodyValidatorMiddleware,

};