import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Utiliza a lib singleton que você criou com cache do Pool

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { 
      tipoMaterial, 
      numeroSerie, 
      modelo, 
      calibreArma, 
      comprimentoCano,
      loteCodigo, 
      calibreMunicao, 
      tipoProjetil, 
      quantidadeRecebida,
      carregadoresInclusos, 
      localArmazenamento, 
      documentoOrigem, 
      armeiroResponsavel, 
      observacoes 
    } = body;

    // Validação básica de segurança
    if (!tipoMaterial) {
      return NextResponse.json({ error: "O tipo de material é obrigatório." }, { status: 400 });
    }

    let novoMaterial;

    // 1. REGISTRO DE ARMA (FUZIL)
    if (tipoMaterial === "fuzil") {
      if (!numeroSerie) {
        return NextResponse.json({ error: "Número de série é obrigatório para armamentos." }, { status: 400 });
      }

      novoMaterial = await db.materialBelico.create({
        data: {
          tipoMaterial: "ARMA",
          serie: numeroSerie.trim().toUpperCase(),
          patrimonio: null,
          lote: null,
          equipamento: modelo,
          calibre: calibreArma,
          tipo: "Operacional",
          cia: localArmazenamento || "Almoxarifado Central (P4)",
          status: "Operacional",
          responsavel: armeiroResponsavel,
          quantidadeTotal: 1,
          almoxarifado: 1,
          distribuido: 0,
          documentoAmparo: documentoOrigem,
          observacoes: observacoes 
            ? `Cano: ${comprimentoCano}. Carregadores inclusos: ${carregadoresInclusos}. ${observacoes}` 
            : `Cano: ${comprimentoCano}. Carregadores: ${carregadoresInclusos}`,
        }
      });

    // 2. REGISTRO DE MUNIÇÃO
    } else if (tipoMaterial === "municao") {
      if (!loteCodigo) {
        return NextResponse.json({ error: "O código do lote é obrigatório para munições." }, { status: 400 });
      }

      const qtd = parseInt(quantidadeRecebida) || 0;

      novoMaterial = await db.materialBelico.create({
        data: {
          tipoMaterial: "MUNICAO",
          serie: null,
          patrimonio: null,
          lote: loteCodigo.trim().toUpperCase(),
          equipamento: `Cartucho Calibre ${calibreMunicao}`,
          calibre: calibreMunicao,
          tipo: tipoProjetil,
          cia: localArmazenamento || "Almoxarifado Central (P4)",
          status: "Estoque Seguro",
          quantidadeTotal: qtd,
          almoxarifado: qtd, // Tudo entra inicialmente na reserva central
          distribuido: 0,
          documentoAmparo: documentoOrigem,
          observacoes: observacoes,
        }
      });
    }

    // 3. HISTÓRICO AUTOMÁTICO (Cadeia de Custódia / Linha do Tempo)
    await db.historico.create({
      data: {
        titulo: `Entrada de Material: ${tipoMaterial.toUpperCase()}`,
        descricao: tipoMaterial === "fuzil" 
          ? `Inclusão de ${modelo} (Série: ${numeroSerie}) via ${documentoOrigem || "Carga Manual"}.`
          : `Entrada volumétrica de Lote ${loteCodigo} com ${quantidadeRecebida} cartuchos.`,
        tipo: "info",
        quantidadeMov: tipoMaterial === "fuzil" ? 1 : (parseInt(quantidadeRecebida) || 0),
        origemMov: "Fornecedor / Fábrica",
        materialBelicoId: novoMaterial.id,
        usuarioId: null // Pronto para integração futura com NextAuth / Sessões
      }
    });

    return NextResponse.json({ success: true, data: novoMaterial }, { status: 201 });

  } catch (error) {
    console.error("ERRO_CADASTRO_P4:", error);
    
    // Tratamento de conflito caso o número de série (Unique) já conste no banco de dados
    if (error.code === "P2002") {
      return NextResponse.json({ 
        error: "Erro de duplicidade: Este número de série ou lote já está cadastrado no sistema." 
      }, { status: 409 });
    }

    return NextResponse.json({ error: "Erro interno do servidor ao processar o cadastro." }, { status: 500 });
  }
}