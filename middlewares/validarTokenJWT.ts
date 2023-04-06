import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import type { respostaPadraoMsg } from '../types/respostaPadraoMsg'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const validarTokenJWT = ( handler : NextApiHandler ) =>
  (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {

    try {

      // Validando chave de acesso
    const { MINHA_CHAVE_JWT } = process.env
    if (!MINHA_CHAVE_JWT) {
      return res.status(500).json({ erro: 'ENV chave JWT não informada na execução do projeto.' })
    }

    // Implementando camada de segurança do token
    // Validando se veio algum header (deve ter pelo menos o header de autorização)
    if (!req || !req.headers) {
      return res.status(401).json({ erro: 'Não foi possível validar o token de acesso.' })
    }

    // Validando se o método é diferente de OPTIONS
    if (req.method !== 'OPTIONS') {
      // Validando se veio o header de autorização
      const authorization = req.headers['authorization']
      if (!authorization) {
        return res.status(401).json({ erro: 'Não foi possível validar o token de acesso.' })
      }
      
      // Validando se veio o token
      const token = authorization.substring(7) // Nessa parte .substring(7) está eliminando a palabra Bearear e o espaço. Retornando apenas o JWT.
      if (!token) {
        return res.status(401).json({ erro: 'Não foi possível validar o token de acesso.' })
      }
      
      // Pegar token decodificado
      const decode = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload
      if (!decode) {
        return res.status(401).json({ erro: 'Não foi possível validar o token de acesso.' })
      }

      if (!req.query) {
        req.query = {}
      }
      
      req.query.userId = decode._id

    }
      
    } catch ( error ) {
      console.log(error)
      return res.status(401).json({ erro: 'Não foi possível validar o token de acesso.' })
    }

    return handler(req, res)
}