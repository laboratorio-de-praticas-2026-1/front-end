import { z } from "zod";

export const vehicleSchema = z.object({
  placa: z.string().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}-[0-9]{4}$/, "Placa inválida (Padrão Antigo ou Mercosul)"),
  renavam: z.string().min(9, "Mínimo 9 dígitos").max(11, "Máximo 11 dígitos").regex(/^\d+$/, "Apenas números"),
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  anoFabricacao: z.coerce.number().int().min(1900, "Ano inválido").max(new Date().getFullYear() + 1),
  anoModelo: z.coerce.number().int().min(1900, "Ano inválido").max(new Date().getFullYear() + 2),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;