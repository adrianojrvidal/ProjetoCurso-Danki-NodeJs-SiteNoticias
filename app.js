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


//-------------------------------------------------------------------------------------------------------
//! Banco de dados - MongoDB
const mongoose = require('mongoose')

mongoose.connect(
    'mongodb+srv://root:vidal1996@cluster0.lylwvm0.mongodb.net/?retryWrites=true&w=majority',
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
        res.render('home', {});                     // Renderização da Home + dados 
    } else{
        res.render('busca', {});
    }
})
    
//* Slug - URL da notícia
//Home
app.get('/:slug', (req, res)=>{
    res.render('single', {});
})