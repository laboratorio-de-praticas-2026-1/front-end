import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { FileText, Loader2, Printer, ToggleRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { faqSchema, type FAQFormData } from './faq.schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';
import { FAQ_CATEGORIES_MOCK } from "@/mocks/faq.mocks"; 
import type { FAQCategoryOption } from '@/types/faq.types';



export default function NovoFAQ() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [catOptions, setCatOptions] = useState<FAQCategoryOption[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      pergunta: "",
      resposta: "",
      categoria: "",
      status: true,
    },
  });

  useEffect(() => {
    setCatOptions(FAQ_CATEGORIES_MOCK)
  }, []);

  const onSubmit = async (data: FAQFormData) => {
    setLoading(true);
    try {

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const payload = {
        ...data,
        status: data.status ? "Ativo" : "Inativo",
        dataCriacao: new Date().toISOString(),
      };

      console.log("Payload enviado:", payload);

      navigate("/admin/faq");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-muted-foreground animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-secondary">Criar nova pergunta</h1>
        <p className="text-sm text-gray-500">Preencha os campos abaixo para configurar e publicar sua pergunta e resposta.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <section className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 p-4 border-b border-gray-300 bg-gray-50">
            <FileText size={22} className="text-secondary" />
            <h2 className="font-semibold text-gray-800">Conteúdo principal</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Campo Pergunta */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Pergunta <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("pergunta")}
                disabled={loading}
                placeholder=""
                className={errors.pergunta ? "border-red-500" : ""}
              />
              {errors.pergunta && <span className="text-xs text-red-500">{errors.pergunta.message}</span>}
            </div>

            {/* Campo Resposta */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Resposta <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register("resposta")}
                disabled={loading}
                placeholder=""
                className={`min-h-[120px] ${errors.resposta ? "border-red-500" : ""}`}
              />
              {errors.resposta && <span className="text-xs text-red-500">{errors.resposta.message}</span>}
            </div>

            {/* Campo Categoria */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Categoria <span className="text-red-500">*</span>
              </label>
              <Select 
                onValueChange={(val) => setValue("categoria", val)}
              >
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {catOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && <span className="text-xs text-red-500">{errors.categoria.message}</span>}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm p-6 flex flex-col items-center gap-6 md:flex-row md:justify-between md:text-left md:gap-0">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
                    <span className="text-primary">
                        <ToggleRight size={20}/>
                    </span>     
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800">Status da pergunta</h3>
                    <p className="text-sm text-muted-foreground">
                        Perguntas inativas não aparecem no FAQ.
                    </p>
                </div>
            </div>

            {/* TOGGLE */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setValue("status", !watch("status"))}
                    className={`w-12     h-6 flex items-center rounded-full p-1 transition ${
                        watch("status") ? "bg-primary" : "bg-gray-300"
                    }`}
                >
                    <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        watch("status") ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                </button>
                        
                <span className="text-sm font-semibold text-gray-800">
                    {watch("status") ? "ATIVO" : "INATIVO"}
                </span>
            </div>

        </section>

        <footer className="mt-12 flex flex-col-reverse md:flex-row justify-end items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-full md:w-auto h-11 px-6 border-none rounded-lg font-medium text-black cursor-pointer"
          >
            Cancelar criação
          </Button>

          <Button
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-primary text-white font-semibold h-11 px-6 rounded-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Salvando...
              </>
            ) : (
              <>
              <Printer size={22} />
              Criar pergunta
              </>
            )}
          </Button>
        </footer>
      </form>
    </div>
  );
}