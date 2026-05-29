"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page";
import { 
  Box, 
  Search, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  SlidersHorizontal,
  ExternalLink,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function ControleMunicoesPage() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  // Consome a API real integrada à rota direta
  useEffect(() => {
    async function fetchLotesPaiol() {
      try {
        setLoading(true);
        const response = await fetch("/api/municoes");
        
        if (!response.ok) {
          throw new Error(`Erro do servidor: Status ${response.status}`);
        }
        const dadosReais = await response.json();
        setLotes(Array.isArray(dadosReais) ? dadosReais : []);
      } catch (error) {
        console.error("Erro na comunicação com a API de Munições:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLotesPaiol();
  }, []);

  // Filtros em tempo de execução
  const lotesFiltrados = lotes.filter(item => {
    const calibreTexto = item?.calibre?.toLowerCase() || "";
    const loteTexto = item?.lote?.toLowerCase() || "";
    const tipoTexto = item?.tipo?.toLowerCase() || "";
    const buscaTexto = busca.toLowerCase();

    const correspondeBusca = 
      calibreTexto.includes(buscaTexto) ||
      loteTexto.includes(buscaTexto) ||
      tipoTexto.includes(buscaTexto);
    
    const correspondeStatus = filtroStatus === "Todos" || item?.status === filtroStatus;

    return correspondeBusca && correspondeStatus;
  });

  // Somatórias volumétricas baseadas nas respostas do banco
  const totalCartuchos = lotes.reduce((acc, curr) => acc + (Number(curr?.estoqueTotal) || 0), 0);
  const totalAlmoxarifado = lotes.reduce((acc, curr) => acc + (Number(curr?.almoxarifado) || 0), 0);
  const totalDistribuido = lotes.reduce((acc, curr) => acc + (Number(curr?.distribuido) || 0), 0);
  const lotesCriticos = lotes.filter(l => l?.status === "Crítico" || l?.status === "Atenção").length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Estoque Seguro": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Atenção": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Crítico": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="mb-6 shrink-0 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Box className="text-blue-500" size={22} />
              Controle Metódico de Munições (Lotes Ativos)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Balanço quantitativo de cartuchos por calibre, fracionamento de depósitos e monitoramento de criticidade física em tempo real.
            </p>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5 shrink-0">
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Carga Total Prontidão</p>
              <p className="text-xl font-black text-white mt-0.5">
                {loading ? "..." : totalCartuchos.toLocaleString("pt-BR")} <span className="text-[10px] font-medium text-slate-500">un</span>
              </p>
            </div>
            <div className="p-2 bg-slate-800 text-slate-400 rounded-lg border border-slate-700">
              <Layers size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Reserva Central (Almox.)</p>
              <p className="text-xl font-black text-blue-400 mt-0.5">
                {loading ? "..." : totalAlmoxarifado.toLocaleString("pt-BR")} <span className="text-[10px] font-medium text-slate-500">un</span>
              </p>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10">
              <CheckCircle2 size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">Carga Externa (Cias)</p>
              <p className="text-xl font-black text-indigo-400 mt-0.5">
                {loading ? "..." : totalDistribuido.toLocaleString("pt-BR")} <span className="text-[10px] font-medium text-slate-500">un</span>
              </p>
            </div>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/10">
              <TrendingUp size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Alertas de Reposição</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">
                {loading ? "..." : lotesCriticos} <span className="text-[10px] font-medium text-slate-500">lotes</span>
              </p>
            </div>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/10">
              <AlertTriangle size={16} />
            </div>
          </div>
        </div>

        {/* Seção de Filtros */}
        <div className="mb-4 shrink-0 flex flex-col sm:flex-row gap-3 items-center justify-between p-3 bg-slate-950/30 border border-slate-800/60 rounded-xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Buscar por Calibre, Lote ou Tipo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:border-blue-500/50 cursor-pointer"
            >
              <option value="Todos">Todos os Níveis</option>
              <option value="Estoque Seguro">Estoque Seguro</option>
              <option value="Atenção">Atenção</option>
              <option value="Crítico">Crítico</option>
            </select>
          </div>
        </div>

        {/* Listagem em Tabela */}
        <div className="flex-1 bg-slate-950/20 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto min-h-0 container-sombrio">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/80 sticky top-0 backdrop-blur-md border-b border-slate-800 z-10">
                <tr>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Calibre</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Nº do Lote (Rastreio)</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Especificação</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Qtd Almox.</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Qtd Ext. (Cias)</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-right">Total Fisico</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Nível</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-xs text-slate-400 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-blue-500" size={16} />
                        Sincronizando com a Base de Dados do Paiol...
                      </div>
                    </td>
                  </tr>
                ) : lotesFiltrados.length > 0 ? (
                  lotesFiltrados.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${item.status === "Crítico" ? "bg-rose-500" : "bg-blue-500"}`} />
                          <span className="text-xs font-bold text-white tracking-wide">{item.calibre}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs text-slate-300 font-bold">{item.lote}</td>
                      <td className="p-3 text-xs text-slate-400 font-medium">{item.tipo}</td>
                      <td className="p-3 font-mono text-xs text-slate-400 text-right">{(item.almoxarifado || 0).toLocaleString("pt-BR")}</td>
                      <td className="p-3 font-mono text-xs text-indigo-400 text-right">{(item.distribuido || 0).toLocaleString("pt-BR")}</td>
                      <td className="p-3 font-mono text-xs text-white font-bold text-right">{(item.estoqueTotal || 0).toLocaleString("pt-BR")}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border inline-block min-w-[105px] text-center ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Link href={`/dashboard/municoes/${item.id}`}>
                          <button 
                            title="Ver Detalhes do Lote"
                            className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            <ExternalLink size={12} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-xs text-slate-500 font-medium">
                      Nenhum lote ou calibre localizado para os filtros inseridos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[10px] text-slate-500 font-semibold tracking-wide flex justify-between items-center shrink-0">
            <span>Listando {lotesFiltrados.length} especificações de calibres e lotes</span>
            <span className="text-slate-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Carga Geral de Cartuchos P4</span>
          </div>
        </div>

      </main>
    </div>
  );
}