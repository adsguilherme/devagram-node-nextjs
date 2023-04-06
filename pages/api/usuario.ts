// API privada (precisa de token para enviar a request)

import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { usuarioModel } from '../../models/usuarioModel'

const usuarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any> ) => {
  
  try {
    
    // Como eu pego os dados do usuário logado ?
    // id do usuário
    const { userId } = req?.query

    // Como eu busco os dados do meu usuário ?
    // No banco
    const usuario = await usuarioModel.findById(userId)
    usuario.senha = null
    return res.status(200).json(usuario)
      
  } catch (error) {
    console.log(error)
  }
  return res.status(400).json({ erro : 'Não foi possível obter dados do usuário.' })
}

// Irá validar antes de chamar o endpoint
// 1º valida o token e se este estiver valido verifica se o banco está conectado e por fim chama a API. 
export default validarTokenJWT(conectarMongoDB(usuarioEndpoint))