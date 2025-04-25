"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { materialSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { CalendarIcon, CircleCheck, CircleX, Plus, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Material } from "@/types";
import { useEffect, useState } from "react";

const MaterialRegistrationForm = () => {
  const [additionalCost, setAdditionalCost] = useState<number[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  const form = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      code: "",
      description: "",
      unitCost: 0,
      quantity: 0,
      aquisitionDate: new Date(),
      supplier: "",
      additionalCost: [],
    },
  });

  useEffect(() => {
    setTotalCost(calculateTotalCost());
  }, [form.watch(["unitCost", "quantity"]), additionalCost]);

  const addAdditionalCost = () => {
    setAdditionalCost([...additionalCost, 0]);
  };

  const removeAdditionalCost = (index: number) => {
    setAdditionalCost(additionalCost.filter((_, i) => i !== index));
  };

  const updateAdditionalCost = (index: number, value: number) => {
    const newCosts = [...additionalCost];
    newCosts[index] = value;
    setAdditionalCost(newCosts);
  };

  const calculateTotalCost = () => {
    const unitCost = Number(form.getValues("unitCost")) || 0;
    const quantity = Number(form.getValues("quantity")) || 0;
    const additionalCostSum = additionalCost.reduce(
      (sum, cost) => sum + (Number(cost) || 0),
      0
    );
    return unitCost * quantity + additionalCostSum;
  };

  const onSubmit = async (data: Material) => {
    const materialData = {
      ...data,
      additionalCost: additionalCost.map((cost) => Number(cost) || 0),
      totalCost,
    };

    await fetch("/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(materialData),
    })
      .then((res) => {
        if (!res.ok) {
          toast(`Material ${data.code} cadastrado com sucesso!`, {
            icon: <CircleCheck className="text-green-500" />,
          });
        } else {
          toast("Erro ao cadastrar material!", {
            icon: <CircleX className="text-red-500" />,
            description: "Tente novamente em alguns instantes.",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });

    form.reset();
    setAdditionalCost([]);
    setTotalCost(0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Unitário</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder=""
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aquisitionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Aquisição</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={ptBR}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornecedor</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between md:w-lg gap-2">
              <FormLabel>Custos Adicionais</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAdditionalCost}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Custo
              </Button>
            </div>

            {additionalCost.map((cost, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={cost}
                  onChange={(e) =>
                    updateAdditionalCost(index, Number(e.target.value))
                  }
                  className="flex-1"
                />
                {additionalCost.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAdditionalCost(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Custo Total:</span>
            <span className="text-lg">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalCost)}
            </span>
          </div>
        </div>

        <Button type="submit" className="hover:cursor-pointer uppercase">
          Cadastrar
        </Button>
      </form>
    </Form>
  );
};

export default MaterialRegistrationForm;
