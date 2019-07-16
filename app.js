//Carregando Modulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express()
    const mongoose = require('mongoose');
    const admin = require('./routes/admin');
    const path = require('path');
    const session = require('express-session');
    const flash = require('connect-flash');
    const favicon = require('express-favicon');
    //const favicon = require('serve-favicon');
    require("./models/Postagem");
    const Postagem = mongoose.model("postagens");
    require("./models/Categoria");
    const Categoria = mongoose.model("categorias");
    const usuarios = require("./routes/usuario");
    const passport = require('passport');
    require("./config/auth")(passport)



 



    // Configurações
    //Sessao
    app.use(session({
        secret:"cursodenode",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    //Middleware
    app.use((req, res, next) =>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;

        next()
    })

    // Body Parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');


    // Mongoose
    mongoose.Promise = global.Promise;
    //mongoose.connect("mongodb://localhost/blogapp",{useNewUrlParser:true}).then(() => {
        mongoose.connect('mongodb+srv://ricardo:123rvs@cluster0-9pbft.mongodb.net/test?retryWrites=true&w=majority', {
            userNewUrlParser: true,
             },
             console.log("Banco MongoDB conectado com sucesso")
           );
             
      //  console.log("Conectado ao MongoDB")  
    //}).catch(() => {
      //  console.log("Erro ao se conectar ao MongoDB "+err)
    //})



// Public
app.use(express.static(path.join(__dirname,'public')));




// Rotas
app.get('/', (req, res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("index", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/404")
    })
   
})

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((postagem) =>{
        
        if(postagem){
            res.render("postagem/index",{postagem: postagem})

        }else{
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect("/")

        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})

app.get("/categorias" , (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index", {categorias:categorias})
    }).catch((err) => {
        req.flash("error_msg" , "Houve um erro interno ao listar as categorias")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
       if (categoria){

            Postagem.find({categoria: categoria._id}).then((postagens) =>{
                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})


            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar os posts!")
                res.redirect("/")
            })

        }else{
            req.flash("error_msg", "Esta categoria não existe!")
            res.redirect("/")
        }
    }).catch((err) => {
        
        req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
        res.redirect("/")
    })
})




app.get("/404", (req, res) => {
    res.send("Erro 404!")
})

app.get('/posts', (req, res) => {
    res.send('lista Posts')
})

app.use('/admin', admin)
app.use("/usuarios",usuarios)

// Outros
const PORT = process.env.PORT || 8081
app.listen(PORT,() => {
    console.log('Servidor Rodando na porta  8081')
});





    
