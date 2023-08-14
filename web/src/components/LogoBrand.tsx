import Image from 'next/image'
import nlwLogo  from '../assets/nlw-spacetime-logo.svg'
import Link from 'next/link'

export function LogoBrand() {
    return(
        <div className='space-y-5'>
            <Image src={nlwLogo} alt="NLW Space Project"/>
            <div className='max-w-[420px] space-y-1'>
                <h1 className='mt-5 text-4.5xl font-bold leading-tight text-gray-50'>Sua cápsula do tempo</h1>
                <p className='text-lg leading-relaxed'>Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!</p>
            </div>
            <Link href="/memories/new" className='bg-green-500 text-black text-sm px-5 py-3 rounded-full font-alt font-bold inline-block leading-none'>CADASTRAR LEMBRANÇA</Link>
        </div>  
    )
}
