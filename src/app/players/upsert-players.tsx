"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { boolean, z } from "zod";
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
import { upsertPlayers } from "../_actions/add-players";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UpsertPlatersProps {
    isOpen: boolean;
    defaultValues?: FormSchema;
    playersId?: number;
    setIsOpen: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
  team: z.string().min(1, {
    message: "Time é obrigatório",
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertPlayers = ({ isOpen, setIsOpen, defaultValues, playersId }: UpsertPlatersProps) => {
    const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ??{
        name: "",
        team: "",
    },
    });

    const onSubmit = async (data: FormSchema) => {
        try {
            await upsertPlayers({ ...data, id: playersId });
            form.reset(); // Reseta o formulário após sucesso
            setIsOpen(false);
            alert("Jogador cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar jogador", error);
        }
    };

    const isUpdate = Boolean(playersId);
    return ( <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
        }
    }}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isUpdate ? 'Atualizar' : 'Cadastrar'} Jogador</DialogTitle>
            </DialogHeader>
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
                    <DialogFooter className="flex gap-3 sm:gap-4">
                    <DialogClose className="flex-1">
                        <Button type="button" variant="outline" className="w-full">
                        Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="submit" className="flex-1">
                        {isUpdate ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog> );
}
 
export default UpsertPlayers;