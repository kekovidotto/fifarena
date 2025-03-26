"use client";

import { Button } from "@/components/ui/button";
import { Player } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import EditPlayersButton from "../edit-players-button";

export const Playerscolumns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "team",
    header: "Clube",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({row: {original: player}}) => {
      return (
        <div className="space-x-1">
          <EditPlayersButton player={player}/>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <TrashIcon />
          </Button>
        </div>
      );
    },
  },
];
