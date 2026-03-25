"use client";

import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Info, Image as ImageIcon, Settings, Plus, CalendarIcon, Printer } from 'lucide-react';
import PreviewImage from "@/assets/mock-add-image.png";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function CreatePostCMS() {

  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState(PreviewImage);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-8 text-muted-foreground">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">Criar novo post</h1>
        <p className="text-sm text-gray-500">Preencha os campos abaixo para configurar e publicar sua postagem.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-2 space-y-6 h-full">
          <section className="bg-white rounded-lg border border-gray-300 overflow-hidden h-full">
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
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Conteúdo do post <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={17}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Coluna da Direita: Sidebar de Configurações */}
        <div className="space-y-6">

          {/* Imagem de Destaque */}
          <section className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-300 bg-gray-50">
              <ImageIcon size={20} className="text-secondary" />
              <h2 className="font-semibold text-gray-800">Imagem de destaque</h2>
            </div>
            <div className="p-6">
              <input
                type="file"
                className="hidden" // Deixa invisível
                ref={fileInputRef} // Conecta a referência
                onChange={handleImageChange} // Avisa quando o usuário escolher algo
                accept="image/*"
              />
              <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-50 transition-colors group">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="h-full inset-0 flex items-end overflow-hidden rounded-lg border-2 border border-gray-300/20">
                </img>

                <div className="absolute z-10 bg-white p-3 rounded-full shadow-md group-hover:scale-110 transition-transform">
                  <Plus size={32} className="text-secondary" />
                </div>
              </div>
              <p className="mt-4 text-[12px] text-gray-400 text-center">
                Tamanho recomendado: 1200x630px (máx. 2MB)
              </p>
            </div>
          </section>

          {/* Configurações */}
          <section className="bg-white rounded-lg border border-gray-300 overflow-hidden">
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
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Field className="w-full">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="justify-start font-normal pl-9"
                        >
                          {date ? date.toLocaleDateString() : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          defaultMonth={date}
                          onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  Se nenhuma data for inserida, será publicado imediatamente ao salvar.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

{/* Footer de Ações */}
      <footer className="mt-12 flex justify-end items-center gap-4">
        
        {/* Botão Cancelar: Efeito suave de opacidade */}
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="cursor-pointer transition-opacity hover:opacity-70 active:opacity-100"
        >
          Cancelar criação
        </Button>

        {/* Botão Criar: Efeito de brilho e leve expansão que não afeta o layout */}
        <Button 
          type="submit"
          className="cursor-pointer bg-primary text-white font-bold shadow-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
        >
          <Printer size={18}/>
          Criar postagem
        </Button>

      </footer>

    </div>
  );
}