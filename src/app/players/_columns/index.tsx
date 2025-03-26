"use client";

import { Button } from "@/components/ui/button";
import { Player } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon } from "lucide-react";

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
    cell: () => {
      return (
        <div className="space-x-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <PencilIcon />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <TrashIcon />
          </Button>
        </div>
      );
    },
  },
];
