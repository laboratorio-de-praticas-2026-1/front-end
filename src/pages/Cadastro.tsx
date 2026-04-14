import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import vectorWhiteLogo from "@/assets/vector-white-logo.png";
import vectorHuman from "@/assets/vector-human.png";

export function Cadastro() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    documento: "",
    celular: "",
    email: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "documento") {
      const numbers = value.replace(/\D/g, "");
      if (numbers.length <= 11) {
        formattedValue = numbers
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else {
        formattedValue = numbers
          .replace(/^(\d{2})(\d)/, "$1.$2")
          .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
          .replace(/\.(\d{3})(\d)/, ".$1/$2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      }
    }

    if (name === "celular") {
      const numbers = value.replace(/\D/g, "");
      formattedValue = numbers
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleNextStep = () => {
    const { nome, documento, celular } = formData;
    if (!nome.trim() || !documento.trim() || !celular.trim()) {
      alert("Preencha todos os campos da etapa 1 antes de continuar.");
      return;
    }
    setCurrentStep(2);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const { email, senha } = formData;
    if (!email.trim() || !senha.trim()) {
      alert("Preencha e-mail e senha.");
      return;
    }
    console.log("Dados completos do cadastro:", formData);
  };

  return (
    <div className="relative flex min-h-screen flex-col md:flex-row">
      <div className="absolute left-6 top-6 z-10">
        <img src={vectorWhiteLogo} alt="Logo BRTN" className="h-16 w-auto" />
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#326E98] px-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Cadastro</h1>
          <p className="mb-6 text-gray-500">
            Crie sua conta e resolva suas pendências em poucos cliques!
          </p>

          <form onSubmit={handleRegister}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <Input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CPF ou CNPJ
                  </label>
                  <Input
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    placeholder="Digite seu CPF ou CNPJ..."
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Celular
                  </label>
                  <Input
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    placeholder="Digite seu número de celular..."
                    required
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-[#3979A5] hover:bg-[#2f678d] text-white"
                >
                  Continuar
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite seu e-mail..."
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      value={formData.senha}
                      onChange={handleChange}
                      placeholder="Digite sua senha..."
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#3979A5] hover:bg-[#2f678d] text-white"
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </form>

          <div className="mt-6 flex justify-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                currentStep === 1 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-2 w-2 rounded-full ${
                currentStep === 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          </div>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Já tenho uma conta
            </Link>
          </div>
        </div>
      </div>


      <div className="hidden md:block md:flex-1 bg-[#326E98]">
        <div className="h-full w-full overflow-hidden rounded-3xl">
          <img
            src={vectorHuman}
            alt="Homem com documento"
            className="h-full w-full object-cover block"
          />
        </div>
      </div>
    </div>
  );
}