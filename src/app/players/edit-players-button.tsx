"use client";
import { Button } from "@/components/ui/button";
import UpsertPlayers from "./upsert-players";
import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Player } from "@prisma/client";

interface EditPlayersButtonProps {
    player: Player
}

const EditPlayersButton = ({player}: EditPlayersButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setIsOpen(true)}>
                <PencilIcon />
            </Button>
            <UpsertPlayers isOpen={isOpen} setIsOpen={setIsOpen} defaultValues={player} playersId={player.id}/>
        </>
    )
};

export default EditPlayersButton;
