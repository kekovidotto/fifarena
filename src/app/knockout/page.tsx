import { db } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 container-max-width">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold">Fase Eliminatória</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/groups">
            <Button variant="outline" className="text-sm sm:text-base py-2 px-4">
              Voltar para Grupos
            </Button>
          </Link>
          {matches.length === 0 && <GenerateKnockoutButton />}
        </div>
      </div>

      {matches.length === 0 ? (
        <Card className="card">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">
              Fase eliminatória ainda não foi gerada
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground text-sm sm:text-base p-4 sm:p-6">
            Clique no botão "Gerar Fase Eliminatória" para criar os confrontos do mata-mata com os dois primeiros colocados de cada grupo.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {matches.map((match) => (
            <Card key={match.id} className="card overflow-hidden">
              <CardHeader className="bg-primary/10 p-3 sm:p-4">
                <CardTitle className="text-center text-lg sm:text-xl">
                  Confronto Eliminatório
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                  <div className="text-right font-semibold text-sm sm:text-base">
                    {match.player1.name}
                  </div>
                  <div className="text-center text-xl sm:text-2xl font-bold">
                    {match.score1 !== null && match.score2 !== null
                      ? `${match.score1} x ${match.score2}`
                      : "x"}
                  </div>
                  <div className="text-left font-semibold text-sm sm:text-base">
                    {match.player2.name}
                  </div>
                  
                  <div className="text-right text-xs sm:text-sm text-muted-foreground">
                    {match.player1.team}
                  </div>
                  <div className="text-center text-xs sm:text-sm text-muted-foreground">
                    Mata-mata
                  </div>
                  <div className="text-left text-xs sm:text-sm text-muted-foreground">
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