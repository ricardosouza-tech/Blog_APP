const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt =  require('bcryptjs');
const passport = require('passport');


router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) =>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail inválido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválido"})
    }
   
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
    }
    if(req.body.senha.length < 3){
        erros.push({texto:"Senha muito curta"})
    }


    //console.log(erros.length)
    if(erros.length > 0){
        
        res.render("usuarios/registro", {erros: erros})

    }else{
        
        Usuario.findOne({email: req.body.email}).then((usuario) => {
           if(usuario){
                req.flash("error_msg", "Ja existe uma conta com esse e-mail no sistema")
                res.redirect("/usuarios/registro")
            }else{
                const novoUsuario = new Usuario ({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                    if(erro){
                    req.flash("error_msg", "houve um erro durante o salvemento do usuario")
                          res.redirect("/")
                       } 
                       novoUsuario.senha = hash
                           
                       novoUsuario.save().then(() => {
                        req.flash("success_msg", "Usuario cadastrado com sucesso!")
                        res.redirect("/")

                       }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao cadastrar o usuario, tente novamente!")
                        res.redirect("/")
                       })
                    })

                })
                    
            }
        }).catch((err) => {
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/")
        })
    }



})

router.get("/login", (req, res) =>{
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})


router.get("/logout",(req, res) => {
    req.logOut()
    req.flash('success_msg', 'Deslogado com sucesso!')
    res.redirect("/")
})

module.exports = router