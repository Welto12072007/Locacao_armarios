import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// Validar as variáveis de ambiente
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('❌ SUPABASE_URL ou SUPABASE_KEY não estão definidas no .env')
}

// Criar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Testar conexão consultando a tabela 'usuarios'
async function testarConexao() {
  try {
    const { data, error } = await supabase.from('usuario').select('*')

    if (error) {
      console.error('❌ Erro ao consultar a tabela "usuario":', error.message)
    } else {
      console.log('✅ Conexão bem-sucedida! Dados encontrados:')
      console.table(data)
    }
  } catch (err) {
    console.error('❌ Erro inesperado ao conectar no Supabase:', err.message)
  }
}

testarConexao()
