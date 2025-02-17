/* import cors from 'cors'; */
import express from 'express';
import { retornaCampeonatos, retornaCampeonatosAno, retornaCampeonatosID, retornaCampeonatosTime } from './servicos/retornaCapeonatos_servico.js';
/* import pool from './servicos/conexao.js'; */
import { cadastraCampeonato } from "./servicos/cadastroCampeonato_servico.js";
import { atualizaCampeonato, atualizaParcela } from './servicos/atualizaCampeonato_servico.js';
import { deletaCampeonato } from "./servicos/deletaCAmpeonatos_servicos.js";

const app = express();
/* app.use(cors()); */
app.use(express.json());

app.delete('/campeonatos/:id', async (req, res) => {
    const {id} = req.params;
    const resultado = await deletaCampeonato(id);

    if (resultado.affectedRows > 0) {
        res.status(202).send('Registro deetado com sucesso!')
    } else {
        res.status(404).send('Registro não encontrado, informe o id correto');
    }
})

app.patch('/campeonatos/:id', async (req, res) => {
    const { id } = req.params;
    const { campeao, vice, ano } = req.body;

    const camposAtualizar = {};
    if (campeao) camposAtualizar.campeao = campeao;
    if (vice) camposAtualizar.vice = vice;
    if (ano) camposAtualizar.ano = ano;

    if (Object.keys(camposAtualizar).length === 0) {
        res.status(400).send("Nenhum campo válido foi enviado para a atualização")
    } else {
        const resultado = await atualizaParcela(id, camposAtualizar)
        if (resultado.affectedRows > 0) {
            res.status(202).send('REgistro atualizado com sucess')
        } else {
            res.status(404).send('Registro não encontrado')
        }

    }
})


app.put('/campeonatos/:id', async (req, res) => {
    const { id } = req.params;
    const { campeao, vice, ano } = req.body;

    if (campeao == undefined || vice == undefined || ano == undefined /* undefined in (campeao, vice, ano) */) {
        res.status(400).send('Nem todos os campos foram preenchidos')
    } else {
        const resultado = await atualizaCampeonato(id, campeao, vice, ano);
        if (resultado.affectedRows > 0) {
            res.status(202).send('atualizado com sucesso!')
        } else {
            res.status(400).send('Registro não encontrado')
        }
    }
});

app.post("/camponatos", async (req, res) => {

    const campeao = req.body.campeao;
    const vice = req.body.vice;
    const ano = req.body.ano;

    await cadastraCampeonato(campeao, vice, ano);
    res.status(204).send({ mensagem: "Cadastro registrado com sucesso" });
});

app.get('/campeonatos', async (req, res) => {
    let campeonatos;

    const ano = req.query.ano;
    const time = req.query.time;

    if (typeof ano === 'undefined' && typeof time === 'undefined') {
        campeonatos = await retornaCampeonatos();
    }
    else if (typeof ano !== 'undefined') {
        campeonatos = await retornaCampeonatosAno(ano);
    }
    else if (typeof time !== 'undefined') {
        campeonatos = await retornaCampeonatosTime(time);
    }

    if (campeonatos.length > 0) {
        res.json(campeonatos);
    } else {
        res.status(404).json({ mensagem: "nenhum campeonato encontrado" });
    }
})

app.get('/campeonatos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const campeonato = await retornaCampeonatosID(id);
    if (campeonato.length > 0) {
        res.json(campeonato);
    } else {
        res.status(404).json({ mensagem: "Nenhum campeonato encontrado" });
    }
});

app.listen(9000, async () => {
    const data = new Date();
    console.log("Servidor node iniciado em: " + data);

    /*     const conexao = await pool.getConnection();
    
        console.log(conexao.threadId);
    
        conexao.release(); */
});


/* NPM INSTALL CORS (portas globais )*/
/* esteriniografia */