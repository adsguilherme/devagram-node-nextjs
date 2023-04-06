import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { usuarioModel } from '../../models/usuarioModel'
import { publicacaoModel } from '../../models/publicacaoModel'

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg> | any) => {
  try {
    if (req.method === 'GET') {
      // Receber uma informação do id do usuário que eu quero buscar o feed.
      // De onde vem essa informação ?
      if (req?.query?.id) {
        // Agora que obtemos o id do usuário, como verificamos se é um usuário valido ? 
        const usuario = await usuarioModel.findById(req?.query?.id)
        if (!usuario) {
          return res.status(400).json({ erro : 'Usuário não encontrado.'})
        }
        
        // E como busco as publicações dele ? 
        const publicacoes = await publicacaoModel.find({ idUsuario : usuario._id })
          .sort({ data: -1 }) // Ordenação decrescente das publicações
        
          return res.status(200).json(publicacoes)
      }  
    }
      return res.status(405).json({ erro : 'Método informado não é válido.'})
  }catch (error) {
      console.log(error)
      
    }
    return res.status(400).json({ erro : 'Não foi possível obter o feed.'})
}

export default validarTokenJWT(conectarMongoDB(feedEndpoint))