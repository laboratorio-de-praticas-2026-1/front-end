import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserForm } from "@/components/admin/usuarios/UserForm";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

const mockUsuario = {
  id: "001",
  nome: "Amanda Costa",
  email: "amanda.costa@gmail.com",
  documento: "123.456.789-00",
  telefone: "(11) 99999-8888",
  tipo: "Administrador" as const,
};

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = mockUsuario;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Usuário ${id} excluído com sucesso`);
      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleSubmit = (data: any) => {
    console.log(`Salvar usuário ${id}:`, data);
    navigate("/admin/usuarios");
  };

  const handleCancel = () => {
    navigate("/admin/usuarios");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Detalhes do usuário #{usuario.id}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie e atualize as informações deste usuário.
        </p>
      </div>

      <UserForm
        mode="edit"
        initialData={usuario}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={handleDeleteClick} 
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={usuario.nome}
        loading={deleteLoading}
      />
    </div>
  );
}