//Carregando Modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express()
    const mongoose = require('mongoose');
    const admin = require('./routes/admin');
    const path = require('path');

// Configurações
    // Body Parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');


    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp",{useNewUrlParser:true}).then(() => {
        console.log("Conectado ao MongoDB")  
    }).catch(() => {
        console.log("Erro ao se conectar ao MongoDB "+err)
    })



// Public
app.use(express.static(path.join(__dirname,'public')))



// Rotas
app.use('/admin', admin)


// Outros
const PORT = 8081
app.listen(PORT,() => {
    console.log('Servidor Rodando na porta  8081')
});





    
