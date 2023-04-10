import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { usuarioModel } from '../../models/usuarioModel'
import { publicacaoModel } from '../../models/publicacaoModel'
import { politicaCORS } from '../../middlewares/politicaCORS'

const comentarioEndpoint = async (req : NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
  try {

    if (req.method === 'PUT') {
      const {userId, id} = req.query
      const usuarioLogado  = await usuarioModel.findById(userId)
      if (!usuarioLogado) {
        return res.status(400).json({ erro : 'Usuário não encontrado.' })
      }

      const publicacao = await publicacaoModel.findById(id)
      if (!publicacao) {
        return res.status(400).json({ erro : 'Publicação não encontrada.' })
      }
      
      if (!req.body || !req.body.comentario || req.body.comentario.length < 2){
        return res.status(400).json({ erro : 'Comentário não é válido.' })
      }

      const comentario = {
        usuarioId: usuarioLogado._id,
        nome: usuarioLogado.nome,
        comentario: req.body.comentario
      }

      publicacao.comentarios.push(comentario) //FIXME: Pq ao fazer pubicacao. não traz comentarios automaticamente ?
      await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
      return res.status(200).json({msg : 'Comentario adicionado com sucesso'})
    }
    return res.status(405).json({ erro : 'Método informado não é válido.'})
    
  }catch (error) {
    console.log(error)
    return res.status(500).json({ erro : 'Ocorreu erro ao adicionar comentário.' })
  }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(comentarioEndpoint)))