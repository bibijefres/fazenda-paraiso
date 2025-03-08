import { NextResponse } from 'next/server'

export function middleware(req) {
  const basicAuth = req.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1] // Remove a palavra "Basic"
    const [user, pwd] = atob(authValue).split(':')

    // Comparar com as variáveis de ambiente
    if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASS) {
      return NextResponse.next()
    }
  }

  // Se não estiver autenticado, retorna 401 e pede credenciais
  return new NextResponse('Autenticação requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Área Protegida"'
    }
  })
}

// Limitar o middleware à rota /gestao e suas subrotas
export const config = {
  matcher: ['/gestao/:path*']
}
