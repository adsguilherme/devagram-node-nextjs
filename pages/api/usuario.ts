// API privada (precisa de token para enviar a request)

import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { usuarioModel } from '../../models/usuarioModel'
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'

const handler = nc() // Instanciando o endpoint
  .use(upload.single('file')) // O endpoint vai usar um middleare (.use tem uma conotação de middleware), e que irá aceitar uma única imagem que veio no atributo do multipart/form-data file.  
  .put(async(req : any, res : NextApiResponse<respostaPadraoMsg>) => {
    try {
      // Se eu preciso alterar o usuário, primeiro preciso pegar o usuário no DB.
      const {userId} = req?.query
      const usuario = await usuarioModel.findById(userId)

      // Se o usuário retornou algo é porque ele existe.
      // Se não retornou é porque não existe.

      if (!usuario) {
          return res.status(400).json({ erro: 'Usuário não encontrado.' })
      }
        
      const { nome } = req.body
      if (nome && nome.length > 2) {
        usuario.nome = nome
      }

      // Essa etapa está processando a imagem, pois não queremos um dado bruto. E o Cosmic irá nos retornar a url da imagem.
      const { file } = req
      if(file && file.originalname){
        const image = await uploadImagemCosmic(req)
        if (image && image.media && image.media.url) {
          usuario.avatar = image.media.url
        }
      }

      // Alterar os dados no DB
      
      await usuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario)
      return res.status(200).json({ msg : 'Usuário alterado com sucesso.' })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ erro : 'Não foi possível atualizar usuário:' + error })
    }
  }) // Agora o método get está dentro do handler, assim como o put.
  .get(async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any> ) => {
  
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
  })

  // Essa config faz com que nesta api o bodyParser nunca transforme o conteúdo do envio em json.
  export const config = {
    api: {
      bodyParser : false
    } 
  }

// Irá validar antes de chamar o endpoint
// 1º valida o token e se este estiver valido verifica se o banco está conectado e por fim chama a API. 
export default validarTokenJWT(conectarMongoDB(handler))