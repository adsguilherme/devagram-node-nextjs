import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { usuarioModel } from '../../models/usuarioModel'
import { publicacaoModel } from '../../models/publicacaoModel'
import { seguidorModel } from '../../models/seguidorModel'

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
      }else{
        // Feed principal
        // Dados do usuário logado
        const { userId } = req.query
        const usuarioLogado = await usuarioModel.findById(userId)
        if (!usuarioLogado) {
          return res.status(400).json({ erro : 'Usuário não encontrado.' })
        }
        // Agora que eu já tenho usuário, quais dados eu preciso ?
        // Resposta: Os dados de quem eu sigo.

        const seguidores = await seguidorModel.find({usuarioId : usuarioLogado._id})
        const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId)

        const publicacoes = await publicacaoModel.find({
          $or: [
            { idUsuario: usuarioLogado._id },
            { idUsuario: seguidoresIds }
          ]
        })
        .sort({data : -1}) // A ordenação será por data de postagem. O -1 irá ordenar trazendo as publicações mais recentes.

        const result = [];
        for (const publicacao of publicacoes) {
          const usuarioDaPublicacao = await usuarioModel.findById(publicacao.idUsuario);
            if(usuarioDaPublicacao){
              // Esse trecho irá retornar do usuário seu nome e avatar.
              const final = {...publicacao._doc, usuario : {
                  nome : usuarioDaPublicacao.nome,
                  avatar : usuarioDaPublicacao.avatar
              }}
              result.push(final) 
            }
        }
        return res.status(200).json(result)
      }  
    }
      return res.status(405).json({ erro : 'Método informado não é válido.'})
  }catch (error) {
      console.log(error)
      
    }
    return res.status(400).json({ erro : 'Não foi possível obter o feed.'})
}

export default validarTokenJWT(conectarMongoDB(feedEndpoint))