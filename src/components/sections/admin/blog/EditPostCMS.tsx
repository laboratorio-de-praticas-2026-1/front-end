"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Info, Image as ImageIcon, Settings, Plus, CalendarIcon, Save } from 'lucide-react';
import PreviewImage from "@/assets/mock-add-image.png";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { blogService } from "@/services/blogService";

export default function EditPostCMS() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL
  
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>(PreviewImage);
  const [arquivoParaEnvio, setArquivoParaEnvio] = useState<File | null>(null);

  // Busca os dados do post assim que a tela abre
  useEffect(() => {
    const buscarPost = async () => {
      if (!id) return;
      try {
        const post = await blogService.buscarPorId(Number(id));
        if (post) {
          setTitulo(post.titulo);
          setConteudo(post.conteudo);
          
          if (post.dataPublicacao) {
            // Parseia a data como horário local para evitar deslocamento de 1 dia causado pela interpretação em UTC
            const parts = post.dataPublicacao.split('T')[0].split('-');
            setDate(new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
          }
          if (post.imagem) {
            setSelectedImage(post.imagem);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar post:", error);
        alert("Não foi possível carregar os dados desta postagem.");
        navigate(-1);
      } finally {
        setCarregandoDados(false);
      }
    };

    buscarPost();
  }, [id, navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]; // Extrai o arquivo real (File/Blob)
      setArquivoParaEnvio(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarEdicao = async () => {
    if (!titulo || !conteudo || !id) {
      alert("Por favor, preencha o título e o conteúdo da postagem.");
      return;
    }

    setSalvando(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("conteudo", conteudo);
      
      const dataPostagem = date ? date : new Date();
      // Formata a data usando componentes locais (YYYY-MM-DD) para não converter para UTC via toISOString()
      const pad = (n: number) => String(n).padStart(2, '0');
      const dataFormatada = `${dataPostagem.getFullYear()}-${pad(dataPostagem.getMonth() + 1)}-${pad(dataPostagem.getDate())}`;
      formData.append("dataPublicacao", dataFormatada);

      // Só envia a imagem se o usuário escolheu uma foto NOVA
      if (arquivoParaEnvio) {
        formData.append("imagem", arquivoParaEnvio);
      }

      await blogService.atualizar(Number(id), formData);
      navigate(-1);

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Ocorreu um erro ao atualizar a postagem no servidor.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregandoDados) {
    return <div className="p-8 text-center text-zinc-500">Carregando dados da postagem...</div>;
  }

  return (
    <div className="min-h-screen p-8 text-muted-foreground animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">Editar postagem</h1>
        <p className="text-sm text-gray-500">Altere os campos abaixo para atualizar sua postagem.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6 h-full">
          <section className="bg-white rounded-lg border border-gray-300 overflow-hidden h-full shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-gray-300 bg-gray-50">
              <Info size={20} className="text-secondary" />
              <h2 className="font-semibold text-gray-800">Informações do post</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Título do post <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Conteúdo do post <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={17}
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-gray-300 bg-gray-50">
              <ImageIcon size={20} className="text-secondary" />
              <h2 className="font-semibold text-gray-800">Imagem de destaque</h2>
            </div>
            <div className="p-6">
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
              />
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="h-full w-full object-cover inset-0 flex items-end overflow-hidden rounded-lg border-2 border-gray-300/20"
                />
                <div className="absolute z-10 bg-white p-3 rounded-full shadow-md group-hover:scale-110 transition-transform opacity-90">
                  <Plus size={24} className="text-secondary" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-gray-300 bg-gray-50">
              <Settings size={20} className="text-secondary" />
              <h2 className="font-semibold text-gray-800">Configurações</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  Data de publicação
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                  <Field className="w-full">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start font-normal pl-10 cursor-pointer"
                        >
                          {date ? date.toLocaleDateString('pt-BR') : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          defaultMonth={date}
                          onSelect={(newDate) => { setDate(newDate); setOpen(false); }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-12 flex justify-end items-center gap-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={() => navigate(-1)} 
          disabled={salvando}
          className="cursor-pointer transition-opacity hover:opacity-70 active:opacity-100 disabled:opacity-50 h-11 px-6 rounded-lg font-medium"
        >
          Cancelar
        </Button>

        <Button 
          type="button"
          onClick={handleSalvarEdicao}
          disabled={salvando}
          className="cursor-pointer bg-secondary text-white font-bold shadow-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 h-11 px-6 rounded-lg"
        >
          <Save size={18} />
          {salvando ? "Atualizando..." : "Atualizar postagem"}
        </Button>
      </footer>
    </div>
  );
}