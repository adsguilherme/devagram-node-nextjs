/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import md5 from 'md5'
import { usuarioModel } from '../../models/usuarioModel'

const endpointLogin = async ( // pesquisas no banco de dados deve virar async (assincrono)
  req: NextApiRequest,
  res: NextApiResponse<respostaPadraoMsg>
) => {
  if (req.method === 'POST') {
    const { login, senha } = req.body

    const usuariosEncontrados = await usuarioModel.find({ email : login, senha : md5(senha) })
    if (usuariosEncontrados && usuariosEncontrados.length > 0) {
      const usuarioEncontrado = usuariosEncontrados[0] 
      return res.status(200).json({ msg: `usuário ${usuarioEncontrado.nome} autenticado com sucesso.` })
    }
    return res.status(400).json({ erro: 'usuário ou senha não encontrados.' })
  }
  return res.status(405).json({ erro: 'Método informado não é válido.' })
}

export default conectarMongoDB(endpointLogin)