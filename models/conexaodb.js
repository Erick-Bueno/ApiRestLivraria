const sequelize = require("sequelize")
const banco = new sequelize("teste", "root", "sirlei231", {
    host:"localhost",
    dialect:"mysql"
})

module.exports = {
    sequelize: sequelize,
    banco: banco
}