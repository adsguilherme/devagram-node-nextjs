// A estrutura do schema e a tabela do usuário.

import mongoose, { Schema } from 'mongoose'

const usuarioSchema = new Schema({
  nome: { type : String, required : true },
  email: { type : String, required : true },
  senha: { type : String, required : true },
  avatar: { type : String, required : false },
  seguidores: { type : Number, default : 0 },
  seguindo: { type : Number, default : 0 },
  publicacoes: { type : Number, default : 0 }
})

// mongoose.models.usuarios:  é para validar se o model/tabela usuários já existe.
// mongoose.model('usuarios', usuarioSchema): irá criar a tabela usuarios caso ela não exista.
export const usuarioModel = (mongoose.models.usuarios || mongoose.model('usuarios', usuarioSchema))
