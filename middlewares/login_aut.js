const jwt = require("jsonwebtoken")

exports.log_obri = function(req, res,next){
    try {
        const token = req.headers.authorization.split(" ")[1]
        const token_decodificado = jwt.verify(token,"SidNey") 
        req.usuario = token_decodificado
        console.log(req.usuario)
        next()
    } catch (error) {
        return res.status(404).send("falha na autenticação")
    }
}