import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ServicoForm, { type ServicoFormData } from "@/components/sections/admin/servicos/ServicoForm"

export default function NovoServicoCMS() {
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)

  const handleSubmit = async (data: ServicoFormData) => {
    setSalvando(true)
    try {
      // TODO: integração com API
      console.log("Criar serviço:", data)
      await new Promise((res) => setTimeout(res, 500)) // simula delay
      navigate("/admin/servicos")
    } catch (error) {
      console.error("Erro ao criar serviço:", error)
    } finally {
      setSalvando(false)
    }
  }

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