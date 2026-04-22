import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ServicoForm, { type ServicoFormData } from "@/components/sections/admin/servicos/ServicoForm"
import { servicosService } from "@/services/servicoService"


export default function NovoServicoCMS() {
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)

  function parseMoeda(valor: string): number {
    if (!valor) return 0

    return Number(
      valor
        .replace(/\./g, "")
        .replace(",", ".")
    )
  }

  const handleSubmit = async (data: ServicoFormData) => {
    setSalvando(true);

    try {
      await servicosService.criar({
        nome: data.nome,
        descricao: data.descricao,
        valorBase: parseMoeda(data.valorBase),
        prazoEstimadoDias: Number(data.prazoEstimado),
        ativo: data.status === "Ativo",
      });

      navigate("/admin/servicos");
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="p-1">
      <ServicoForm
        mode="criar"
        onSubmit={handleSubmit}
        salvando={salvando}
      />
    </div>
  )
}