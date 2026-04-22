import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserForm } from "@/components/admin/usuarios/UserForm";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { usuariosService } from "@/services/usuariosService";

type FormData = {
  nome: string;
  email: string;
  documento: string;
  telefone: string;
  tipo: "Administrador" | "Cliente";
  senha: string;
  confirmarSenha: string;
};

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<Partial<FormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    usuariosService.buscarPorId(Number(id)).then((user) => {
      if (!user) return navigate("/admin/usuarios");
      setInitialData({
        nome: user.nome,
        email: user.email,
        documento: user.cpf_cnpj ?? "",
        telefone: user.celular ?? "",
        tipo: user.nivel === "administrador" ? "Administrador" : "Cliente",
        senha: "",
        confirmarSenha: "",
      });
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const payload = {
        nome: data.nome,
        email: data.email,
        cpfCnpj: data.documento.replace(/\D/g, ""),
        celular: data.telefone.replace(/\D/g, ""),
        ...(data.senha ? { senha: data.senha } : {}),
      };
      await usuariosService.atualizar(Number(id), payload);
      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => setDeleteModalOpen(true);

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await usuariosService.deletar(Number(id));
      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading || !initialData) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Carregando usuário...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Detalhes do usuário #{id}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie e atualize as informações deste usuário.
        </p>
      </div>

      <UserForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/usuarios")}
        onDelete={handleDeleteClick}
        saving={saving}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={initialData.nome ?? ""}
        loading={deleteLoading}
      />
    </div>
  );
}
