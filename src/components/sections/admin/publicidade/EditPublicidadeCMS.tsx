"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Info, Image as ImageIcon, Plus, Save } from 'lucide-react';
import PreviewImage from "@/assets/mock-add-image.png";
import { Button } from "@/components/ui/button";

import { publicidadeService } from "@/services/publicidadeService";

export default function EditPublicidadeCMS() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState(PreviewImage);
  
  const [arquivoParaEnvio, setArquivoParaEnvio] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      carregarPublicidade(Number(id));
    }
  }, [id]);

  const carregarPublicidade = async (pubId: number) => {
    try {
      const pub = await publicidadeService.buscarPorId(pubId);
      if (pub) {
        setTitulo(pub.titulo || "");
        setConteudo(pub.conteudo || "");
        if (pub.imagem) {
          setSelectedImage(pub.imagem);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar publicidade:", error);
    } finally {
      setCarregandoDados(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
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
    if (!titulo || !conteudo) {
      alert("Por favor, preencha o título e o conteúdo da publicidade.");
      return;
    }

    setSalvando(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("conteudo", conteudo);
      
      if (arquivoParaEnvio) {
        formData.append("imagem", arquivoParaEnvio);
      }

      await publicidadeService.atualizar(Number(id), formData);
      navigate(-1);

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Ocorreu um erro ao atualizar a publicidade no servidor.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregandoDados) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando dados da publicidade...</div>;
  }

  return (
    <div className="min-h-screen p-8 text-muted-foreground animate-in fade-in duration-500">
      
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">Editar publicidade #{id}</h1>
        <p className="text-sm text-gray-500">Altere os campos abaixo para atualizar sua publicidade.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <div className="lg:col-span-2 space-y-6 h-full">
          <section className="bg-white rounded-lg border border-gray-300 overflow-hidden h-full shadow-sm">
            <div className="flex items-center gap-2 p-4 border-b border-gray-300 bg-gray-50">
              <Info size={20} className="text-secondary" />
              <h2 className="font-semibold text-gray-800">Informações da publicidade</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Título da publicidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Ex: Nova promoção..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Conteúdo da publicidade <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={17}
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Escreva o conteúdo da publicidade aqui..."
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
              <p className="mt-4 text-[12px] text-gray-400 text-center">
                Tamanho recomendado: 1200x630px (máx. 2MB)
              </p>
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
          {salvando ? "Salvando alterações..." : "Salvar alterações"}
        </Button>
      </footer>
    </div>
  );
}
