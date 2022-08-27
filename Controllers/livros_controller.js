const { response } = require("express")
const mysql = require("mysql2")
const login = require("../middlewares/login_aut")
const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    database:"teste",
    password: "sirlei231"
})
exports.GetLivros =  async function(req, res){
    try {
        function select_all(){
            return new Promise((resolve, reject) => {
                con.query('select * from livros', function(error, results){
                    if(error){
                        return reject(error)
                    }return(resolve(results))
                    
                })
            })
        }
      const dadoss = await select_all()
      const resposta = {
        'messagem':"Listando todos os livros",
        dados: dadoss.map(function(liv){
            return{
                'id': liv.id,
                'nome':liv.Nome,
                'autor': liv.Autor,
                'preço':liv.Preço,
                request:{
                    'tipo': 'GET',
                    'descrição':'Retorno de livro especifico',
                    'URL': `http://localhost:8088/livros/${liv.id}`
                }
                
            }
        })
      }
      res.send(resposta)
    } catch (error) {
        res.status(404)
    }
}

exports.GetLivroespecifico = async function(req, res){
    try {
        const id = req.params.id
        function select_one(){
            return new Promise((resolve, reject) => {
                con.query(`select Nome, Autor, Preço from livros where id =${id} `,function(error,results){
                    if(error){
                        return reject(error)
                    }return resolve(results)
                })
               
            })
        }const dadoss = await select_one()
        if(dadoss.length == 0){
            return res.status(200).send("livro não encontrado")
        }else{
            const resposta = {
                'mensagem': 'Listando livro especifico',
                 dados: dadoss.map(function(liv){
                    return{
                        'id': id,
                        'nome': liv.Nome,
                        'autor':liv.Autor,
                        'preço':liv.preço,
                        'request':{
                            'tipo': "GET",
                            'descrição': "Retorno de todos os livros",
                            'Url':'http://localhost:8088/livros'
                        }
                    }
                 })
                 
            }
           res.status(200).send(resposta)
        }
        
    }catch (error) {
    res.status(400).send({'erro': "livro não encontrado"})
}
}
exports.DeletarLivro = async function(req, res){
    try{
        const id = req.params.id
        function delete_book(){
            return new Promise((resolve, reject) => {
                const sql = `delete from livros where id = ${id}`
                con.query(sql, function(error,results){
                    if(error){
                        return reject(error)
                    }return resolve(results)
                })
             
            })
        }
        
        const dados = await delete_book()
        if(dados.length == 0){
            res.status(500).send("Id não existe")
        }else{
            const dadoss = {
                'mensagem':'livro deletado',
                'request':{
                    'tipo': "POST",
                    'descrição': "adicionar novo livro",
                    'Url': "http://localhost:8088/livros"
                }
            }
            res.status(200).send(dadoss)
        }
       
    
    }catch(error){
        res.send(error)
    }
    }
    exports.AdicionarLivro =  async function(req, res){
        try {
            const {nome,autor, codigo,preço } = req.body
            function add_livro(){
                return new Promise((resolve, reject) => {
                    const sql = `insert into livros (Nome, Autor, Codigo, Preço) Values('${nome}', '${autor}', ${codigo}, ${preço})`
                con.query(sql, function(error, result){
                    if(error){
                        return reject(error)
                    }return resolve(result)
                })
                })
            }const add = await add_livro()
            const dadoos = {
                "mensagem":"livro adicionado",
                "nome": nome,
                "autor": autor,
                "codigo":codigo,
                "preço":preço,
                "request":{
                    "tipo": "GET",
                    "descrição": "retorno de todos os livros",
                    "url": "http://localhost:8088/livros"
                }
    
            }
            res.send(
                dadoos
            )
            
        } catch (error) {
            return res.status(500).send(error)
            
        }
       
    }
    exports.AtualizarLivro =  async function(req, res){
        const id = req.params.id
        const { nome, autor, codigo, preço } = req.body
        const sql = `Update livros set Nome = '${nome}',Autor = '${autor}', Codigo = ${codigo}, Preço = ${preço} where id = ${id}`
        function atualizar_livro(){
            return new Promise((resolve, reject) => {
                con.query(sql, function(error,results){
                    if(error){
                        return reject(error)
                    }return resolve(results)
                })
            })
        }function verificar_id(){
            return new Promise((resolve, reject) => {
                con.query(`select * from livros where id = ${id}`,function(error, results){
                    if(error){
                        return reject(error)
                    }return resolve(results)
                })
            })
        }
        try {
            const daddos = await verificar_id()
            const dados = await atualizar_livro()
            if(daddos.length == 0){
                res.send("id não encontrado")
            }else{
                const response = {
                    "mensagem": "livro atualizado",
                    "id": id,
                    "nome": nome,
                    "autor":autor,
                    "preço": preço,
                    "codigo": codigo,
                    "request":{
                        "tipo": "GET",
                        "descrição": "Retorno de livro especifico",
                        "URL": `http://localhost:8088/livros/${id}`
                    }
    
                }
                res.send(response)
            }
        } catch (error) {
            res.send({"erro":error})
        }
       
       
    }