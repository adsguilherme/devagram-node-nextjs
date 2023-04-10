import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { usuarioModel } from '../../models/usuarioModel'
import { publicacaoModel } from '../../models/publicacaoModel'
import { politicaCORS } from '../../middlewares/politicaCORS'

const likeEndpoint = async (req : NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {

  try {

    // Qual método devemos utilizar ?
    // PUT
    if (req.method === 'PUT') {
      
      // id da publicação
        const { id } = req?.query   
        
        const publicacao = await publicacaoModel.findById(id)
        if (!publicacao) {
          return res.status(400).json({ erro : 'Publicação não encontrada.' })
        }
        // id do usuário que está dando like/unlike na publicação.
        // vem de onde ?
        const {userId} = req?.query
        const usuario = await usuarioModel.findById(userId)
        if (!usuario) {
          return res.status(400).json({ erro : 'Usuário não encotrado.' })
        }

        // Como vamos administrar os likes/unlikes ?
        const indexDoUsuarioNoLike = publicacao.likes.findIndex(( e : any) => e.toString() === usuario._id.toString()) // Transformando object id em string.
        
        // Se o index for -1 significa que não curtiu a foto
        if (indexDoUsuarioNoLike != -1) {
          publicacao.likes.splice(indexDoUsuarioNoLike) // splice é um método do array para remover alguma posição do array.
          await publicacaoModel.findByIdAndUpdate({ _id : publicacao._id }, publicacao )
          return res.status(200).json({ msg : 'Publicação descurtida com sucesso.' })

        // Se o index for > -1 significa que curtiu a foto
        }else{
          publicacao.likes.push(usuario._id) // push é um método do array para adicionar um item no final da lista do array.
          await publicacaoModel.findByIdAndUpdate({ _id : publicacao._id }, publicacao )
          return res.status(200).json({ msg : 'Publicação curtida com sucesso.' })
        }
    }
    return res.status(405).json({ erro : 'Método informado não é válido.'})
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ erro : 'Ocorreu erro ao dar like ou deslike em uma publicação.' })
    
  }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)))