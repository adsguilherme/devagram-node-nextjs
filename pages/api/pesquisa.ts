import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { usuarioModel } from '../../models/usuarioModel'

const pesquisaEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any[] | any>) => {
  
  try {
    
    if (req.method === 'GET') {
      
      const { filtro } = req.query  // Pegando as informações

        if (!filtro || filtro.length < 2) {
          return res.status(400).json({ erro : 'Favor informar pelo menos 2 caracteres para busca.' })
        }

        const usuariosEncontrados = await usuarioModel.find({
          
          // Propriedade options com 'i' (i de ignore case), vai evitar problemas de pesquisa por palavras com case sentitive.
          // nome: {$regex : filtro, $options : 'i'} 

          // Aplicando agora uma implementação para buscar por nome ou email.
          $or: 
              [{ nome : {$regex : filtro, $options : 'i'}},
              { email : {$regex : filtro, $options : 'i'}}]
        })

        return res.status(200).json(usuariosEncontrados)
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({ erro: 'Não foi possível buscar usuário.' })
    
  }
}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint))