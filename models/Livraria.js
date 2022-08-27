const db = require("./conexaodb")

const Livro = db.banco.define("livros", {
    Nome:{
        type: db.sequelize.STRING
    },
    Autor:{
        type: db.sequelize.STRING
    },
    Codigo:{
        type: db.sequelize.INTEGER
    },
    Preço:{
        type: db.sequelize.DECIMAL(10,2)
    }
})
