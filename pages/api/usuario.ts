// API privada (precisa de token para enviar a request)

import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'

const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse ) => {
  return res.status(200).json({ msg : 'Usuário autenticado com sucesso' })
}

// Irá validar antes de chamar o endpoint
export default validarTokenJWT(usuarioEndpoint)