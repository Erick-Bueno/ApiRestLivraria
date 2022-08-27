const bcrypt = require("bcrypt")
const mysql = require("mysql2")
const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    database:"teste",
    password: "sirlei231"
})
exports.cadasto_post =  async function(req, res){
    const {nome, senha, email} = req.body
    let senha_hash = await bcrypt.hash(senha,10)
    senha_hash = senha_hash.toString()
       function verificar_cadastro(){
        return new Promise((resolve, reject) => {
            con.query(`select * from cadastro where email ='${email}' `, function(error, results){
                if(error){
                    return reject(error)
                }return resolve(results)
            })
        })
       }verificar_cadastro().then(function(resultado){
        if(resultado.length > 0){
            res.status(500).send("usuario ja cadastrado")
        }
        else{
            function adicionar_cadastro(){
                return new Promise((resolve, reject) => {
                    con.query(`insert into cadastro(nome,senha,email) values ('${nome}', '${senha_hash}', '${email}')`, function(error, results){
                        if (error){
                            return reject(error)
        
                        }return resolve(results)
                    })
                })
            }adicionar_cadastro().then(function(resultado){
                const response = {
                    "mensagem":" cadastro adicionado com seucesso",
                    "nome": nome,
                    "senha": senha,
                    "email": email
                }
                res.send(response)
            }).catch(function(error){
                return res.status(500).send(error)
            })
        }
        

       })
       
   }