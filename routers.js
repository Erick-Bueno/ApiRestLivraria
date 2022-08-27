const { response } = require("express")
const express = require("express")
const router = express.Router()
const mysql = require("mysql2")
const controller = require("./Controllers/livros_controller")
const controller2 = require("./Controllers/alocacao_controller")
const bcrypt = require("bcrypt")
const cadasto = require("./Controllers/cadastro_controller")
const jwt = require("jsonwebtoken")
const login = require("./middlewares/login_aut")
const logando = require("./Controllers/login_controller")


//mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    database:"teste",
    password: "sirlei231"
})

//rota produtos
//listar todos os livros

router.get("/livros",login.log_obri,controller.GetLivros)
//listar livro especifico
router.get("/livros/:id", controller.GetLivroespecifico)

//deletar um livro
router.delete("/livros/:id",login.log_obri, controller.DeletarLivro)
//adicionando livro
router.post("/livros",login.log_obri, controller.AdicionarLivro)

//atualizando livros
router.put("/livros/:id",login.log_obri, controller.AtualizarLivro)
    
    
//rotas de alocação

//listar alocações
router.get("/alocacao", controller2.listarTodasAlocacoes)

//listar alocação especifica
router.get("/alocacao/:id", controller2.ListarAlocacaoEspecifica)

//adicionar alocação
router.post("/alocacao",login.log_obri, controller2.AdicionarAlocacao)
//deletar alocacao
router.delete("/alocacao/:id", login.log_obri,controller2.DeletarAlocacao)
//atualizar pedido de alocação
router.put("/alocacao/:id",login.log_obri, controller2.atualizarAlocacao)

//cadastro
router.post("/cadastro",login.log_obri, cadasto.cadasto_post)

//login
router.post("/login",logando.logandu)

module.exports = router