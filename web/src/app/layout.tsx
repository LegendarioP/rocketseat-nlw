import { ReactNode } from 'react'
import './globals.css'
import { Roboto_Flex as Roboto, Bai_Jamjuree as Baijamjuree } from 'next/font/google'
import { Copyright } from '@/components/Copyrigh'
import { LoginField } from '@/components/LoginField'
import { LogoBrand } from '@/components/LogoBrand'
import { Profile } from '@/components/Profile'
import { cookies } from 'next/headers'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto-flex' })
const baiJamJuree = Baijamjuree({ subsets: ['latin'], weight: '700', variable: "--font-bai-jamjuree" })


export const metadata = {
  title: 'NLW Spacetime',
  description: 'Uma cápsula do tempo criado com React Native, TailndCSS, Next.Js'
}

export default function RootLayout({children} : { children: ReactNode }) {
  const isAutenticated = cookies().has('token')
  return (
    <html lang="en">
      <body className={`${roboto.variable}  ${baiJamJuree.variable} font-sans bg-gray-900 text-gray-100`}>
        
        <main className="grid grid-cols-2 min-h-screen">
          {/* Left Side */}
          <div className="relative flex flex-col items-start justify-between px-28 py-16  overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover">
            {/* Blur  */}
            <div className="absolute right-8 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 bg-purple-600 rounded-full blur-full" />

            {/* Stripes - Linha divisoria */ }
            <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes" />


            {/* Campo de login/sign in */}
            {isAutenticated ? <Profile /> : <LoginField />}


            {/* NLW LOGO */}
            <LogoBrand />

            {/* Logo and copy */}
            <Copyright />
          </div>

          {/* Right Side */}
          <div className="flex overflow-y-scroll max-h-screen flex-col bg-[url(../assets/bg-stars.svg)] bg-cover">
            {children}
          </div>
          </main>
      
      
      
      </body>
    </html>
  )
}
