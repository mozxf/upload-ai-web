import { Button } from './components/ui/button';
import { Github, FileVideo, Upload, Wand2 } from 'lucide-react';
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

export function App() {
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
            />

            <Textarea
              className='resize-none p-5 leading-relaxed '
              placeholder='Resultado gerado pela IA...'
              readOnly
            />
          </div>
          <p className='text-sm text-muted-foreground'>
            Lembre se: você pode utilizar a variável{' '}
            <code className='text-violet-400'>{'{transcription}'}</code> no seu
            prompt para adcionar o contúdo da transcrição do vídeo selecionado.
          </p>
        </div>

        <aside className='w-80 space-y-6 '>
          <form className='space-y-6'>
            <label
              className='border w-full flex flex-col gap-2 text-sm items-center justify-center text-muted-foreground  cursor-pointer border-dashed rounded-md aspect-video hover:bg-primary/5'
              htmlFor='video'
            >
              <FileVideo className='2-4 h-4' />
              Selecione um video
            </label>
            <input
              className='sr-only'
              type='file'
              id='video'
              accept='video/mp4'
            />
            <Separator />
            <div className='space-y-2'>
              <Label htmlFor='transcriptionPrompt'>
                {' '}
                Prompt de transcrição
              </Label>
              <Textarea
                id='transcriptionPrompt'
                className='h-20 leading-relaxed resize-none'
                placeholder='Inclua palavras-chave mencionadas no video separadas por virgula (,)'
              />
            </div>
            <Button type='submit' className='w-full'>
              Carregar Video <Upload className='w-4 h-4 ml-2 '></Upload>
            </Button>
          </form>

          <Separator />
          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um prompt...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='title'>Titulo do Youtube</SelectItem>
                  <SelectItem value='description'>
                    Descrição do Youtube
                  </SelectItem>
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
              <Slider min={0} max={1} step={0.1} />
              <span className='block text-xs text-muted-foregrond italic leading-relaxed'>
                Valores mais altos tendem a deixar os resultados mais criativos,
                mas com possiveis erros
              </span>
            </div>
            <Separator />
            <Button type='submit' className='w-full'>
              Executar
              <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
