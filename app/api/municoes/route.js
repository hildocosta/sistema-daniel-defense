// app/api/municoes/route.js
import { NextResponse } from "next/server";

// Importação relativa limpa subindo até a pasta lib na raiz
import { db } from "../../../lib/db"; 

export async function GET() {
  try {
    // 1. Chamada corrigida para o modelo exato do seu schema: materialBelico
    const lotesDoBanco = await db.materialBelico.findMany({
      where: {
        // Filtra estritamente pelo tipo de material definido no seu schema
        // Nota: Garanta que no banco esteja cadastrado como "MUNICAO" (em maiúsculas) ou "municao"
        tipoMaterial: {
          equals: "MUNICAO",
          mode: "insensitive" // Evita problemas se estiver maiúsculo ou minúsculo no banco
        }
      },
      orderBy: {
        dataCriacao: "desc", // Campo cronológico correto do seu schema
      },
    });

    // 2. Mapeamento dos campos reais do seu modelo MaterialBelico
    const dadosFormatados = lotesDoBanco.map((item) => {
      const total = Number(item.quantidadeTotal) || 0;
      const qtdAlmoxarifado = Number(item.almoxarifado) || 0;
      const qtdDistribuido = Number(item.distribuido) || 0;

      // Definição dinâmica do nível de criticidade visual baseado no saldo real do lote
      let nivelStatus = "Estoque Seguro";
      if (total < 1000) nivelStatus = "Crítico";
      else if (total < 5000) nivelStatus = "Atenção";

      return {
        id: item.id,
        calibre: item.calibre || "Não especificado", 
        lote: item.lote || "S/L",         
        tipo: item.tipo || "Comum", // Ex: Operacional, Treinamento, etc.
        estoqueTotal: total,
        almoxarifado: qtdAlmoxarifado, // Puxando o dado real gravado na Reserva Central
        distribuido: qtdDistribuido,   // Puxando o dado real gravado nas Cias
        status: nivelStatus,           // Atualiza o crachá visual na tabela
      };
    });

    // Retorna a resposta limpa para o front-end
    return NextResponse.json(dadosFormatados, { status: 200 });

  } catch (error) {
    console.error("Erro crítico ao acessar o banco de dados do Paiol:", error);
    return NextResponse.json(
      { error: "Erro de comunicação com a base de dados do Paiol." },
      { status: 500 }
    );
  }
}