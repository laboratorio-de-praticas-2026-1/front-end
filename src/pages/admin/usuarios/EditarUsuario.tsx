import { useNavigate, useParams } from "react-router-dom";
import { UserForm } from "@/components/admin/usuarios/UserForm";

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

  const handleSubmit = (data: any) => {
    console.log(`Salvar usuário ${id}:`, data);
    navigate("/admin/usuarios");
  };

  const handleDelete = () => {
    console.log(`Excluir usuário ${id}`);
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

        {/* 🔥 TEXTO CORRETO NO LUGAR DO "ATIVO" */}
        <p className="text-sm text-gray-500 mt-1">
          Gerencie e atualize as informações deste usuário.
        </p>
      </div>

      <UserForm
        mode="edit"
        initialData={usuario}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    </div>
  );
}