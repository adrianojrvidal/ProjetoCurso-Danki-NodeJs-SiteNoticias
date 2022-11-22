//! Módulos necessários e configurações
//* Express
const express = require('express');
const app = express();

//* Body-Parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());                          // to suport JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}))     // to suport URL-encoded bodies

//* Path   
const path = require('path');             

//* EJS
const ejs = require('ejs');                  
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views/pages'));

//* Posts.js
const Posts = require('./Posts.js')

//* Express-Sessions
var session = require('express-session')
//npm i express-session -save

app.use(session({
    secret: '123456',
    // resave: false,
    // saveUninitialized: true,
    cookie: {maxAge: 60000}           
    //{secure: true}
}))



//-------------------------------------------------------------------------------------------------------
//! Banco de dados - MongoDB
const mongoose = require('mongoose')

mongoose.connect(
    'mongodb+srv://root:vidal1996@cluster0.lylwvm0.mongodb.net/dankicode?retryWrites=true&w=majority', // Após 'mongodb.net/' colocar o nome do banco de dados
    {useNewUrlParser: true},
    {useUnifiedTopology: true})
.then(function(){
    console.log('MongoDb conectado com sucesso!')
})
.catch(function(err){
    console.log(err.message)
})


//-------------------------------------------------------------------------------------------------------
//! Servidor
app.listen(3000, ()=>{
    console.log("Servidor funcionando!")
})


//-------------------------------------------------------------------------------------------------------
//! Rotas
//* Pages
//Home
app.get('/', (req,res)=>{
    //Rota para query de pesquisa =busca
    if(req.query.busca == null){                   // Se não tiver buscando nada, fornece a Home
        
        // buscar os itens do Banco de Dados (sort() é para buscar de forma decrescente)
        Posts.find({}).sort({'_id': -1}).exec(function(err, posts){
            //console.log(posts[0])
            
            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    descricaoCurta: val.conteudo,
                    conteudo: val.conteudo,
                    imagem: val.imagem,
                    categoria: val.categoria,
                    slug: val.slug
                }
            })

            Posts.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop){

                // console.log(posts[0]);

                postsTop = postsTop.map(function(val){

                    return {

                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        descricaoCurta: val.conteudo,
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        views: val.views

                    }
                })   

                res.render('home', {posts:posts, postsTop:postsTop});  // Renderização da Home + dados 
            })
        })
        
    } else{ 
    
        Posts.find(
            { titulo: {
                $regex: req.query.busca,
                $options:"i"
            }}, function(err, posts){
                res.render('busca', {
                    posts:posts,
                    contagem: posts.length
                }) 
            }
        )
    }
})

//Single
app.get('/:slug', (req, res)=>{

    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc: {views:1}}, {new: true}, function(err, resp){
        console.log(resp)
        
        if(resp != null) {
            Posts.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop){

                // console.log(posts[0]);
        
                postsTop = postsTop.map(function(val){
        
                    return {
        
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        descricaoCurta: val.conteudo.substr(0,100),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        views: val.views
        
                    }      
                })
                
                res.render('single', {noticia: resp, postsTop:postsTop});
            })

        } else (res.redirect('/'))
    })
    
})

let ususarios = [
    {
        login:'admin',
        senha:'admin'
    }
]

//Admin

app.post('/admin/login', (req, res)=>{
    ususarios.map(function(val){
        if(val.login == req.body.login && val.senha == req.body.senha){
            req.session.login = 'Admin'
        }
    })

    res.redirect('/admin/login')

})



app.post('/admin/cadastro',(req,res)=>{

    //console.log(req.body);

    Posts.create({

        titulo:req.body.titulo_noticia,

        imagem: req.body.url_imagem,

        categoria: req.body.categoria,

        conteudo: req.body.noticia,

        slug: req.body.slug,

        autor: req.body.autor,

        views: 0

    });

    res.redirect('/admin/login')
    
})

app.get('/admin/deletar/:id', (req, res)=>{

    Posts.deleteOne({_id:req.params.id})
        
        .then(function(){
            res.redirect('/admin/login')
        }
    )

})



app.get('/admin/login', (req, res)=>{
    
    // if (req.session.login == null) {
    //     res.render('admin-login')
    // } else {
         res.render('admin-painel')
    // }
    
})




    