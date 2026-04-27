import { z } from "zod";

export const empresaSchema = z.object({
  nomeFantasia: z.string().min(1, "Nome fantasia é obrigatório"),
  cnpj: z.string().min(18, "CNPJ inválido"),
  tipo: z.string().min(1, "Selecione o tipo de empresa"),
  telefone: z.string().min(14, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  site: z.string().url("URL inválida").optional().or(z.literal("")),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório (UF)"),
  latitude: z.coerce.number().refine((val) => !isNaN(val), "Latitude inválida"),
  longitude: z.coerce.number().refine((val) => !isNaN(val), "Longitude inválida"),
});

export type EmpresaFormData = z.infer<typeof empresaSchema>;