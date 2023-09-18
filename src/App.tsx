import { Button } from './components/ui/button';
import { Github,  Wand2 } from 'lucide-react';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { Slider } from './components/ui/slider';
import { VideoInputForm } from './components/ui/video-input-form';
import { useState, useEffect, useRef } from 'react';
import { api } from './lib/axios';
import {useCompletion} from 'ai/react'

type TPrompt = {
  id: string;
  title: string;
  template: string;
}




export function App() {

  const [prompts, setPrompts] = useState<TPrompt[]>([])
  const [temperature, setTemperature] = useState<number>(0.5)
  const [videoId, setVideoId] = useState<string>("")

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,

    },
    headers: {
      'Content-Type': 'Application/Json'
    }
  })

  useEffect(() => {
       api.get('/prompts').then((res => {
          
          setPrompts(res.data)
      }))
  },[])

  function handlePromptSelected(promptId: string ) {
    const selected = prompts.find(prompt => prompt.id === promptId)
    if(selected) {

      setInput(selected.template)
    }

  }






  return (
    <div className='min-h-screen flex flex-col'>
      <header className='px-6 py-3 flex items-center justify-between border-b'>
        <h1 className='text-xl font-bold '>upload.ia</h1>

        <div className='flex items-center gap-3'>
          <span className='text-sm text-muted-foreground'>
            Desenvolvido com 💜 no NLW da Rocketseat
          </span>
          <Separator orientation='vertical' className='h6'></Separator>
          <Button variant={'outline'}>
            <Github className='w-4 h-4 mr-2' />
            Github
          </Button>
        </div>
      </header>

      <main className='flex-1 p-6 flex  gap-6'>
        <div className='flex flex-col flex-1 gap-4'>
          <div className='grid grid-rows-2 gap-4 flex-1'>
            <Textarea
              className='resize-none p-5 leading-relaxed '
              placeholder='Inclua o prompt para a IA...'
              value={input}
              onChange={handleInputChange}
            />

            <Textarea
              className='resize-none p-5 leading-relaxed '
              placeholder='Resultado gerado pela IA...'
              readOnly
              value={completion}
            />
          </div>
          <p className='text-sm text-muted-foreground'>
            Lembre se: você pode utilizar a variável{' '}
            <code className='text-violet-400'>{'{transcription}'}</code> no seu
            prompt para adcionar o contúdo da transcrição do vídeo selecionado.
          </p>
        </div>

        <aside className='w-80 space-y-6 '>
          
    <VideoInputForm onVideoUploaded={setVideoId}  />
          <Separator />
          <form
          onSubmit={handleSubmit}
           className='space-y-6'>
            <div className='space-y-2'>
              <Label>Prompt</Label>
              <Select  onValueChange={handlePromptSelected} >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um prompt...' />
                </SelectTrigger>
                <SelectContent>

                {
       
       prompts.map(prompt => {
         return (
             <SelectItem key={prompt.id}  value={prompt.id}>
         {prompt.title}
       </SelectItem>
         )
       })
       }
                 
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className='space-y-2'>
              <Label>Modelo</Label>
              <Select disabled defaultValue='gpt-3.5'>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='gpt-3.5'>GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className='block text-xs text-muted-foregrond italic '>
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className='space-y-4'>
              <Label>Temperatura</Label>
              <Slider value={[temperature]}  min={0} max={1} step={0.1}
              onValueChange={value => setTemperature(value[0]) }
              />
              <span className='block text-xs text-muted-foregrond italic leading-relaxed'>
                Valores mais altos tendem a deixar os resultados mais criativos,
                mas com possiveis erros
              </span>
            </div>
            <Separator />
            <Button disabled={isLoading} type='submit' className='w-full'>
              Executar
              <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
