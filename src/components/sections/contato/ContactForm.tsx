import { useState } from "react";
import { Mail, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { contatoService, type ContatoEmpresa } from "@/services/contatoService";

interface ContactFormProps {
  empresa: ContatoEmpresa | null;
  loading: boolean;
}

export default function ContactForm({ empresa, loading }: ContactFormProps){
    const [formData, setFormData] = useState({
        nome:"",
        email:"",
        telefone:"",
        mensagem:"",
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ){
        const{name,value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (!formData.nome.trim() || !formData.email.trim() || !formData.mensagem.trim()) {
            toast.error("Preencha todos os campos obrigatórios.", {
                description: "Nome, e-mail e mensagem são obrigatórios.",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await contatoService.enviarContato({
                nome: formData.nome,
                email: formData.email,
                telefone: formData.telefone || undefined,
                mensagem: formData.mensagem,
            });

            toast.success("Mensagem enviada com sucesso!", {
                description: "Entraremos em contato em breve.",
            });

            setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
        } catch (error) {
            console.error("Erro ao enviar contato:", error);
            toast.error("Erro ao enviar mensagem.", {
                description: "Tente novamente mais tarde.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const telefoneExibido = loading ? "Carregando..." : (empresa?.telefone || "—");
    const emailExibido = loading ? "Carregando..." : (empresa?.email || "—");
    const enderecoExibido = loading ? "Carregando..." : (empresa?.endereco || "—");
    const cidadeEstado = loading ? "" : `${empresa?.cidade || ""}${empresa?.estado ? `, ${empresa.estado}` : ""}`;

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
                                    <p className="text-sm text-secondary">{telefoneExibido}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/30 text-white">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary">E-mail</p>
                                    <p className="text-sm text-secondary">{emailExibido}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary">Onde estamos?</p>
                                    <p className="text-sm text-secondary">{enderecoExibido}</p>
                                    {cidadeEstado && (
                                        <p className="text-sm text-secondary">{cidadeEstado}</p>
                                    )}
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
                                        className="h-11 border-[#E4E4E7]  mt-1"
                                        disabled={isSubmitting}
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
                                        className="h-11 border-[#E4E4E7]  mt-1"
                                        disabled={isSubmitting}
                                    />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone" className="text-[#09090B] font-medium">
                                            Telefone
                                        </Label>
                                        <Input 
                                        id="telefone"
                                        name="telefone"
                                        type="text"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="DDD e Telefone"
                                        className="h-11  border-[#E4E4E7]  mt-1"
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
                                    />
                                    </div>

                                    <Button
                                        className="inline-flex h-11 min-w-[00px] items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                        type="submit"
                                        variant="default"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin mr-2" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                Enviar
                                                <ChevronRight size={18} />
                                            </>
                                        )}
                                    </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}
