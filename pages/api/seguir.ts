import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { usuarioModel } from '../../models/usuarioModel'
import { seguidorModel } from '../../models/seguidorModel'

// Como devemos implementar o nosso seguir ?
// O seguir poderia ser um array ? Resposta: Não, iremos criar um novo model (tabela).

const seguirEndpoint = async ( req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
  try {
    // Qual método vamos utilizar ?
    if (req.method === 'PUT') {

      const { userId, id } = req?.query
      // Usuário logado/autenticado que está fazendo as ações
      const usuarioLogado = await usuarioModel.findById(userId)
      if (!usuarioLogado) {
        return res.status(400).json({ erro : 'Usuário logado não encontrado.' })
      }
      
      // E qual a outra informação e de onde ela vem ?
      // id do usuário a ser seguido (pegar do query)
      const usuarioSerSeguido = await usuarioModel.findById(id)
      if (!usuarioSerSeguido) {
        return res.status(400).json({ erro : 'Usuário a ser seguido não encontrado.' })
      }

      //  Buscar se EU LOGADO sigo ou não esse usuário
      const jaSigoEsseUsuario = await seguidorModel
        .find({  usuarioId : usuarioLogado._id, usuarioSeguidoId : usuarioSerSeguido._id  })

        // Sinal que eu j'sigo esse usuário
        if (jaSigoEsseUsuario && jaSigoEsseUsuario.length > 0) {
        // Sinal que eu já sigo esse usuário

          jaSigoEsseUsuario.forEach(async(e: any) => await seguidorModel.findByIdAndDelete({ _id : e._id }))
          usuarioLogado.seguindo--
          await usuarioModel.findByIdAndUpdate({ _id : usuarioLogado._id}, usuarioLogado)
          
          usuarioSerSeguido.seguidores--
          await usuarioModel.findByIdAndUpdate({ _id : usuarioSerSeguido._id}, usuarioSerSeguido)
          
          return res.status(200).json({ msg : 'Deixou de seguir o usuário com sucesso.' })

        }else{
          const seguidor = {
            usuarioId : usuarioLogado._id,
            usuarioSeguidoId : usuarioSerSeguido._id 
          }
          await seguidorModel.create(seguidor)

         // O usuário logado está seguindo um novo usuário.
         // Então o número de SEGUINDO deve aumentar.  
          usuarioLogado.seguindo++
          await usuarioModel.findByIdAndUpdate({ _id : usuarioLogado._id}, usuarioLogado )

         // O usuário seguido está sendo seguido por um novo usuário.
         // Então o número de SEGUIDORES deve aumentar. 
          usuarioSerSeguido.seguidores++
          await usuarioModel.findByIdAndUpdate({ _id : usuarioSerSeguido._id}, usuarioSerSeguido )

          return res.status(200).json({ msg : 'Usuário seguido com sucesso.' })
        }

    }
    return res.status(405).json({ erro : 'Método informado não existe.' })
    
  }catch (error) {
    console.log(error)
    return res.status(500).json({ erro : 'Não foi possível follow/unfollow o usuário informado.' })
  }
}

export default validarTokenJWT(conectarMongoDB(seguirEndpoint))