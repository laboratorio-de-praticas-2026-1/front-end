import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { FileText, Loader2, Printer, ToggleRight, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { faqSchema, type FAQFormData } from './faq.schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from '@hookform/resolvers/zod';
import { FAQ_CATEGORIES_MOCK, FAQ_MOCK_DATA } from "@/mocks/faq.mocks"; 
import type { FAQCategoryOption } from '@/types/faq.types';
import { ConfirmDeleteModalFaq } from './ConfirmDeleteModal';
import { toast } from 'sonner';

export default function EditarFAQ() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [catOptions, setCatOptions] = useState<FAQCategoryOption[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      pergunta: "",
      resposta: "",
      categoria: "",
      status: true,
    }
  });

  const status = watch("status");

  useEffect(() => {
    const options = FAQ_CATEGORIES_MOCK;
    setCatOptions(options);

    if (!id) return;

    const data = FAQ_MOCK_DATA.find((item) => {
      const itemId = item.id.replace("#", "");
      const routeId = String(id).replace("#", "");
      return itemId === routeId;
    });

    if (!data) return;

    // 🔥 garante que categoria existe no select
    const categoriaMatch = options.find(
      (cat) => cat.value === data.categoria
    );

    reset({
      pergunta: data.pergunta,
      resposta: data.resposta,
      categoria: categoriaMatch?.value || "",
      status: data.status === "Ativo",
    });

  }, [id, reset]);

  const onSubmit = async (data: FAQFormData) => {
    setLoading(true);
    try {

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const payload = {
        ...data,
        id,
        status: data.status ? "Ativo" : "Inativo",
        dataAtualizacao: new Date().toISOString(),
      };

      console.log("Payload enviado:", payload);
      navigate("/admin/faq");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
  try {
    // Simulação de chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Logica de exclusão (aqui entraria sua chamada axios/fetch)
    console.log(`Item ${id} excluído com sucesso`);

    // Redireciona o usuário após a exclusão bem-sucedida
    navigate("/admin/faq");
  } catch (erro) {
    // O modal já trata o toast.error internamente se a promise falhar, 
    // mas você pode lançar o erro novamente se precisar de algo específico aqui.
    throw erro;
  }
};

  return (
    <div className="min-h-screen text-muted-foreground animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            Detalhes da pergunta
            #{id}
            <span className={`px-3 py-1 text-xs rounded-full text-white max-w-[65px] ${status ? 'bg-green-500' : 'bg-gray-400'}`}>
              {status ? "Ativo" : "Inativo"}
            </span>
          </h1>
          <p className="text-sm text-gray-500">Gerencie e atualize as informações desta pergunta.</p>
        </div>

        <Button 
          type="button"
          variant={'destructive'} 
          className='text-white font-semibold cursor-pointer'
          onClick={() => setIsDeleteModalOpen(true)}
          >
          <Trash size={20} />
          Excluir
        </Button>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <section className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 p-4 border-b border-gray-300 bg-gray-50">
            <FileText size={22} className="text-secondary" />
            <h2 className="font-semibold text-gray-800">Conteúdo principal</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Pergunta */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Pergunta <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("pergunta")}
                disabled={loading}
                className={errors.pergunta ? "border-red-500" : ""}
              />
              {errors.pergunta && <span className="text-xs text-red-500">{errors.pergunta.message}</span>}
            </div>

            {/* Resposta */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Resposta <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register("resposta")}
                disabled={loading}
                className={`min-h-[120px] ${errors.resposta ? "border-red-500" : ""}`}
              />
              {errors.resposta && <span className="text-xs text-red-500">{errors.resposta.message}</span>}
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Categoria <span className="text-red-500">*</span>
              </label>

              <Controller
                name="categoria"
                control={control}
                defaultValue="" // 🔥 obrigatório
                render={({ field }) => (
                  <Select
                    key={field.value} // 🔥 força render
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full bg-white border-gray-200 text-left">
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
                )}
              />

              {errors.categoria && (
                <span className="text-xs text-red-500">
                  {errors.categoria.message}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm p-6 flex flex-col items-center gap-6 md:flex-row md:justify-between">
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setValue("status", !status, { shouldValidate: true })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                status ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  status ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span className="text-sm font-semibold text-gray-800">
              {status ? "ATIVO" : "INATIVO"}
            </span>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 flex flex-col-reverse md:flex-row justify-end items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-full md:w-auto h-11 px-6 border-none rounded-lg font-medium text-black cursor-pointer"
          >
            Cancelar alterações
          </Button>

          <Button
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-primary text-white font-semibold h-11 px-6 rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Printer size={22} />}
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </footer>
      </form>
      <ConfirmDeleteModalFaq
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        title="Excluir Pergunta?"
        description={
          <>
            Tem certeza que deseja excluir a pergunta{" "}
            <span className="font-bold text-muted-fore">
              #{id}
            </span>
            ?<br />
            A pergunta será removida do blog imediatamente.
          </>
        }
      />
    </div>
  );
}