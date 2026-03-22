import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function BuscaBlog(){
    return(
        <div className="w-full flex flex-col p-10">
            <h1 className="font-bold text-secondary text-2xl mb-2">
                Blog
            </h1>

            <p className="text-muted-foreground">
                Visualize, crie, organize e acompanhe todas as postagens do seu blog.
            </p>

            <div className="w-full flex flex-col sm:flex-row justify-between mt-12 gap-5">
                <Input type="search" placeholder="Pesquisar postagem..." className="border border-input w-full  focus-visible:ring-0 h-11 sm:w-150"></Input>
                <Button className="w-50 rounded-lg h-11 text-md cursor-pointer" type="button" variant="default"> 
                    <Plus />
                    Nova postagem 

                 </Button>
            </div>
        </div>
    )
}