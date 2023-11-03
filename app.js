/////////////////////////////////////////////////////////////////////////////////////////////
//                               SERVIDOR EM NODE.JS                                       //
//                      Programado por Joao Victor Segantini.                              //
//                                 		                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////

// Variaveis globais.
var warning = "";


// requires
const express = require("express");
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const bodyparser = require('body-parser');
const crypt = require('bcrypt');

// HTML Request scheduler
const app = express();

// DB Module
const conn = require('./exports/db');

// Apontamento de pastas a serem usadas pelo NODE.
app.use(express.json());
app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public/fonts')));
app.use(express.static(path.join(__dirname, '/public/js')));
app.use(express.static(path.join(__dirname, '/public/imgs')));
app.use(express.static(path.join(__dirname, '/public/_files')));
app.use(express.static(path.join(__dirname, '/public/pointers')));

// Sessão
app.use(
    session({
      secret: 'sdjfhlwkehflhfhfhfuwehifghsidhifhezdfvsdf', // Deve ser mantida em segredo
      resave: false,
      saveUninitialized: true,
    })
  );

// Multer configuration for profile saving.
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/_files/photos/');// Diretorio para salvar as imagens    
    },
    filename: (req, file, callBack) => {// Nome do arquivo.
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage
});

/////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////
//////////                              PAGE REQUESTS                            ////////////
/////////////////////////////////////////////////////////////////////////////////////////////
// Redirecionando o dominio para a pagina certa
app.get("/",(req,res)=>{
    if (req.session.loggedin) {
        res.redirect("/Home");
    } else {
        res.redirect("/Login");
    }
});

// Login
app.get("/Login",(req,res)=>{
    if(!req.session.loggedin)res.render(path.join(__dirname + '/public/pointers/login.ejs'),{msg: warning});
    else res.redirect("/Home");
});

// Register
app.get("/Register",(req,res)=>{
    // Month obj
    var months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro",
    "Outubro", "Novembro", "Dezembro"];

    if(!req.session.loggedin)res.render(path.join(__dirname + '/public/pointers/signup.ejs'), {result: months, msg: warning });
    else res.redirect("/Login");
});

// Home
app.get("/Home",(req,res)=>{
    if (req.session.loggedin) {

        // Pegando as informações da db
        conn.query("SELECT * FROM accounts WHERE email=?",[req.session.email],async (error,results,fields)=>{
            if(error) throw error;
            if(results.length > 0)
            {
                res.render(path.join(__dirname + '/public/pointers/social/home.ejs'),{db: results});
            }
        });
    } else {
        res.redirect("/Login");
    }
});

// Logout
app.get('/Logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
      }
      res.redirect('/Login');
    });
  });
  

//404
app.get("/404",(req,res)=>{
    res.render(path.join(__dirname + '/public/pointers/404.ejs'));
});
/////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////
//////////                              POSTING FORMS                            ////////////
/////////////////////////////////////////////////////////////////////////////////////////////
app.post("/Login",(req,res)=>{
    // Pegando e-mail e senha
    var email = req.body.email;
    var senha = req.body.password;
    const cb = req.body.cb;

    // Validando na DB
    if((email.length >= 7 && senha.length >= 6) && (email.length <= 60 && senha.length <= 20)){
        conn.query("SELECT * FROM accounts WHERE email=?",[email,senha],async (error,results,fields)=>{
            if(error) throw error;// Retorna erro.
            if(results.length > 0){
                // Crypt encripta a senha bruta, e compara a hash com o do banco.
                if (await crypt.compare(senha, results[0].password))
                {
                    // Cookies
                    req.session.loggedin = true;
                    req.session.email = results[0].email;

                    if(cb) {req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;}

                    res.redirect("/Home");
                } else {
                    warning = "A senha digitada não corresponde com a senha cadastrada.";
                    res.redirect("/Login");
                } 
            } else {
                warning = "Não existe uma conta cadastrada com este e-mail.";
                res.redirect("/Login");
            }
        });
    }else{
        warning = "E-mail ou senha invalidos.";
        res.redirect("/Login");
    }
});

//Register
app.post("/doRegister",(req,res)=>{
    // Pegando as informações
    var name = req.body.name;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var confirm = req.body.passwordc;
    var radios = req.body.radios;
    var days = req.body.days;
    var months = req.body.Months;
    var year = req.body.year;

    // Verifica se não existe nenhum email igual no banco.
    if(password === confirm && password.length <= 20)
    {
        if(name.length > 0 && lastname.length > 0 && email.length > 10)
        {
            if(days != 0 && months != "" && year != 0)
            {
                conn.query("SELECT * FROM accounts WHERE email=?",[email],async (error,results,fields)=>{
                    if(error) throw error;
                    if(results.length > 0)
                    {
                        //Se tiver um email, retorna mensagem pra pagina de registro
                        warning = "Já existe este e-mail cadastrado em nosso sistema!";
                        res.redirect("/Register");
                    }
                    else
                    {
                        // Se não tem, pode criar a conta.
                        // Ids randomicos para cada perfil de usuario.
                        var profile_id = Math.floor(Math.pow(10, 10-1) + Math.random() * 9 * Math.pow(10, 10-1));

                        // Aplicando hash na senha e gravando no banco.
                        await crypt.hash(password, 10, (error, hash)=>{
                            if(error) throw error;
                            conn.query("INSERT INTO accounts (profile_id, first_name, last_name, email, password, gender, birth_day, birth_month, birth_year, photo)"
                            + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",[profile_id, name, lastname, email, hash, radios, days, months, year, '/photos/default_photo.png'],(error,results,fields)=>{
                                if(error) throw error;
                                if(results.affectedRows > 0){ erro = ""; res.redirect("/Home"); }
                                else { erro = "Não foi possivel fazer o cadastro, entre em contato com o suporte."; res.redirect("/Register"); }
                            });
                        });
                    }
                });
            } else { warning = "Você não preencheu a sua data de nascimento."; res.redirect("/Register"); }
        } else { warning = "Você deixou campos sem preencher, volte e preencha os campos."; res.redirect("/Register"); }
    } else { warning = "As senhas que você digitou não são iguai sou sua senha é muito grande."; res.redirect("/Register");}
});

/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////   404 Page   /////////////////////////////////////
app.use((req, res, next)=>{ res.redirect("/404"); });
////////////////////////////////////////////////////////////////////////////////////////////

///////////////////   seta a porta e ip(opicional para local host) do app   /////////////////
app.listen(3000);                             ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////