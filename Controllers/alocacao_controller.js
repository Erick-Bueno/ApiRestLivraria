const mysql = require("mysql2")
const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    database:"teste",
    password: "sirlei231"
})

exports.listarTodasAlocacoes =  async function(req, res){
    const sql = "select * from alocacao inner join livros on livros.id = alocacao.id_livro"
    function listar_pedidos_alocacoes(){
        return new Promise((resolve, reject) => {
            con.query(sql, function(error, results){
                if(error){
                    return reject(error)
                }return resolve(results)
            })
        })

    }
    try {
        const dados = await listar_pedidos_alocacoes()
        const response = {
               "mensagem":"lista de todos os pedidos de alocação",
               dados: dados.map(function(aloc){
                   return {
                       "id": aloc.id_alocacao,
                       "id_Livro": aloc.id_livro,
                       "nome_livro":aloc.Nome,
                       "quantidade": aloc.quantia,
                       "preço":aloc.Preço,
                       "request":{
                           "tipo": "GET",
                           "descrição": "listar alocação especifica",
                           "url": `http://localhost:8088/alocacao/${aloc.id_alocacao}`
                       }
                   }
               })
               
           }
           res.send(response)

    } catch (error) {
        res.send(error)
    }
   
  
    
}
exports.ListarAlocacaoEspecifica =  async function(req, res){
    const id = req.params.id
    const sql = `Select * from alocacao inner join livros on livros.id = alocacao.id_livro where id_alocacao = ${id}`
    function one_alocation(){
        return new Promise((resolve, reject) => {
            con.query(sql, function(error, results){
                if(error){
                    return reject(error)
                }return resolve(results)
            })
        })
    }
    try {
        const dados = await one_alocation()
    if(dados.length == 0){
        res.send("id não existe")
    }else{
        const response = {
            "Mensagem": "listando pedido de alocação especifico",
            dados: dados.map(function(conteudo){
                return{
                    "id": conteudo.id_alocacao,
                    "id_livro":conteudo.id_livro,
                    "nome_livro":conteudo.Nome,
                    "preço": conteudo.Preço,
                    "quantida":conteudo.quantia,
                    "request":{
                        "tipo":"GET",
                        "descrição": "listando todos os pedidos de alocação",
                        "URL": "http://localhost:8088/alocacao"
                    }
                }
            })
        }
        res.send(response)
    }
    
    } catch (error) {
        res.status(500).send(error)
    }
    
}
exports.AdicionarAlocacao = async function(req, res){
    const{id_livro, quantia} = req.body
    const sql = `Insert into alocacao (id_livro, quantia) values (${id_livro}, ${quantia})`
    function fazer_alocacao(){
        return new Promise((resolve, reject) => {
            con.query(sql, function(error,results){
                if(error){
                    return reject(error)
                }return resolve (results)
            })
        })
    }try {
        const dados = await fazer_alocacao()
        const response = {
            "mensagem":"alocação adicionada",
            "id_livro":id_livro,
            "quantia": quantia,
            "request":{
                "tipo":"GET",
                "descrição":"Retorno de todos os pedidos de alocação",
                "URL":"http://localhost:8088/alocação"
            }
        }
        res.send(response)
    } catch (error) {
        res.status(500).send("livro não encotrado no estoque")
    }
}
exports.DeletarAlocacao = function(req, res){
    const id = req.params.id
    const sql = `delete from alocacao where id_alocacao = ${id}`
    function deletar_alocacao(){
        return new Promise((resolve, reject) => {
            con.query(sql, function(error, results){
                if(error){
                    return reject(error)
                }return resolve(results)
            })
        })
    }deletar_alocacao().then(function(results){
        if(results['affectedRows'] == 0){
            res.send("id não existe")
            console.log(results)
        }else{
            console.log(results)
            const response = {
                "mensagem": "pedido de alocação deletado",
                "id": id,
                "request":{
                    "tipo": "GET",
                    "descrição": "Retorno de todos os pedidos de alocação",
                    "URL": "http://localhost:8088/alocacao"
                }
            }
            res.send(response)
        }
    }).catch(function(error){
        res.status(500).send(error)
    })
}
exports.atualizarAlocacao =  async function(req, res){
    const id = req.params.id
    const{id_livro, quantia} = req.body
    const sql = `update alocacao set id_livro = ${id_livro}, quantia = ${quantia} where id_alocacao = ${id} `
    function atualizar_pedido_alocacao(){
        return new Promise((resolve, reject) => {
            con.query(sql, function(error, results){
                if(error){
                    return reject(error)
                }return resolve(results)
            })
        })
    }function verificarrrr_id(){
        return new Promise((resolve, reject) => {
            con.query(`select * from alocacao where id_alocacao = ${id}`, function(error, results){
                if(error){
                    return reject(error)
                }return resolve(results)
            })
        })
    }try {
       const vericacao_id = await verificarrrr_id() 
       const atualizar_Pedido = await atualizar_pedido_alocacao()
       if(vericacao_id.length == 0){
        res.send("id não encontrado")
       }else{
        const response = {
            "Mensagem": "pedido de alocação atualizado",
            "id_livro": id_livro,
            "quantia": quantia,
            "request":{
                "tipo": "GET",
                "descrição": "retorno de um pedido de alocação especifico",
                "URL":`http://localhost:8088/alocacao/${id}`
            }
        }
        res.send(response)
       }
    } catch (error) {
        res.send({"mmmensagem": error})
    }
}