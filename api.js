const express = require("express")
const app = express()
const body = require("body-parser")
const router = require("./routers")
const corss = require("cors")
const cookieParser = require("cookie-parser")


app.use(corss())
app.use(cookieParser())
app.use(body.urlencoded({extended:false}))
app.use(body.json())

app.use(router)

app.listen(8088, function(){
    console.log("servidor rodando...")
})