import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserForm } from "@/components/admin/usuarios/UserForm";
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

export default function NovoUsuario() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const cpfCnpj = data.documento.replace(/\D/g, "");
      const celular = data.telefone.replace(/\D/g, "");

      await usuariosService.criar({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        nivel: data.tipo === "Administrador" ? "administrador" : "cliente",
        ...(cpfCnpj ? { cpfCnpj } : {}),
        ...(celular ? { celular } : {}),
      });

      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Criar novo usuário</h1>
        <p className="text-sm text-gray-500 mt-1">
          Preencha os campos abaixo para configurar o novo usuário.
        </p>
      </div>
      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/usuarios")}
        saving={saving}
      />
    </div>
  );
}
