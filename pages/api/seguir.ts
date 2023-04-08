import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'

const seguirEndpoint = ( req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
  try {

    // Como devemos implementar o nosso seguir ?
    // O seguir poderia ser um array ? Resposta: Não, iremos criar um novo model (tabela).

    // Qual método vamos utilizar ?
    if (req.method === 'PUT') {
      // Usuário logado/autenticado que está fazendo as ações
      if (req?.query?.id) {
        
      }
      
    }
    return res.status(405).json({ erro : 'Método informado não existe.' })

    // Quais dados vamos receber e aonde ?

    
  }catch (error) {
    console.log(error)
    return res.status(500).json({ erro : 'Não foi possível follow/unfollow o usuário informado.' })
  }
}

export default validarTokenJWT(conectarMongoDB(seguirEndpoint))