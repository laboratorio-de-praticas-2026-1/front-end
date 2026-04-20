import { useNavigate } from "react-router-dom";
import { UserForm } from "@/components/admin/usuarios/UserForm";

export default function NovoUsuario() {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log("Criar usuário:", data);
    // Futuramente enviar para API
    navigate("/admin/usuarios");
  };

  const handleCancel = () => {
    navigate("/admin/usuarios");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Criar novo usuário</h1>
        <p className="text-sm text-gray-500 mt-1">Preencha os campos abaixo para configurar o novo usuário.</p>
      </div>
      <UserForm mode="create" onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}