import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Trash2, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { empresaSchema } from "@/schemas/empresa.schema";
import type { EmpresaFormData } from "@/schemas/empresa.schema";

import { CompanyDataForm } from "./components/CompanyDataForm";
import { ContactForm } from "./components/ContactForm";
import { LocationForm } from "./components/LocationForm";
import { MapViewer } from "./components/MapViewer";
import { ConfirmActionModal } from "./components/ConfirmActionModal";

export const EmpresaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const formattedId = id ? id.toString().padStart(3, '0') : "";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const methods = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema) as any,
    mode: "onChange",
    defaultValues: {
      nomeFantasia: "",
      cnpj: "",
      tipo: "",
      telefone: "",
      email: "",
      site: "",
      endereco: "",
      cidade: "",
      estado: "",
      latitude: -24.495,
      longitude: -47.845,
    },
  });

  const lat = methods.watch("latitude");
  const lng = methods.watch("longitude");
  const nomeFantasia = methods.watch("nomeFantasia");

  const onSubmit = async (data: any) => {
    try {
      const validatedData = data as EmpresaFormData;
      
      toast.success(isEdit ? "Alterações salvas com sucesso!" : "Empresa criada com sucesso!", {
        description: `${validatedData.nomeFantasia} foi registrada no sistema.`,
      });
      
      navigate("/admin/empresas");
    } catch (error) {
      toast.error("Erro ao salvar os dados. Verifique os campos.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Empresa excluída com sucesso!");
      navigate("/admin/empresas");
    } catch (error) {
      toast.error("Erro ao excluir empresa.");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#001f3f]">
            {isEdit ? `Detalhes da empresa #${formattedId}` : "Criar nova empresa"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEdit 
              ? "Gerencie e atualize as informações desta empresa." 
              : "Preencha os campos abaixo para adicionar uma empresa ao seu mapa."}
          </p>
        </div>
        {isEdit && (
          <Button 
            type="button"
            variant="destructive" 
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-[#d9534f] hover:bg-red-600 shadow-sm"
          >
            <Trash2 size={18} /> Excluir
          </Button>
        )}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CompanyDataForm />
              <LocationForm />
            </div>

            <div className="space-y-6">
              <ContactForm />
              <MapViewer lat={Number(lat) || -24.495} lng={Number(lng) || -47.845} />
            </div>
          </div>

          <div className="flex justify-end items-center gap-6 pt-6">
            <button 
              type="button" 
              onClick={() => navigate("/admin/empresas")}
              className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              {isEdit ? "Cancelar alterações" : "Cancelar criação"}
            </button>
            
            <Button 
              type="submit" 
              className="bg-[#1E84CF] hover:bg-[#166ba8] px-10 h-11 gap-2 shadow-md transition-colors"
            >
              <Printer size={18} /> {isEdit ? "Salvar empresa" : "Criar empresa"}
            </Button>
          </div>
        </form>
      </FormProvider>

      <ConfirmActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Excluir empresa?"
        description={`Tem certeza que deseja excluir a empresa ${nomeFantasia || `#${formattedId}`}?\nA empresa será removida do mapa imediatamente.`}
        confirmText="Excluir"
      />
    </div>
  );
};