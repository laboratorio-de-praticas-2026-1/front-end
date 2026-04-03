import { useState } from "react";
import { Mail, MapPin, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactForm(){
    const [formData, setFormData] = useState({
        nome:"",
        email:"",
        telefone:"",
        mensagem:"",
    })

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ){
        const{name,value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
    }

    return(
        <section className="relative z-20 pb-10">
            <div className="container mx-auto px-4 md:px-48">
                <div className="grid items-start gap-8 md:grid-cols-2">
                    {/* Infos de contato */}
                    <div className="px-2 pt-4">
                        <p className="text-2xl font-light uppercase tracking-wide text-[#242424]">
                            Ficou interessado?
                        </p>

                        <h3 className="mt-1 max-w-md text-2xl font-semibold uppercase leading-tight text-secondary">
                            Entre em contato agora mesmo!
                        </h3>

                        <div className="mt-8 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                                    <FaWhatsapp size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary">WhatsApp</p>
                                    <p className="text-sm text-secondary">(13) 8888-9999</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/30 text-white">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary">E-mail</p>
                                    <p className="text-sm text-secondary">bortone@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary">Onde estamos?</p>
                                    <p className="text-sm text-secondary">Rua aaaaaaaa, 000 - Loja 1</p>
                                    <p className="text-sm text-secondary">yyyyy, Registro / SP</p>
                                    <p className="text-sm text-secondary">CEP: 11940-000(13) 8888-9999</p>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* formulario */}
                    <div className="">
                        <div className="rounded-2xl bg-white p-15 shadow-[0_10px_20px_rgba(0,0,0,0.10)]">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="nome" className="text-[#09090B] font-medium">
                                        Digite seu Nome
                                    </Label>
                                    <Input 
                                        id="nome"
                                        name="nome"
                                        type="text"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Digite seu nome Aqui"
                                        className="h-11 border-[#E4E4E7] text-muted mt-1"                                   
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#09090B] font-medium">
                                            E-mail
                                        </Label>
                                        <Input 
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Seu melhor e-mail aqui"
                                        className="h-11 border-[#E4E4E7] text-muted mt-1"                                   
                                    />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone" className="text-[#09090B] font-medium">
                                            E-mail
                                        </Label>
                                        <Input 
                                        id="telefone"
                                        name="telefone"
                                        type="text"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="DDD e Telefone"
                                        className="h-11 border-[#E4E4E7] text-muted mt-1"                                   
                                    />
                                    </div>

                                </div>
                                <div className="space-y-2">
                                        <Label htmlFor="mensagem" className="text-[#09090B] font-medium">
                                            Digite sua mensagem
                                        </Label>
                                        <textarea
                                        id="mensagem"
                                        name="mensagem"
                                        value={formData.mensagem}
                                        onChange={handleChange}
                                        placeholder="Digite sua mensagem aqui"
                                        className="flex w-full rounded-md border border-[#E4E4E7] text-[#09090B] mt-1 px-3 py-3 shadow-sm min-h-[180px]"                                   
                                    />
                                    </div>

                                    <Button className="inline-flex h-11 min-w-[00px] items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-secondary" type="submit" variant="default"> 
                                        Enviar
                                        <ChevronRight size={18} />
                                    </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}


