/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'

const endpointLogin = (
  req: NextApiRequest,
  res: NextApiResponse<respostaPadraoMsg>
) => {
  if (req.method === 'POST') {
    const { login, senha } = req.body

    if (login === 'admin@admin.com' && senha === 'admin@123') {
      return res.status(200).json({ msg: 'usuário autenticado com sucesso.' })
    }
    return res.status(400).json({ erro: 'usuário ou senha não encontrados.' })
  }
  return res.status(405).json({ erro: 'Método informado não é válido.' })
}

export default conectarMongoDB(endpointLogin)