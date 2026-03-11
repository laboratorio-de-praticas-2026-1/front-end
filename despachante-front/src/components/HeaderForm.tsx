import {useForm} from "react-hook-form"
import {Form,FormItem,FormControl,FormMessage,FormField,} from "@/components/ui/form"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FormData = {
    placa: string
    email: string
}

export default function FormsHeader() {
    const form = useForm<FormData>({
        defaultValues: {
            placa: "",
            email: "",
        },
    })

    function onSubmit(data: FormData){
        alert("Formulário enviado!")
    }

    return(
        <Form {...form}>
            <form className="bg-muted rounded-3xl p-6 flex flex-col items-center  w-[95%] sm:w-[416px] h-auto  gap-4" onSubmit={form.handleSubmit(onSubmit)}>

                <h2 className="text-lg text-foreground text-center mt-2 mb-4 font-normal">
                    Consulte em poucos minutos!
                </h2>

                <FormField control={form.control} name="placa" 
                render={({field}) =>(
                    <FormItem  className="w-full">

                        <FormControl>
                            <Input type="text" placeholder="Digite sua placa" {...field} className="w-full bg-background border border-input focus-visible:ring-0 h-11 "></Input>
                        </FormControl>

                        <FormMessage />


                    </FormItem>

                )}>
                </FormField> 

                <FormField control={form.control} name="email" 
                render={({field}) =>(
                    <FormItem  className="w-full">

                        <FormControl>
                            <Input type="email" placeholder="Digite seu e-mail" {...field} className="w-full bg-background h-11 mb-2"></Input>
                        </FormControl>

                        <FormMessage />


                    </FormItem>

                )}>
                </FormField> 

                 <Button className="w-full rounded-full h-12 text-lg hover:bg-secondary" type="submit" variant="default"> 
                    Continuar 

                 </Button>


            </form>
        </Form>
    )

}

