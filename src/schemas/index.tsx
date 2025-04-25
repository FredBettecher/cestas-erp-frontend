import { z } from "zod";

const materialSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  unitCost: z.number().min(0.01, "Custo unitário deve ser maior que zero"),
  quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
  aquisitionDate: z.date().refine((date) => date <= new Date(), {
    message: "Data de aquisição não pode ser no futuro",
  }),
  supplier: z.string().min(0),
  additionalCost: z.array(
    z.number().min(0, "Custo adicional deve ser maior que zero")
  ),
});

const basketSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.number().min(0, "Valor deve ser maior que zero"),
  quantity: z.number().min(0, "Quantidade deve ser maior que zero"),
  materials: z.array(materialSchema),
  totalCost: z.number(),
  aditionalCost: z.array(z.number()),
  taxes: z.array(z.number()),
  category: z.string().min(1, "Categoria é obrigatória"),
});

export { materialSchema, basketSchema };
