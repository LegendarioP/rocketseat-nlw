export function EmptyMemories(){
    return (
        <div className="flex p-16 flex-1 items-center justify-center">
            <p className="text-center leading-relaxed w-[360px]">Você ainda não registrou nenhuma lembrança, comece a {' '}
                <a href="#" className="underline hover:text-gray-50 transition-colors">criar agora!</a>
            </p>
        </div>
    )
}