"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { 
  Box, 
  ArrowLeft, 
  Shield, 
  Building2, 
  Calendar, 
  Database,
  FileText,
  AlertOctagon,
  MinusCircle,
  Clock,
  User,
  Plus,
  Layers
} from "lucide-react";
import Link from "next/link";

export default function DetalheMunicaoPage() {
  const { id } = useParams();
  const router = useRouter();

  // 1. Estado do Banco de Dados Local
  const [bancoDados, setBancoDados] = useState({
    "1": { calibre: "5.56x45mm NATO", lote: "CBC-A2025", tipo: "Operacional (Comum)", estoqueTotal: 15000, almoxarifado: 6000, distribuido: 9000, status: "Estoque Seguro", fabricacao: "12/2024", validade: "12/2029", notaEmpenho: "NE-00124/2025", cias: { "1ª Cia": 4000, "2ª Cia": 3000, "Força Tática": 2000 } },
    "2": { calibre: "5.56x45mm NATO", lote: "CBC-T2024", tipo: "Traçante", estoqueTotal: 1200, almoxarifado: 400, distribuido: 800, status: "Atenção", fabricacao: "05/2024", validade: "05/2029", notaEmpenho: "NE-00892/2024", cias: { "1ª Cia": 300, "2ª Cia": 200, "Força Tática": 300 } },
    "3": { calibre: "9x19mm Parabellum", lote: "CBC-O2025", tipo: "Operacional (Gold)", estoqueTotal: 28000, almoxarifado: 12000, distribuido: 16000, status: "Estoque Seguro", fabricacao: "01/2025", validade: "01/2030", notaEmpenho: "NE-00034/2025", cias: { "1ª Cia": 6000, "2ª Cia": 6000, "Força Tática": 4000 } },
    "4": { calibre: ".40 S&W", lote: "CBC-T2023", tipo: "Treinamento", estoqueTotal: 450, almoxarifado: 50, distribuido: 400, status: "Crítico", fabricacao: "02/2023", validade: "02/2026", notaEmpenho: "NE-00211/2023", cias: { "1ª Cia": 200, "2ª Cia": 200, "Força Tática": 0 } },
    "5": { calibre: "12 GA", lote: "CBC-SG2024", tipo: "Menos Que Letal (Borracha)", estoqueTotal: 3500, almoxarifado: 1500, distribuido: 2000, status: "Estoque Seguro", fabricacao: "08/2024", validade: "08/2029", notaEmpenho: "NE-00512/2024", cias: { "1ª Cia": 800, "2ª Cia": 700, "Força Tática": 500 } },
    "6": { calibre: "12 GA", lote: "CBC-3002", tipo: "Letal (SG Projétil Único)", estoqueTotal: 800, almoxarifado: 200, distribuido: 600, status: "Atenção", fabricacao: "10/2024", validade: "10/2029", notaEmpenho: "NE-00941/2024", cias: { "1ª Cia": 200, "2ª Cia": 200, "Força Tática": 200 } }
  });

  // 2. Estado do Histórico / Linha do tempo
  const [historico, setHistorico] = useState([
    { id: 101, loteId: "1", data: "24/05/2026 - 14:20", operador: "Sgt PM Silva", origem: "Almoxarifado P4", quantidade: 1500, motivo: "Distribuição inicial regulamentar para início do trimestre." },
    { id: 102, loteId: "1", data: "25/05/2026 - 09:15", operador: "Ten PM Castro", origem: "Força Tática", quantidade: 500, motivo: "Baixa por consumo em Instrução de Tiro Prático Noturno." }
  ]);

  // 3. Estado de Controle da Aba Ativa
  const [activeTab, setActiveTab] = useState("ficha");

  // States do Formulário de Baixa
  const [origemBaixa, setOrigemBaixa] = useState("Almoxarifado");
  const [qtdBaixa, setQtdBaixa] = useState("");
  const [motivoBaixa, setMotivoBaixa] = useState("");
  const [operador, setOperador] = useState("");

  const loteData = bancoDados[id] || null;

  if (!loteData) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 items-center justify-center flex-col gap-4">
        <AlertOctagon className="text-rose-500" size={32} />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Lote não localizado no acervo da P4.</span>
        <button onClick={() => router.push("/dashboard/municoes")} className="text-xs bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
          Voltar ao Painel
        </button>
      </div>
    );
  }

  // Execução da Baixa Logística
  const handleExecutarBaixa = (e) => {
    e.preventDefault();
    const quantidade = parseInt(qtdBaixa);

    if (!quantidade || quantidade <= 0 || !motivoBaixa || !operador) {
      alert("Por favor, preencha todos os campos regulamentares de controle militar.");
      return;
    }

    if (origemBaixa === "Almoxarifado" && quantidade > loteData.almoxarifado) {
      alert("Erro: Quantidade superior ao saldo disponível no Almoxarifado Central!");
      return;
    } else if (origemBaixa !== "Almoxarifado" && quantidade > loteData.cias[origemBaixa]) {
      alert(`Erro: Quantidade superior ao saldo disponível na ${origemBaixa}!`);
      return;
    }

    const bancoAtualizado = { ...bancoDados };
    const loteAtual = bancoAtualizado[id];

    if (origemBaixa === "Almoxarifado") {
      loteAtual.almoxarifado -= quantidade;
    } else {
      loteAtual.cias[origemBaixa] -= quantidade;
      loteAtual.distribuido -= grandfather => quantidade; // Corrigido escopo interno caso necessário
      loteAtual.distribuido -= quantidade;
    }
    loteAtual.estoqueTotal -= quantidade;

    if (loteAtual.estoqueTotal < 500) loteAtual.status = "Crítico";
    else if (loteAtual.estoqueTotal < 2000) loteAtual.status = "Atenção";

    setBancoDados(bancoAtualizado);

    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.toLocaleDateString("pt-BR")} - ${dataAtual.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

    const novaAlteracao = {
      id: Date.now(),
      loteId: id,
      data: dataFormatada,
      operador: operador,
      origem: origemBaixa === "Almoxarifado" ? "Almoxarifado P4" : origemBaixa,
      quantidade: quantidade,
      motivo: motivoBaixa
    };

    setHistorico([novaAlteracao, ...historico]);
    
    setQtdBaixa("");
    setMotivoBaixa("");
    setOperador("");
    alert("Baixa executada com sucesso!");
    setActiveTab("historico");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Estoque Seguro": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Atenção": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Crítico": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      {/* Menu Lateral */}
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      {/* Painel Principal */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="mb-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/municoes">
              <button className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white tracking-tight font-mono">{loteData.lote}</h1>
                <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${getStatusColor(loteData.status)}`}>
                  {loteData.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Calibre: <span className="text-slate-200 font-bold">{loteData.calibre}</span> | Tipo: <span className="text-slate-200 font-bold">{loteData.tipo}</span></p>
            </div>
          </div>
        </div>

        {/* CONTROLE DE PASSOS / ABA SELETORA */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 mb-4 shrink-0">
          <button 
            onClick={() => setActiveTab("ficha")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "ficha" 
                ? "bg-slate-950 text-white border-slate-700" 
                : "bg-slate-900/40 text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            <Layers size={13} /> Ficha Tática de Carga
          </button>
          
          <button 
            onClick={() => setActiveTab("baixa")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "baixa" 
                ? "bg-rose-950/40 text-rose-400 border-rose-900" 
                : "bg-slate-900/40 text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            <MinusCircle size={13} /> Registrar Baixa / Utilização
          </button>

          <button 
            onClick={() => setActiveTab("historico")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === "historico" 
                ? "bg-slate-950 text-blue-400 border-slate-700" 
                : "bg-slate-900/40 text-slate-500 border-transparent hover:text-slate-300"
            }`}
          >
            <Clock size={13} /> Linha do Tempo ({historico.filter(h => h.loteId === id).length})
          </button>
        </div>

        {/* CONTEÚDO DINÂMICO */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-start">
          
          {/* PASSO 1: FICHA TÁTICA */}
          {activeTab === "ficha" && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0 overflow-hidden">
              <div className="md:col-span-1 space-y-4 overflow-y-auto pr-1 container-sombrio">
                <div className="p-4 bg-slate-950/30 border border-slate-800 rounded-xl space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                    <Calendar size={12} className="text-blue-500" /> Cronologia do Lote
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Fabricação:</span><span className="text-slate-300 font-mono">{loteData.fabricacao}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Validade:</span><span className="text-amber-400 font-bold font-mono">{loteData.validade}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Empenho:</span><span className="text-slate-400 font-mono font-bold">{loteData.notaEmpenho}</span></div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/30 border border-slate-800 rounded-xl space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                    <Database size={12} className="text-blue-500" /> Balanço Volumétrico
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Reserva Central:</span><span className="text-blue-400 font-bold font-mono">{loteData.almoxarifado.toLocaleString("pt-BR")} un</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Carga Distribuída:</span><span className="text-indigo-400 font-bold font-mono">{loteData.distribuido.toLocaleString("pt-BR")} un</span></div>
                    <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-white font-bold">Total em Carga:</span><span className="text-white font-black font-mono">{loteData.estoqueTotal.toLocaleString("pt-BR")} un</span></div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 border border-slate-800 rounded-xl bg-slate-950/10 flex flex-col min-h-0 overflow-hidden">
                <div className="p-3 bg-slate-900/60 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Alocação de Carga por Subunidade Operacional
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 container-sombrio">
                  <div className="p-3 bg-slate-950/60 border border-blue-900/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10"><Database size={14} /></div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase">Paiol de Reserva Central (P4)</p>
                        <p className="text-[10px] text-slate-500">Estoque de pronto emprego estratégico do Batalhão.</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black text-blue-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">{loteData.almoxarifado.toLocaleString("pt-BR")} UN</span>
                  </div>

                  {Object.entries(loteData.cias).map(([ciaNome, qtd]) => (
                    <div key={ciaNome} className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 text-slate-400 rounded-lg"><Shield size={14} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-300 uppercase">{ciaNome} - 17º BPM</p>
                          <p className="text-[10px] text-slate-500">Munições em cautela externa sob comando da subunidade.</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-300 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/40">{qtd.toLocaleString("pt-BR")} UN</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASSO 2: REGISTRAR BAIXA (OTIMIZAÇÃO MÁXIMA DE ESPAÇOS E FLUIDEZ EM GRID) */}
          {activeTab === "baixa" && (
            <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-start">
              <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <MinusCircle size={14} /> ABATE DE CARTUCHOS E LIVRO DE CONTROLE DE CONSUMO
              </h2>
              
              <form onSubmit={handleExecutarBaixa} className="space-y-3 text-xs w-full">
                {/* Linha 1: Origem e Volume */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Origem do Desfalque:</label>
                    <select 
                      value={origemBaixa} 
                      onChange={(e) => setOrigemBaixa(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 cursor-pointer transition-all"
                    >
                      <option value="Almoxarifado">Almoxarifado P4 (Reserva Central)</option>
                      {Object.keys(loteData.cias).map(cia => (
                        <option key={cia} value={cia}>{cia}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Volume para Baixa (Unidades):</label>
                    <input 
                      type="number" 
                      placeholder="Ex: 500"
                      value={qtdBaixa}
                      onChange={(e) => setQtdBaixa(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Linha 2: Militar Responsável */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Militar Responsável pela Movimentação:</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Ex: Ten PM J. Ribeiro"
                      value={operador}
                      onChange={(e) => setOperador(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                {/* Linha 3: Justificativa */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Justificativa Oficial / Destino do Consumo:</label>
                  <textarea 
                    rows={3}
                    placeholder="Especifique detalhadamente a destinação balística. Ex: Consumo em treinamento tático trimestral..."
                    value={motivoBaixa}
                    onChange={(e) => setMotivoBaixa(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 resize-none leading-relaxed transition-all"
                  />
                </div>

                {/* Linha 4: Botão Homologar diretamente acoplado */}
                <div className="pt-1">
                  <button 
                    type="submit"
                    className="w-full bg-rose-950/50 hover:bg-rose-900 border border-rose-800/80 hover:border-rose-700 text-rose-200 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Homologar Registro de Baixa
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PASSO 3: LINHA DO TEMPO */}
          {activeTab === "historico" && (
            <div className="flex-1 bg-slate-950/20 border border-slate-800 rounded-xl flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto container-sombrio space-y-4 relative">
                <div className="absolute left-8 top-6 bottom-6 w-0.5 border-l border-dashed border-slate-800 z-0" />

                {historico.filter(h => h.loteId === id).length > 0 ? (
                  historico.filter(h => h.loteId === id).map((item) => (
                    <div key={item.id} className="relative z-10 flex gap-4 text-xs pl-4 max-w-3xl mx-auto w-full">
                      <div className="w-3 h-3 rounded-full bg-slate-950 border-2 border-rose-500 shrink-0 mt-1.5 shadow" />
                      
                      <div className="flex-1 bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-800/60 pb-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-500">{item.data}</span>
                          <span className="text-[10px] font-black text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
                            -{item.quantidade.toLocaleString("pt-BR")} UN
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                          {item.motivo}
                        </p>
                        <div className="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-wide pt-0.5">
                          <span>Origem: <span className="text-slate-400">{item.origem}</span></span>
                          <span>Fiscalização: <span className="text-slate-400">{item.operador}</span></span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-xs text-slate-600 font-medium">
                    Nenhuma alteration registrada na cadeia de custódia deste lote.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Rodapé Fixo */}
        <div className="mt-4 shrink-0 p-2.5 bg-slate-950/40 border border-slate-800 text-[10px] text-slate-500 font-bold tracking-wide flex justify-between items-center rounded-xl">
          <span className="flex items-center gap-1.5">
            <FileText size={12} className="text-slate-600" /> Sistema Integrado de Material de Belonave - 17º BPM
          </span>
          <span className="font-mono text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
            ID_SYS_LOTE_00{id}
          </span>
        </div>

      </main>
    </div>
  );
}