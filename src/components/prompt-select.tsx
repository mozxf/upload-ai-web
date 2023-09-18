import { api } from "@/lib/axios"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { useEffect, useState } from "react"






type TPrompt = {
    id: string;
    title: string;
    template: string;
}




export  const PromptSelect =  () => {
    const [prompts, setPrompts] = useState<TPrompt[]>([])

    useEffect(() => {
         api.get('/prompts').then((res => {
            
            setPrompts(res.data)
        }))
    },[])



    return (
    <Select>
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
  </Select>)
}