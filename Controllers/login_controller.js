const bcrypt = require("bcrypt")
const mysql = require("mysql2")
const jwt = require("jsonwebtoken")
const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    database:"teste",
    password: "sirlei231"
})
exports.logandu = function(req, res){
    const {email, senha} = req.body
    function verifica_email(){
        return new Promise((resolve, reject) => {
            con.query(`select * from cadastro where email = '${email}'`,function(erro, results){
                if(erro){
                    return reject(erro)
                }return resolve(results)
            })
        })
    }verifica_email().then(function(resultado){
        if(resultado.length == 0){
            return res.status(404).send("usuario não autenticado")
        }
        else{
            function verificar_senha(){
                return new Promise((resolve, reject) => {
                    con.query(`select senha from cadastro where email = '${email}'`,function(erro, resultados){
                        if(erro){
                            return reject(erro)
                        }return resolve(resultados)
                    })
                })
            }
            verificar_senha().then(function(resultado){
                bcrypt.compare(senha, resultado[0].senha, function(erro, result){
                    if(erro){
                        return res.status(500).send(erro)
                    }else{
                        if(result == true){
                          function dados(){
                            return new Promise((resolve, reject) => {
                                con.query(`select id from cadastro where email = '${email}'`, function(error, results){
                                    if(error){
                                        return reject(error)
                                    }return resolve(results)
                                })
                            })
                          }dados().then(function(resultadu){
                            const token = jwt.sign({
                                "id": resultadu[0].id,
                                "email": email,
                            },"SidNey",{
                                expiresIn:"2h"
                            })
                            res.cookie('token',token,{maxAge:900000 , httpOnly: true})
                            return res.status(200).send({
                                "mensagem":"usuario autenticado",
                                "token": token
                            })
                            
                            
                          }).catch(function(error){
                            return res.status(404).send("erro")
                          })
                            
                          
                        }else{
                            return res.status(404).send("usuario não autenticado")
                        }
                    }
                })
            })
        }
    }).catch(function(error){
        return res.status(500).send(error)
    })
}
