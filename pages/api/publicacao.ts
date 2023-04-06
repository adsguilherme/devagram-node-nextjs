import { NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { publicacaoModel } from '../../models/publicacaoModel'
import { usuarioModel } from '../../models/usuarioModel'

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: any, res : NextApiResponse<respostaPadraoMsg>) => {
    
    try {

      const { userId } = req.query
      const usuario  = await usuarioModel.findById(userId)
      if (!usuario) {
        return res.status(400).json({ erro : 'Usuário não encontrado .' })
      }

      if (!req || !req.body) {
        return res.status(400).json({ erro : 'Parâmetros de entrada vazio.' })
      }
      
      const { descricao }  = req.body

    if (!descricao || descricao.length < 2) {
      return res.status(400).json({ erro : 'Descrição não é válida' })
    }
    
    if (!req.file || !req.file.originalname ) {
      return res.status(400).json({ erro : 'Imagem é obrigatória.' })
    }

    const image = await uploadImagemCosmic(req)
    const publicacao = {
      idUsuario : usuario._id,
      descricao,
      foto : image.media.url,
      data : new Date()
    }

    await publicacaoModel.create(publicacao)
    
    return res.status(200).json({ msg : 'Publicação criada com sucesso.' })
    } catch (erro) {
      console.log(erro)
      return res.status(400).json({ erro : 'Erro ao cadastrar publicação.' })
    }
  })

export const config = {
  api : {
    bodyParser : false
  }
}

// Cadeia de instruções
// 1º valida o token e se este estiver valido verifica se o banco está conectado e por fim chama a API. 
export default validarTokenJWT(conectarMongoDB(handler))