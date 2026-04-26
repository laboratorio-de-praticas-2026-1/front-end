import { z } from "zod";

export const faqSchema = z.object({
  pergunta: z.string().min(1, "Pergunta é obrigatória"),
  resposta: z.string().min(1, "Resposta é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  status: z.boolean(), // ativo/inativo
});

export type FAQFormData = z.infer<typeof faqSchema>;