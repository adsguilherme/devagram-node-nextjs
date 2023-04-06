import multer from 'multer'
import cosmicjs from 'cosmicjs'

// Variáveis de ambiente do .env.local
const {
  CHAVE_GRAVACAO_AVATARES,
  CHAVE_GRAVACAO_PUBLICACOES,
  BUCKET_AVATARES,
  BUCKET_PUBLICACOES } = process.env

// Instãncia do Cosmic
const Cosmic = cosmicjs()

const bucketAvatares = Cosmic.bucket({
  slug: BUCKET_AVATARES,
  write_key: CHAVE_GRAVACAO_AVATARES
})

const bucketPublicacoes = Cosmic.bucket({
  slug: BUCKET_PUBLICACOES,
  write_key: CHAVE_GRAVACAO_PUBLICACOES
})

const storage = multer.memoryStorage()
const upload = multer({ storage : storage }) 

const uploadImagemCosmic = async(req : any) => {
  // Se na requisição chegou um arquivo e se esse arquivo tem um nome
  if(req?.file?.originalname) {
    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer
    }

    if (req.url && req.url.includes('publicacao')) {
      return await bucketPublicacoes.addMedia({ media : media_object }) 
    }else {
      return await bucketAvatares.addMedia({ media : media_object }) 
    }
  }
}

export { upload, uploadImagemCosmic }