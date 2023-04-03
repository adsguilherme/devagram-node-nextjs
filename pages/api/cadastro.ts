import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import type { cadastroRequisicao } from '../../types/cadastroRequisicao'

const endpointCadastro = (req : NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
  
  if (req.method === 'POST') {
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

    return res.status(200).json({ msg : 'Dados corretos.'  })

  }
  return res.status(405).json({ erro: 'Método informado não é válido.' })
}

export default endpointCadastro // Sem o export teremos erro com status code 500