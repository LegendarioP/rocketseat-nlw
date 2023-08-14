'use client'

import { ChangeEvent, useState } from "react"

export default function MediaPicker(){

    const [preview, setPreview] = useState<string | null>(null)

    function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.target
        if(!files){
            return 
        }

        const previewURL = URL.createObjectURL(files[0])

        setPreview(previewURL)
    }
    
    // voltar pra resolver o preview de video depois 

    return(
        <>
            <input 
                onChange={onFileSelected} 
                name="coverUrl"
                accept="image/*" 
                type="file" 
                id="imgUpload" 
                className="invisible w-0 h-0" />

            { preview && <img src={preview} alt="" className="w-full aspect-video rounded-lg object-cover" /> }
        </>
    )
}