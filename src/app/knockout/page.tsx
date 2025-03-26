import { db } from "@/lib/prisma";
import { GenerateKnockoutButton } from "@/components/generate-knockout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function KnockoutPage() {
  // Buscar partidas da fase eliminatória
  const matches = await db.match.findMany({
    where: {
      phase: "Eliminatórias",
    },
    include: {
      player1: true,
      player2: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Fase Eliminatória</h1>
        <div className="space-x-4">
          <Link href="/groups">
            <Button variant="outline">
              Voltar para Grupos
            </Button>
          </Link>
          {matches.length === 0 && <GenerateKnockoutButton />}
        </div>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Fase eliminatória ainda não foi gerada
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Clique no botão "Gerar Fase Eliminatória" para criar os confrontos do mata-mata com os dois primeiros colocados de cada grupo.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {matches.map((match) => (
            <Card key={match.id} className="overflow-hidden">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-center text-xl">
                  Confronto Eliminatório
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-right font-semibold">{match.player1.name}</div>
                  <div className="text-center text-2xl font-bold">
                    {match.score1 !== null && match.score2 !== null
                      ? `${match.score1} x ${match.score2}`
                      : "x"}
                  </div>
                  <div className="text-left font-semibold">{match.player2.name}</div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    {match.player1.team}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Mata-mata
                  </div>
                  <div className="text-left text-sm text-muted-foreground">
                    {match.player2.team}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}