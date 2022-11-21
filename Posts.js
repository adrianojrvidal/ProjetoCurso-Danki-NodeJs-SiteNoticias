//! Banco de dados - MongoDB
const mongoose = require('mongoose')

// Definindo o Schema
const Schema = mongoose.Schema

const postSchema = new Schema ({
    titulo:String,
    imagem:String,
    categoria:String,
    conteudo:String,
    slug:String,
    autor:String,
    views:Number

}, {collection: 'posts'})


// Definindo o modelo
let Posts = mongoose.model('Posts', postSchema)

// Exportando
module.exports = Posts