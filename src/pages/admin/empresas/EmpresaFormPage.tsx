import { useState, useEffect } from "react";
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
import { contatoService } from "@/services/contatoService";

export const EmpresaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const formattedId = id ? id.toString().padStart(3, '0') : "";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (isEdit && id) {
      const carregarEmpresa = async () => {
        try {
          const dataList = await contatoService.buscarTodasEmpresas();
          const data = dataList.find((emp) => String(emp.id) === id);

          if (!data) {
            toast.error("Empresa não encontrada.");
            navigate("/admin/empresas");
            return;
          }

          // Converter strings para números para os campos do formulário (latitude, longitude)
          methods.reset({
            nomeFantasia: data.nomeFantasia || "",
            cnpj: data.cnpj || "",
            tipo: data.tipo || "",
            telefone: data.telefone || "",
            email: data.email || "",
            site: data.site || "",
            endereco: data.endereco || "",
            cidade: data.cidade || "",
            estado: data.estado || "",
            latitude: data.latitude ? parseFloat(data.latitude) : -24.495,
            longitude: data.longitude ? parseFloat(data.longitude) : -47.845,
          });
        } catch (error) {
          console.error("Erro ao carregar empresa:", error);
          toast.error("Erro ao carregar dados da empresa.");
        } finally {
          setLoading(false);
        }
      };
      carregarEmpresa();
    } else {
      setLoading(false);
    }
  }, [isEdit, id, methods, navigate]);

  const lat = methods.watch("latitude");
  const lng = methods.watch("longitude");
  const nomeFantasia = methods.watch("nomeFantasia");

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const validatedData = data as EmpresaFormData;

      // Converter latitude e longitude de volta para string para envio à API
      const payload = {
        ...validatedData,
        latitude: String(validatedData.latitude),
        longitude: String(validatedData.longitude),
      };

      if (isEdit && id) {
        await contatoService.atualizarDadosEmpresa(Number(id), payload);
        toast.success("Alterações salvas com sucesso!", {
          description: `A empresa ${validatedData.nomeFantasia} foi atualizada.`,
        });
        navigate("/admin/empresas");
      } else {
        // Simulação de cadastro (enquanto o backend não tem a rota POST)
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Empresa criada com sucesso!", {
          description: `${validatedData.nomeFantasia} foi registrada no sistema.`,
        });
        navigate("/admin/empresas");
      }
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      toast.error("Erro ao salvar os dados. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    // Simulação de exclusão (enquanto o backend não tem a rota DELETE)
    try {
      setIsModalOpen(false);
      toast.success("Empresa excluída com sucesso!", {
        description: "A empresa foi removida do sistema.",
      });
      navigate("/admin/empresas");
    } catch (error) {
      toast.error("Erro ao excluir empresa.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;
  }

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
              Cancelar alterações
            </button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#1E84CF] hover:bg-[#166ba8] px-10 h-11 gap-2 shadow-md transition-colors"
            >
              <Printer size={18} /> {isSubmitting ? "Salvando..." : "Salvar empresa"}
            </Button>
          </div>
        </form>
      </FormProvider>

      <ConfirmActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir empresa?"
        description={`Tem certeza que deseja excluir a empresa ${nomeFantasia || `#${formattedId}`}?\nA empresa será removida do mapa imediatamente.`}
        confirmText="Excluir"
      />
    </div>
  );
};