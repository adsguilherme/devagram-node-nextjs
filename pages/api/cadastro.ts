import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import type { cadastroRequisicao } from '../../types/cadastroRequisicao'
import { usuarioModel } from '../../models/usuarioModel'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import md5 from 'md5'
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'
import nc from 'next-connect'

const handler = nc()
  .use(upload.single('file'))
  .post(async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
  
      const usuario = req.body as cadastroRequisicao //HACK: Dessa forma não preciso fazer o destruction.
      
      if (!usuario.nome && !usuario.email && !usuario.senha) {
        return res.status(400).json({ erro: 'O payload está incompleto.' }) 
      }  
    
      if (!usuario.nome || usuario.nome.length < 2) { // Lendo o código: if não informou o nome OU nome for menor que 2, retorna 'Nome inválido'.
        return res.status(400).json({ erro: 'Nome inválido.' })    
      }
  
      if (!usuario.email 
          || usuario.email.length < 5 
          || !usuario.email.includes('@') 
          || !usuario.email.includes('.')) {
            return res.status(400).json({ erro: 'Email inválido.' }) 
      }
  
      if (!usuario.senha || usuario.senha.length < 4) {
        return res.status(400).json({ erro: 'Senha inválida.' })
      }
  
      // Validação se já existe usuário com o mesmo email
      const usuarioMesmoEmail = await usuarioModel.find({ email : usuario.email })
  
      if (usuarioMesmoEmail && usuarioMesmoEmail.length > 0) {
        return res.status(400).json({ erro: 'Já existe uma conta o email informado.' })
      }
      
      // Enviar a imagem do multer para o cosmic
      const image = await uploadImagemCosmic(req)

      // Salvar no banco de dados
      const usuarioSerSalvo = {
        nome : usuario.nome,    
        email : usuario.email,    
        senha : md5(usuario.senha),   
        avatar : image?.media?.url 
      }
  
      await usuarioModel.create(usuarioSerSalvo)
      return res.status(200).json({ msg : 'Usuário criado com sucesso.' })
  
  })

  // Essa config faz com que nesta api o bodyParser nunca transforme o conteúdo do envio em json.
  export const config = {
    api: {
      bodyParser : false
    } 
  }

// Sem o export teremos erro com status code 500.
// Reforçando a questão para que serve o middleware, ele conecta no banco de dados antes de fazer a request, que neste caso é o cadastro de usuário.
// Sem o middleware, irá ocorrer um erro de status code 500 no server (error - MongooseError: Operation `usuarios.insertOne()` buffering timed out after 10000ms)
export default conectarMongoDB(handler) 