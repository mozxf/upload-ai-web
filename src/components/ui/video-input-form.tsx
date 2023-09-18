import { Label } from "@radix-ui/react-label"
import { Separator } from "@radix-ui/react-separator"
import { FileVideo, Upload } from "lucide-react"
import { Button } from "./button"
import { Textarea } from "./textarea"
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useMemo,  useRef, useState } from "react"
import { getFFmpeg  } from "@/lib/ffmpeg";
import {fetchFile} from "@ffmpeg/util"
import { api } from "@/lib/axios"
import { stat } from "fs"

type TStatus =  'waiting' |"converting" |  'uploading' | 'generating' | "success"
type TInputVideo = {
  onVideoUploaded: Dispatch<SetStateAction<string>>
}

export const VideoInputForm = ({onVideoUploaded}: TInputVideo) => {

  const statusMessages = {
    converting: "Convertendo...",
    generating: "Transcrevendo...",
    uploading: "Carregando...",
    success: "Sucesso"


  }

    
   const [videoFile, setVideoFile] = useState<File | null>(null);
   const [status, setStatus] = useState<TStatus>('waiting')
   const promptInputRef = useRef<HTMLTextAreaElement>(null)

    function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {

        const {files} = event.currentTarget

        if(!files) {
            return
        }

        setVideoFile(files[0])

      
    }

    const previewUrl = useMemo(() => {

      if(!videoFile) {
        return null
      }

      return URL.createObjectURL(videoFile)
    }, [videoFile])

    async function convertVideoToAudio(video: File) {
      console.log('started convertion')

      const ffmpeg = await getFFmpeg()

      await ffmpeg.writeFile('input.mp4', await fetchFile(video))

      ffmpeg.on('progress', progress => {
        
        console.log('Convert progress: ' + Math.round(progress.progress) * 100)
      })

      await ffmpeg.exec([
        "-i",  "input.mp4","-map","0:a",  "-b:a", "20k","-acodec","libmp3lame" ,"output.mp3"
      ])

      const data = await ffmpeg.readFile('output.mp3');

      const audioFileBlob = new Blob([data], {type: 'audio/mpeg'})
      const audioFile = new File([audioFileBlob], 'audio.mp3', {type: 'audio/mpeg'})
      console.log('Finnished convert: ', audioFile)

      return audioFile
    }





    async function handleUploadVideo(event: FormEvent) {
      event.preventDefault();
      setStatus('converting')
      const prompt = promptInputRef.current?.value;

      if(!videoFile) {
        return
      }

      console.log(prompt)
      const audioFile = await convertVideoToAudio(videoFile)



      const data = new FormData()
      data.append("file" ,audioFile)
      setStatus('uploading')
      const response = await api.post('/videos', data)

      const videoId = response.data.audio.id
      setStatus('generating')
      
      await api.post(`/video/${videoId}/transcription`, {
        prompt
      })
      
      setStatus('success')
      onVideoUploaded(videoId)
    }
    
    



    return (<form onSubmit={handleUploadVideo} className='space-y-6'>
    <label
      className='relative border w-full flex flex-col gap-2 text-sm items-center justify-center text-muted-foreground  cursor-pointer border-dashed rounded-md aspect-video hover:bg-primary/5 overflow-clip'
      htmlFor='video'
    >
     {videoFile ? 
     <video src={previewUrl as string}  autoPlay={true} muted={true}  controls={false} className="max-w-full   absolute inset-0 pointer-events-none z-10 object-contain " >

     </video>
     : 
     (
     <> 
     <FileVideo className='2-4 h-4' /> 
     Selecione um video 
     </>)}
    </label>
    <input
      className='sr-only'
      type='file'
      id='video'
      accept='video/mp4'
      onChange={handleFileSelected}
    />
    <Separator />
    <div className='space-y-2'>
      <Label htmlFor='transcriptionPrompt'>
        {' '}
        Prompt de transcrição
      </Label>
      <Textarea
      disabled={status !== 'waiting'}
      ref={promptInputRef}
        id='transcriptionPrompt'
        className='h-20 leading-relaxed resize-none'
        placeholder='Inclua palavras-chave mencionadas no video separadas por virgula (,)'
      />
    </div>
    <Button 
    disabled={status !== "waiting"} 
    type='submit' 
    className={`w-full ${status === 'success' ? "bg-emerald-400" : ""}`}>
    
      {status === 'waiting' ?  (<>Carregar Vídeo
      <Upload className='w-4 h-4 ml-2 '></Upload>
      </>) : statusMessages[status] } 
    </Button>
  </form>)

}



