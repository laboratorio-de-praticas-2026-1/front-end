import { useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { vehicleSchema } from "../schemas/vehicleSchema";
import type { VehicleFormData } from "../schemas/vehicleSchema";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema) as Resolver<VehicleFormData>,
  });

  if (!isOpen) return null;

  const handleRegistration: SubmitHandler<VehicleFormData> = async (data) => {
    setIsLoading(true);
    try {
      console.log("Payload limpo:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      reset();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">Novo veículo</h2>
            <p className="text-sm text-gray-500">Preencha os campos abaixo com os dados do seu veículo</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleRegistration)} className="p-6 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Placa do veículo</label>
            <input
              {...register("placa")}
              placeholder="placa..."
              className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-black ${
                errors.placa ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.placa && <span className="text-xs text-red-500 font-medium">{errors.placa.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">RENAVAM</label>
              <input
                {...register("renavam")}
                placeholder="renavam..."
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-black ${
                  errors.renavam ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.renavam && <span className="text-xs text-red-500 font-medium">{errors.renavam.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Marca</label>
              <input
                {...register("marca")}
                placeholder="marca..."
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-black ${
                  errors.marca ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.marca && <span className="text-xs text-red-500 font-medium">{errors.marca.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Modelo</label>
              <input
                {...register("modelo")}
                placeholder="modelo..."
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-black ${
                  errors.modelo ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.modelo && <span className="text-xs text-red-500 font-medium">{errors.modelo.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Ano de fabricação</label>
              <input
                type="number"
                {...register("anoFabricacao", { valueAsNumber: true })}
                placeholder="ano de fabricação..."
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-black ${
                  errors.anoFabricacao ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.anoFabricacao && <span className="text-xs text-red-500 font-medium">{errors.anoFabricacao.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Ano do Modelo</label>
            <input
              type="number"
              {...register("anoModelo", { valueAsNumber: true })}
              placeholder="ano do modelo..."
              className={`p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-black ${
                errors.anoModelo ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.anoModelo && <span className="text-xs text-red-500 font-medium">{errors.anoModelo.message}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#3979A5] hover:bg-[#2d5f82] text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? "Salvando..." : "Salvar veículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}