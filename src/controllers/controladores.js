let { consultorio, medicos, consultas, consultasFinalizadas, laudos, } = require('../db/bancodedados');
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

let numberConsultation = 1
const criarConsulta = (req, res) => {
    const { tipoConsulta, valorConsulta, paciente } = req.body
    const { nome, cpf, dataNascimento, email, celular, senha } = paciente

    if (!tipoConsulta || !valorConsulta || !nome || !cpf || !dataNascimento || !email || !celular || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os dados!" })
    }

    const cpfExistsQuery = consultas.some(item => item.paciente.cpf === req.body.paciente.cpf)
    if (cpfExistsQuery) {
        return res.status(400).json({ mensagem: "Já existe uma consulta em andamento com o cpf informado!" })
    }
    if (typeof valorConsulta !== "number") {
        return res.status(400).json({ mensagem: "O valor da consulta está incorreto." })
    }
    const checkSpecialty = consultorio.medicos.find(item => item.especialidade === req.body.tipoConsulta);
    if (!checkSpecialty) {
        return res.status(400).json({ mensagem: "Não há medico especifico no momento." })
    }


    const identificador = (numberConsultation++)
    const newConsultation = {
        identificador,
        tipoConsulta,
        identificadorMedico: checkSpecialty.identificador,
        finalizada: false,
        valorConsulta,
        paciente: {
            nome,
            cpf,
            dataNascimento,
            email,
            celular,
            senha
        }

    };

    consultas.push(newConsultation);
    return res.status(200).json(consultas)
}

const atualizarPacientes = (req, res) => {
    const identificadorConsulta = Number(req.params.identificadorConsulta)

    const findConsultation = consultas.find(item => item.identificador == req.params.identificadorConsulta)
    if (!findConsultation) {
        return res.status(400).json({ mensagem: "Essa consulta não existe!" })
    }
    const consultationFinished = consultas.filter(item => item.identificador == req.params.identificadorConsulta && item.finalizada)
    if (consultationFinished.length > 0) {
        return res.status(400).json({ mensagem: "Consultas finalizadas não podem ser atualizadas!" })
    }

    const checkCpf = consultas.filter(item => item.paciente.cpf == req.body.cpf && !item.finalizada)
    if (checkCpf.length > 0) {
        return res.status(400).json({ mensagem: "Já existe uma consulta em aberto para este CPF!" })
    }

    const checkEmail = consultas.filter(item => item.paciente.email == req.body.email && !item.finalizada)
    if (checkEmail.length > 0) {
        return res.status(400).json({ mesnagem: "Já existe uma consulta em aberto para este e-mail!" })
    }

    consultas = consultas.map(item => {
        if (item.identificador === identificadorConsulta) {
            const usuarioAtualizado = { ...findConsultation.paciente, ...req.body }
            return { ...findConsultation, paciente: { ...usuarioAtualizado } };
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
    return res.status(204).json();
}

const finalizarConsultaMedica = (req, res) => {
    const { identificadorConsulta, textoMedico } = req.body
    if (!identificadorConsulta || !textoMedico) {
        return res.status(400).json({ mensagem: "Preencha todos os dados corretamente!" })
    }

    const consulta = consultas.find((item) => item.identificador === identificadorConsulta)
    if (!consulta) {
        return res.status(400).json({ mensagem: "Consulta não encontrada" })
    }
    if (consulta.finalizada === true) {
        return res.status(400).json({ mensagem: "Sua consulta já foi finalizada!" })
    }
    if (!textoMedico.length > 0 && !textoMedico.length <= 200) {
        return res.status({ mensagem: "O tamanho do textoMedico não está dentro do esperado" });
    }
    consulta.finalizada = true

    consultasFinalizadas.push(consulta)
    return res.status(204).json();
}

const listarLaudos = (req, res) => {
    const { identificador_consulta, senha } = req.query

    if (!identificador_consulta || !senha) {
        return res.status(400).json({ mensagem: "Verifique seus dados e tente novamente!" })
    }

    const checkQuery = consultas.find(item => +item.identificador === +identificador_consulta)
    if (!checkQuery) {
        return res.status(400).json({ mensagem: "Consulta médica não encontrada!" })
    }
    const checkPassword = consultas.find(item => item.paciente.senha === senha)
    if (!checkPassword) {
        return res.status(400).json({ mensagem: "Senha incorreta, verifique sua senha e tente novamente!" })
    }

    const checkReport = laudos.filter(item => item.identificadorConsulta === identificador_consulta)
    if (!checkReport) {
        return res.satus(400).json({ mensagem: "Está consulta ainda não possui um laudo medico!" })

    }

    return res.status(200).json(laudos)
}



const consultasAtendidasMedico = (req, res) => {
    const { identificador_medico } = req.query

    if (!identificador_medico) {
        return res.status(400).json({ mensagem: "Informe o identificador medico!" })
    }
    const medicoExiste = consultorio.medicos.find(item => +item.identificador === +identificador_medico)
    if (!medicoExiste) {
        return res.status(400).json({ mensagem: "O médico informado não existe na base!" })
    }

    const consultasDoMedico = consultasFinalizadas.filter((consulta) => +consulta.identificadorMedico === +identificador_medico);

    return res.status(200).json(consultasDoMedico);

}



module.exports = {
    consultasMedicas,
    criarConsulta,
    atualizarPacientes,
    deletarConsulta,
    finalizarConsultaMedica,
    listarLaudos,
    consultasAtendidasMedico
}