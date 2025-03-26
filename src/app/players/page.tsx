"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addPlayers } from "../_actions/add-players";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
  team: z.string().min(1, {
    message: "Time é obrigatório",
  }),
});

type FormSchema = z.infer<typeof formSchema>

const PlayersPage = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      team: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      await addPlayers(data);
      form.reset();
      alert("Jogador cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar jogador", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-center text-4xl font-semibold">Cadastrar Jogadores</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite um nome..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clube</FormLabel>
                <FormControl>
                  <Input placeholder="Digite um clube..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Cadastrar</Button>
        </form>
      </Form>
    </div>
  );
};

export default PlayersPage;
