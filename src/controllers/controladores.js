let { consultorio, medicos, consultas, consultasFinalizadas, laudos } = require('../db/bancodedados');
let { bodyValidatorMiddleware } = require('../middleware/bodyValidatorMiddleware')

const consultasMedicas = (req, res) => {
    const { cnes_consultorio, senha_consultorio } = req.query
    const validatePassword = senha_consultorio === "CubosHealth@2022";
    const validateCnes = cnes_consultorio === "1001";

    if (!validateCnes || !validatePassword) {
        return res.status(401).json({ mensagem: "Cnes ou senha inválidos!" })
    }
    return res.json(consultas);
}

let numeroConsulta = 1
const criarConsulta = (req, res) => {

    const cpfExistsQuery = consultas.some(item => item.paciente.cpf === req.body.cpf)
    if (cpfExistsQuery) {
        return res.status(400).json({ mensagem: "Já existe um cpf em consultas." })
    }
    const valorNumerico = consultas.some(item => item.valorConsulta === Number)
    if (!valorNumerico) {
        return res.status(400).json({ mensagem: "O valor da consulta está incorreto." })
    }
    const verificarEspecialidade = consultas.find(item => item.tipoConsulta === medicos.especialidade)
    if (!verificarEspecialidade) {
        return res.status(400).json({ mensagem: "Não há medico especifico no momento." })
    }

    const identicador = (numeroConsulta++).toString()
    const enterData = {
        identicador,
        identificadorMedico: verificarEspecialidade.identificadorMedico,
        finalizada: false,
        paciente: { ...req.body },
    };
    consultas.push(enterData);
    return res.status(201).json()
}

const atualizarPacientes = (req, res) => {

    const identificadorConsulta = req.params.identificadorConsulta
    const cpfInformado = req.body.cpf
    const emailInformado = req.body.email

    const consultaSelecionada = consultas.find((item) => item.identificador === identificadorConsulta);
    if (!consultaSelecionada) {
        //verifica se a consulta existe com base no identificador
        return res.status(400).json({ mensagem: "identificador invalido" })
    }

    if (!consultaSelecionada) {
        //verificar se a consulta não foi finalizada
        return res.json({ mensagem: "em espera de atendimento" })
    }


    if (cpfInformado) {
        const toCheckCpf = consultas.some(item => item.paciente.cpf == cpfInformado)
        if (!toCheckCpf) {
            return res.status(400).json({ mensagem: "Cpf não informado" })
        }
    }
    if (emailInformado) {
        const toCheckEmail = consultas.some(item => item.paciente.email === emailInformado)
        if (!toCheckEmail) {
            return res.status(400).json({ mensagem: "Não existe email cadastrado" })
        }
    }




    consultas = consultas.map(item => {
        if (item.identificador === identificadorConsulta) {
            const usuarioAtualizado = { ...consultaSelecionada.paciente, ...req.body }
            return { ...consultaSelecionada, paciente: { ...usuarioAtualizado } };
        }
        return item;
    })
    return res.status(204).json()


}

const deletarConsulta = (req, res) => {
    //deletar consulta
    const identificadorConsulta = Number(req.params.identificadorConsulta)

    const validarId = consultas.find((item) => item.identificador === identificadorConsulta)
    if (!validarId) {
        return res.status(400).json({ mensagem: "Identificador de consulta invalido" });
    }

    const indiceConsulta = consultas.findIndex((item) => item.identificador === identificadorConsulta)
    if (indiceConsulta === -1) {
        return res.status(404).json({ mensagem: "A consulta não foi encontrada" });
    }

    if (consultas[indiceConsulta].finalizada === true) {

        return res.status(400).json({ mensagem: "A consulta só pode ser removida se a mesma não estiver finalizada" })
    }
    consultas = consultas.filter((item) => item.identificador !== identificadorConsulta)
    console.log(consultas);
    return res.status(204).json();
}







module.exports = {
    consultasMedicas,
    criarConsulta,
    atualizarPacientes,
    deletarConsulta,
}