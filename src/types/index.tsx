import { z } from "zod";
import { materialSchema, basketSchema } from "@/schemas";

type Material = z.infer<typeof materialSchema>;

type Basket = z.infer<typeof basketSchema>;

export type { Material, Basket };
