"use client";
import { Button } from "@/components/ui/button";
import UpsertPlaters from "./upsert-players";
import { ArrowDownUpIcon } from "lucide-react";
import { useState } from "react";

const AddPlayersButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button className="rounded-full font-bold" onClick={() => setIsOpen(true)}>
        Adicionar Jogador
        <ArrowDownUpIcon />
      </Button>
      <UpsertPlaters isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
};

export default AddPlayersButton;
