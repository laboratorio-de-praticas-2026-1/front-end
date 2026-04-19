import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import vectorWhiteLogo from "@/assets/vector-white-logo.png";
import vectorHuman from "@/assets/vector-human.png";
import { loginUsuario } from "@/services/authService";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { nivel } = await loginUsuario({ email, senha });
      navigate(nivel === "administrador" ? "/admin" : "/cliente/inicio");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col md:flex-row">
      <div className="absolute left-6 top-6 z-10">
        <img src={vectorWhiteLogo} alt="Logo BRTN" className="h-16 w-auto" />
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#326E98] px-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Login</h1>
          <p className="mb-6 text-gray-500">
            Resolva suas pendências em poucos cliques!
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha..."
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
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

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#3979A5] hover:bg-[#2f678d] text-white disabled:opacity-60"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/cadastro"
              className="text-sm text-blue-600 hover:underline"
            >
              Ainda não tenho uma conta
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