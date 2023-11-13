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
const fs = require('fs');
const mime = require('mime-types');

// HTML Request scheduler
const app = express();

// DB Module
const conn = require('./exports/db');
const { exit } = require("process");

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
app.use(express.static(path.join(__dirname, '/public/ckeditor')));

// Sessão
app.use(
    session({
      secret: 'sdjfhlwkehflhfhfhfuwehifghsidhifhezdfvsdf', // Chave
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // Tempo de expiração em milissegundos (1 dia).
        secure: false, // Definir como true se estiver usando HTTPS
        httpOnly: true, // Impede acesso ao cookie via JavaScript no navegador
      }
    })
  );

// Multer guardando imagem e video de posts
const storageIMGSAndVideos = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('./public/_files/post_content/' + req.session.profile_id + '/')) {
            fs.mkdirSync('./public/_files/post_content/' + req.session.profile_id + '/');
        }
        else callBack(null, './public/_files/post_content/' + req.session.profile_id + '/');// Diretorio para salvar as imagens de post
    },
    filename: (req, file, callBack) => {callBack(null, 'File -' + Date.now() + path.extname(file.originalname));}
});

// Multer guardando imagem de perfil
const storageProfileIMGS = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('./public/_files/photos/' + req.session.profile_id + '/')) {
            fs.mkdirSync('./public/_files/photos/' + req.session.profile_id + '/');
        }
        else callBack(null, './public/_files/photos/' + req.session.profile_id + '/');// Diretorio para salvar as imagens de perfil  
    },
    filename: (req, file, callBack) => {callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));}
});

/////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////
//////////                              PAGE REQUESTS                            ////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// Redirecionando o dominio principal para a pagina certa
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
    // Objeto gardando nome dos meses
    var months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro",
    "Outubro", "Novembro", "Dezembro"];

    // 
    if(!req.session.loggedin)res.render(path.join(__dirname + '/public/pointers/signup.ejs'), {result: months, msg: warning });
    else res.redirect("/Login");
});

// Home
app.get("/Home",(req,res)=>{
    if (req.session.loggedin) {

        // Pegando as informações da db
        conn.query("SELECT * FROM accounts WHERE email=?",[req.session.email],(error,results)=>{
            if(error) throw error;
            if(results.length > 0)
            {
                // tem q pegar um filtro baseados nos amigos q ele tem. (exibindo posts globais por enquanto).
                conn.query("SELECT * FROM feed_posts ORDER BY `date` DESC;",(error, datas)=>{
                    if(error)throw error;
                    if(datas.length > 0)
                    {
                        // inserindo o post na tabela de likes para novos usuários que não estejam na tabela
                        conn.query("SELECT * FROM accounts;", (error, alll) => {
                            if (error) throw error;
                            if (alll.length > 0)
                            {
                                for (var i = 0; i < datas.length; i++)
                                {
                                    for (var a = 0; a < alll.length; a++)
                                    {
                                        const postID = datas[i].postID;
                                        const user_id = alll[a].profile_id;

                                        // Verifica se não existe registros iguais antes de inserir
                                        conn.query("SELECT * FROM post_comments_liked WHERE postID = ? AND user_id = ?", [postID, user_id], (error, results) => {
                                            if (error) return res.status(400).send("Erro na consulta.");
                                            if (results.length === 0)
                                            {
                                                // Não existe registro igual, então insira
                                                conn.query("INSERT INTO post_comments_liked (postID, user_id, liked) VALUES (?, ?, 0);",
                                                [postID, user_id], (error) => {
                                                    if (error) return res.status(400).send("Erro ao inserir o registro.");
                                                });
                                            }
                                        });
                                    }
                                }
                            }
                        });

                        conn.query("SELECT * FROM post_comments ORDER BY posted_when;",(error, comments)=>{
                            if(error) throw error;
                            if(comments.length > 0)
                            {
                                conn.query("SELECT * FROM post_media;",(error, photos)=>{
                                    if(error) throw error;
                                    if(photos.length > 0)
                                    {
                                        conn.query("SELECT * FROM post_comments_liked;", (error, liked)=>{
                                            if(error) throw error;
                                            if(liked.length > 0)
                                            {
                                                res.render(path.join(__dirname + '/public/pointers/social/home.ejs'),{db: results, posts: datas, no_posts: false, msg: warning, pComments: comments, isliked: liked, imgs: photos});
                                                warning = "";
                                            }
                                            else
                                            {
                                                res.render(path.join(__dirname + '/public/pointers/social/home.ejs'),{db: results, posts: datas, no_posts: false, msg: warning, pComments: comments, isliked: liked, imgs: photos});
                                                warning = "";
                                            }
                                        });
                                    }
                                    else 
                                    {
                                        res.render(path.join(__dirname + '/public/pointers/social/home.ejs'),{db: results, posts: datas, no_posts: false, msg: warning, pComments: comments, imgs: photos, isliked: liked});
                                        warning = "";
                                    }
                                });
                            }
                            else
                            {
                                conn.query("SELECT * FROM post_media;",(error, photos)=>{
                                    if(error) throw error;
                                    if(photos.length > 0)
                                    {
                                        conn.query("SELECT * FROM post_comments_liked;", [req.session.profile_id],(error, liked)=>{
                                            if(error) throw error;
                                            if(liked.length > 0)
                                            {
                                                res.render(path.join(__dirname + '/public/pointers/social/home.ejs'),{db: results, posts: datas, no_posts: false, msg: warning, pComments: comments, isliked: liked, imgs: photos});
                                                warning = "";
                                            }
                                            else
                                            {
                                                res.render(path.join(__dirname + '/public/pointers/social/home.ejs'),{db: results, posts: datas, no_posts: false, msg: warning, pComments: comments, isliked: liked, imgs: photos});
                                                warning = "";
                                            }
                                        });
                                    }
                                    else 
                                    {
                                        res.render(path.join(__dirname + '/public/pointers/social/home.ejs'),{db: results, posts: datas, no_posts: false, msg: warning, pComments: comments, imgs: photos});
                                        warning = "";
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        // inserindo o post na tabela de likes pra novos usuarios que nao estejam na tabela.
                        conn.query("SELECT * FROM accounts;", (error, alll) => {
                            if (error) throw error;
                            if (alll.length > 0)
                            {
                                for (var i = 0; i < datas.length; i++)
                                {
                                    for (var a = 0; a < alll.length; a++)
                                    {
                                        const postID = datas[i].postID;
                                        const user_id = alll[a].profile_id;

                                        // Verifica se não existe registros iguais antes de inserir
                                        conn.query("SELECT * FROM post_comments_liked WHERE postID = ? AND user_id = ?", [postID, user_id], (error, results) => {
                                            if (error) return res.status(400).send("Erro na consulta.");
                                            if (results.length === 0)
                                            {
                                                // Não existe registro igual, então insira
                                                conn.query("INSERT INTO post_comments_liked (postID, user_id, liked) VALUES (?, ?, 0);",
                                                [postID, user_id], (error) => {
                                                    if (error) return res.status(400).send("Erro ao inserir o registro.");
                                                });
                                            }
                                        });
                                    }
                                }
                            }
                        });

                        res.render(path.join(__dirname + '/public/pointers/social/home.ejs'),{db: results, no_posts: true, msg: warning});
                        warning = "";
                    }
                });
            }
            else
            {
                res.redirect("/Logout");
            }
        });
    } else {
        res.redirect("/Login");
    }
});

// Perfil
app.get('/Profile', (req, res)=>{

    //Pegndo a user id passada
    const user_id = req.query.id;

    // pega horario atual do server para mensagens diferentes.
    const date = new Date();
    const hour = date.getHours();

    // verifica se voce esta logado ou nao
    if (req.session.loggedin) {
        if(user_id.length > 0)
        {
            // Pegando as informações da db sobre o usuario.
            conn.query("SELECT * FROM accounts WHERE profile_id = ?;",[user_id],(error,results)=>{
                if(error) throw error;
                if(results.length > 0)
                {
                    // Pegando informações do usuario atual logado 
                    conn.query("SELECT * FROM accounts WHERE profile_id = ?;",[req.session.profile_id],(error,myself)=>{
                        if(error) throw error;
                        if(myself.length > 0)
                        {   
                            // Pegando informações do perfil do usuario 
                            conn.query("SELECT * FROM profile_info WHERE profile_id = ?;",[user_id],(error,profInfo)=>{
                                if(error) throw error;
                                if(profInfo.length > 0)
                                {  
                                    // Pegando informações das visitas
                                    conn.query("SELECT * FROM profile_visits;", (error,visits)=>{
                                        if(error) throw error;
                                        if(!error)
                                        {
                                            // se o id do cara logado for diferente do que vc esta vendo
                                            // grava sua visit no perfil dele.
                                            if(req.session.profile_id !== results[0].profile_id)
                                            {
                                                conn.query("INSERT INTO profile_visits (profile_id, first_name, visited_profile_id) VALUES (?, ?, ?);",
                                                [myself[0].profile_id, myself[0].first_name, user_id], (error,)=>{
                                                    if(error) throw error;
                                                });
                                            }

                                            res.render(path.join(__dirname + '/public/pointers/social/profile.ejs'),{hour, profile: results, me: myself, info: profInfo, visit: visits});
                                        }
                                    });
                                }
                                else
                                {
                                    res.redirect("/Logout");
                                }
                            });
                        }
                        else
                        {
                            res.redirect("/Logout");
                        }
                    });
                }
            });
        }
    }
    else
    {
        warning = "Você não pode acessar um perfil sem antes ter entrado na plataforma.";
        res.redirect("/Login");
    }
});

// Ajax home -> atualizando likes.
app.get('/attLikes', (req, res)=>{
    var id = req.query.q;
    console.log(id);

    // Pegando as informações da db
    conn.query("SELECT * FROM accounts WHERE email=?",[req.session.email],(error,results)=>{
        if(error) throw error;
        if(results.length > 0)
        {
            // verificando se ja deu like nos posts.
            conn.query("SELECT * FROM post_comments_liked;", (error, liked)=>{
                if(error) throw error;
                if(liked.length > 0)
                {
                    // tem q pegar um filtro baseados nos amigos q ele tem. (exibindo posts globais por enquanto).
                    conn.query("SELECT * FROM feed_posts WHERE postID = ?;", [id],(error, datas)=>{
                        if(error)throw error;
                        if(datas.length > 0) res.render(path.join(__dirname + '/public/pointers/ajax/attLikes.ejs'),{db: results, posts: datas, isliked: liked});
                    });
                }
            });
        }
        else return res.status(400).send('Erro ao achar o usuario');
    });
});

// Logout
app.get('/Logout', (req, res) => {
    req.session.destroy(err => {
      if (err) console.error(err);
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
                    req.session.profile_id = results[0].profile_id;

                    if(cb) {req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;}// 30 dias até deslogar.

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
                        var profile_id = Math.floor(Math.random() * 900000) + 100000;

                        // Aplicando hash na senha e gravando no banco.
                        await crypt.hash(password, 10, (error, hash)=>{
                            if(error) throw error;
                            conn.query("INSERT INTO accounts (profile_id, first_name, last_name, email, password, gender, birth_day, birth_month, birth_year, photo)"
                            + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",[profile_id, name, lastname, email, hash, radios, days, months, year, '/photos/default_photo.png'],(error,results,fields)=>{
                                if(error) throw error;
                                if(results.affectedRows > 0)
                                { 
                                    conn.query("INSERT INTO profile_info (profile_id) VALUES (?);",[profile_id],(error,profile)=>{
                                        if(error) throw error;
                                        if(profile.affectedRows > 0)
                                        { 
                                            // Cookies
                                            req.session.loggedin = true;
                                            req.session.email = email;
                                            req.session.profile_id = profile_id;

                                            erro = ""; 
                                            res.redirect("/Home"); 
                                        }
                                    });
                                    
                                }
                                else { erro = "Não foi possivel fazer o cadastro, entre em contato com o suporte."; res.redirect("/Register"); }
                            });
                        });
                    }
                });
            } else { warning = "Você não preencheu a sua data de nascimento."; res.redirect("/Register"); }
        } else { warning = "Você deixou campos sem preencher, volte e preencha os campos."; res.redirect("/Register"); }
    } else { warning = "As senhas que você digitou não são iguai sou sua senha é muito grande."; res.redirect("/Register");}
});


// Post no feed
const upload = multer({ storage: storageIMGSAndVideos });// Upload ed fotos
app.post("/makePost", upload.array('file'),(req, res)=>{
    // pegando texto e email
    const text = req.body.ckeditorContent;
    const file = req.files;
    var email = req.session.email;

    // hora atual
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();

    // Verificando se o texto esta vazio ou não
    if(text.length > 0 || req.files)
    {
        // pegando o nome do usuario e a foto dele.
        conn.query("SELECT * FROM accounts WHERE email = ?;",[email],(error, result)=>{
            if(error)throw error;
            if(result.length > 0)
            {
                // Salva o post
                conn.query("INSERT INTO feed_posts (from_user, name,`text`, posted_when, date, user_photo) VALUES (?, ?, ?, ?, now(), ?);",
                [result[0].profile_id, result[0].first_name, text, hour+':'+min, result[0].photo],(error, results)=>{
                    if(error)throw error;
                    if(results.affectedRows > 0)
                    {
                        // Pegando id do post.
                        conn.query("SELECT * FROM feed_posts WHERE `text`=?",[text],(error, post)=>{
                            if(error)throw error;
                            if(post.length > 0)
                            {
                                // inserindo o post na tabela de likes.
                                conn.query("SELECT * FROM accounts;",(error, all)=>{
                                    if(error) throw error;
                                    if(all.length > 0)
                                    {
                                        // inserindo por todos os usuarios mas verificando se ja existe.
                                        for (var i = 0; i < datas.length; i++)
                                        {
                                            for (var a = 0; a < alll.length; a++)
                                            {
                                                const postID = datas[i].postID;
                                                const user_id = alll[a].profile_id;
                                
                                                // Verifica se não existe registros iguais antes de inserir
                                                conn.query("SELECT * FROM post_comments_liked WHERE postID = ? AND user_id = ?", [postID, user_id], (error, results) => {
                                                    if (error) return res.status(400).send("Erro na consulta.");
                                                    if (results.length === 0)
                                                    {
                                                        // Não existe registro igual, então insira
                                                        conn.query("INSERT INTO post_comments_liked (postID, user_id, liked) VALUES (?, ?, 0);",
                                                        [postID, user_id], (error) => {
                                                            if (error) return res.status(400).send("Erro ao inserir o registro.");
                                                        });
                                                    }
                                                });
                                            }
                                        }

                                        // grava na tabela de fotos caso tenha upload de fotos.
                                        if(req.files)
                                        {
                                            // Salva as imagens
                                            for (let i = 0; i < req.files.length; i++) {
                                                // Verifica o tipo de cada arquivo passado.
                                                const mimeType = mime.lookup(req.files[i].originalname);
                                                console.log(mimeType);

                                                // Path completo do arquivo das fotos e videos do post
                                                var imgsrc = '/post_content/' + req.session.profile_id + '/' + req.files[i].filename;
                                                if(mimeType === "image/jpeg" || mimeType === "image/png")
                                                {
                                                    conn.query("INSERT INTO post_media (post_id, image) VALUES (?, ?);",
                                                    [post[0].postID, imgsrc],(error)=>{if(error) throw error;});
                                                } 
                                                else if(mimeType === "video/mp4")
                                                {
                                                    conn.query("INSERT INTO post_media (post_id, video) VALUES (?, ?);",
                                                    [post[0].postID, imgsrc],(error)=>{if(error) throw error;});
                                                }
                                            }
                                            return res.status(200).send("Post criado com sucesso!");
                                        }
                                    }
                                });
                                
                            }
                        });
                    }
                    else
                    {
                        return res.status(400).send("error");
                    }
                });
            }
            else
            {
                return res.status(400).send("error");
            }
        });
    }else { return res.status(400).send("error");}
});

// Comentando o post
app.post("/commentPost",(req, res)=>{
    // pegando texto e email
    var post_id = req.query.q;
    var text = req.body['response-' + post_id];
    var email = req.session.email;

    // hora atual
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();

    // Verificando se o texto esta vazio ou não
    if(text.length > 0)
    {
        // pegando o nome do usuario e a foto dele.
        conn.query("SELECT * FROM accounts WHERE email = ?;",[email],(error, result)=>{
            if(error)throw error;
            if(result.length > 0)
            {
                // Salva o post
                conn.query("INSERT INTO post_comments (postID , user_id, name,`text`, posted_when, user_photo, likes) VALUES (?, ?, ?, ?, ?, ?, ?);",
                [post_id, result[0].profile_id, result[0].first_name, text, hour+':'+min, result[0].photo, 0],(error, results)=>{
                    if(error)throw error;
                    if(results.affectedRows > 0)
                    {
                        warning = "";
                        res.redirect("/Home");
                    }
                    else
                    {
                        warning = "Houve ao realizar o post, volte a fazer o post mais tarde.";
                        res.redirect("/Home");
                    }
                });
            }
            else
            {
                warning = "Houve ao realizar o post, volte a fazer o post mais tarde.";
                res.redirect("/Home");
            }
        });
    }else { warning = "Você precisa digitar um texto para postar."; res.redirect("/Home");}
});

// Like post
app.post("/likePost",(req, res)=>{
    //pegando id passado no link
    const id = req.query.q;
    const opt = req.query.opt;
    console.log(opt);

    // verificando se não tem nenhuma entrada indevida.
    if(id.length > 0)
    {
        if(opt.length > 0)
        {
            // Processo de like
            if(opt === '1')
            {
                // query que pega as informações da tabela de likes
                conn.query("SELECT * FROM post_comments_liked WHERE postID = ? and user_id = ?;", [id, req.session.profile_id], (error, result)=>{
                    if(error) throw error;
                    if(result.length > 0)
                    {
                        // checa se o usuario ja deu like neste post 
                        if(result[0].liked === 1) { return res.status(400).send(" ja deu o like.");}
                        else
                        {
                            // DA O LIKE
                            conn.query("UPDATE post_comments_liked SET liked = 1 WHERE postID = ? and user_id = ?;", 
                            [id, req.session.profile_id], (error, liked)=> {
                                if(error) throw error;
                                if(liked.affectedRows > 0)
                                {
                                    // Atualiza o contador.
                                    conn.query("UPDATE feed_posts SET likes = likes + 1 WHERE postID = ?;", 
                                    [id, req.session.profile_id], (error, liked)=> {
                                        if(error) throw error;
                                        if(liked.affectedRows > 0) return res.status(200);
                                        else return res.status(400).send(" Erro interno ao processar o like.");
                                    });
                                }
                                else
                                {
                                    return res.status(400).send(" Erro interno ao processar o like.");
                                }
                            });
                        }
                    }
                });
            }
            else
            {
                // query que pega as informações da tabela de likes
                conn.query("SELECT * FROM post_comments_liked WHERE postID = ? and user_id = ?;", [id, req.session.profile_id], (error, result)=>{
                    if(error) throw error;
                    if(result.length > 0)
                    {
                        // checa se o usuario ja deu like neste post 
                        if(result[0].liked === 0){ return res.status(400).send(" Você ja deu like neste post.");}
                        else
                        {
                            // DA O DESLIKE
                            conn.query("UPDATE post_comments_liked SET liked = 0 WHERE postID = ? and user_id = ?;", 
                            [id, req.session.profile_id], (error, liked)=> {
                                if(error) throw error;
                                if(liked.affectedRows > 0)
                                {
                                    // Atualiza o contador.
                                    conn.query("UPDATE feed_posts SET likes = likes - 1 WHERE postID = ?;", 
                                    [id, req.session.profile_id], (error, liked)=> {
                                        if(error) throw error;
                                        if(liked.affectedRows > 0) return res.status(200);
                                        else return res.status(400).send(" Erro interno ao processar o deslike.");
                                    });
                                }
                                else return res.status(400).send(" Erro interno ao processar o deslike.");
                            });
                        }
                    }
                });
            }
        }
    }
});

// Pesquisando por usuarios.
app.get("/searchUser", (req, res)=>{

    // Pegando valor do link
    const user = req.query.q;

    // Puxando suaurio baseado no id de perfil ou nome.
    if(user.length > 0)
    {
        conn.query("SELECT * FROM accounts WHERE profile_id LIKE ? OR first_name LIKE ?", 
        ["%" + user + "%", "%" + user + "%"], (error, results)=>{
            if(error) throw error;
            if(results.length > 0) res.status(200).render(path.join(__dirname + '/public/pointers/ajax/attSearch.ejs'),{db: results});
            else res.status(400).send('Erro ao pesquisar, tente novamente mais tarde.'); 
        });
    }
    else res.status(400).send('Você não digitou nada no campo de pesquisa.');
});
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////   404 Page   /////////////////////////////////////
app.use((req, res, next)=>{ res.redirect("/404"); });
////////////////////////////////////////////////////////////////////////////////////////////

///////////////////   seta a porta e ip(opicional para local host) do app   /////////////////
app.listen(3000);                             ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////