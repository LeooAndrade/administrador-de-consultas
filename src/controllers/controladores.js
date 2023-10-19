let { consultorio, medicos, consultas, consultasFinalizadas, laudos } = require('../db/bancodedados');

const consultasMedicas = (req, res) => {
    const { cnes_consultorio, senha_consultorio } = req.query
    const validatePassword = senha_consultorio === "CubosHealth@2022";
    const validateCnes = cnes_consultorio === "1001";

    if (!validateCnes || !validatePassword) {
        return res.status(401).json({ mensagem: "Cnes ou senha inválidos!" })
    }
    return res.json(consultas);
}

module.exports = {
    consultasMedicas,
}