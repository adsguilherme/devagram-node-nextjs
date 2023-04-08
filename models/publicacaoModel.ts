import mongoose, { Schema } from 'mongoose'

const publicacaoSchema = new Schema({
  idUsuario : { type : String, required : true  },
  descricao : { type : String, required : true  },
  foto : { type : String, required : true  },
  data : { type : Date, required : true  },
  comentarios : { type : Array, required : true, default : [] },
  likes : { type : Array, required : true, default : [] }
})

// mongoose.models.publicacoes:  é para validar se o model/tabela publicacoes já existe.
// mongoose.model('publicacoes', publicacaoSchema): irá criar a tabela publicacoes caso ela não exista.
export const publicacaoModel = (mongoose.models.publicacoes || mongoose.model('publicacoes', publicacaoSchema))