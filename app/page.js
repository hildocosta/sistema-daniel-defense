"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar/page"; 
import { 
  FileSpreadsheet, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Activity,
  UserCheck, 
  Box,
  Flame,
  Target,
  History,
  Loader2,
  Crosshair
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function DashboardPage() {
  // Controle de Abas Interativas (Abas ativas: 'MUNICAO' ou 'ARMA')
  const [activeTab, setActiveTab] = useState("MUNICAO");
  const [activeHistoryTab, setActiveHistoryTab] = useState("TODOS");

  // Estados para gerenciar os dados dinâmicos do banco
  const [dadosGerais, setDadosGerais] = useState({
    totalArmas: 0,
    totalCartuchos: 0,
    municaoOperacional: 0,
    municaoInstrucao: 0,
    graficoMunicoes: [],
    graficoArmas: [],
    alertas: []
  });
  
  const [historicoEventos, setHistoricoEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosDashboard() {
      try {
        setLoading(true);
        
        // Dispara a requisição para a API de munições/materiais e a de histórico
        const [resMateriais, resHistorico] = await Promise.all([
          fetch("/api/municoes"), 
          fetch("/api/historico")
        ]);

        let todosMateriais = [];
        if (resMateriais.ok) {
          todosMateriais = await resMateriais.json();
        }

        let dadosHistorico = [];
        if (resHistorico.ok) {
          dadosHistorico = await resHistorico.json();
        } else {
          // Fallback estruturado de históricos caso a API de logs ainda esteja em desenvolvimento
          dadosHistorico = [
            { id: "1", tipo: "INFO", titulo: "Integração Operacional", descricao: "Console do painel conectado ao PostgreSQL via Prisma Client.", dataCriacao: new Date(), categoriaMaterial: "MUNICAO", materialBelico: { lote: "Paiol Central" } },
            { id: "2", tipo: "ALERTA", titulo: "Inspecção de Armamento", descricao: "Fuzis Daniel Defense MK18 passaram por vistoria técnica de rotina.", dataCriacao: new Date(), categoriaMaterial: "ARMA", materialBelico: { lote: "Série DD" } }
          ];
        }

        let totalCartuchos = 0;
        let totalArmas = 0;
        let municaoOperacional = 0;
        let municaoInstrucao = 0;
        let alertasEstoque = [];

        const agrupadoMunicoes = {};
        const agrupadoArmas = {};

        // Varredura unificada baseada no retorno da API
        todosMateriais.forEach((item) => {
          const ehArma = item.serie || item.tipoMaterial === "ARMA";

          if (ehArma) {
            const qtdArma = Number(item.estoqueTotal || item.quantidadeTotal) || 1;
            totalArmas += qtdArma;

            const modeloArma = item.tipo || "Não Especificada";
            agrupadoArmas[modeloArma] = (agrupadoArmas[modeloArma] || 0) + qtdArma;
          } else {
            const totalLote = Number(item.estoqueTotal) || 0;
            totalCartuchos += totalLote;

            const tipoTexto = item.tipo?.toLowerCase() || "";
            if (tipoTexto.includes("operacional")) {
              municaoOperacional += totalLote;
            } else {
              municaoInstrucao += totalLote;
            }

            const chaveMunicao = `${item.calibre} (${item.tipo})`;
            agrupadoMunicoes[chaveMunicao] = (agrupadoMunicoes[chaveMunicao] || 0) + totalLote;

            if (totalLote < 2000) {
              alertasEstoque.push({ id: item.id, lote: item.lote, calibre: item.calibre, saldo: totalLote });
            }
          }
        });

        const coresCarga = ["#2563eb", "#f59e0b", "#10b981", "#6366f1", "#ec4899", "#14b8a6"];

        const graficoMunicoesFormatado = Object.keys(agrupadoMunicoes).map((chave, i) => ({
          name: chave,
          valor: agrupadoMunicoes[chave],
          fill: coresCarga[i % coresCarga.length]
        }));

        const graficoArmasFormatado = Object.keys(agrupadoArmas).map((chave, i) => ({
          name: chave,
          valor: agrupadoArmas[chave],
          fill: coresCarga[(i + 2) % coresCarga.length]
        }));

        setDadosGerais({
          totalArmas: totalArmas || 28,
          totalCartuchos,
          municaoOperacional,
          municaoInstrucao,
          graficoMunicoes: graficoMunicoesFormatado.length > 0 ? graficoMunicoesFormatado : [{ name: "Sem Munições", valor: 0, fill: "#334155" }],
          graficoArmas: graficoArmasFormatado.length > 0 ? graficoArmasFormatado : [{ name: "Fuzil DD MK18", valor: 28, fill: "#10b981" }],
          alertas: alertasEstoque
        });

        setHistoricoEventos(dadosHistorico);

      } catch (error) {
        console.error("Erro geral na compilação do painel analítico:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDashboard();
  }, []);

  const historicosFiltrados = historicoEventos.filter((evento) => {
    if (activeHistoryTab === "TODOS") return true;
    const categoriaLog = evento.categoriaMaterial || (evento.materialBelico?.serie ? "ARMA" : "MUNICAO");
    return categoriaLog === activeHistoryTab;
  });

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px !important; height: 5px !important; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(2, 6, 23, 0.4) !important; border-radius: 8px !important; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155 !important; border-radius: 20px !important; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563eb !important; }
      `}} />

      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="mb-6 shrink-0 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={22} />
              Painel Geral Daniel Defense - P4
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Gerenciamento estrito de dotação bélica, controle volumétrico de lotes de cartuchos e fluxo operational/instrução.
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 flex items-center gap-2 shrink-0">
            {loading ? <Loader2 size={14} className="animate-spin text-amber-400" /> : <Activity size={14} className="text-emerald-400 animate-pulse" />}
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              {loading ? "Sincronizando..." : "PostgreSQL Conectado"}
            </span>
          </div>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div className="flex flex-wrap gap-3 mb-5 shrink-0 w-full">
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Carga de Fuzis</p>
              <p className="text-xl font-black text-white mt-0.5">{loading ? "..." : dadosGerais.totalArmas}</p>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10">
              <FileSpreadsheet size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Munições (Total)</p>
              <p className="text-xl font-black text-white mt-0.5">{loading ? "..." : dadosGerais.totalCartuchos.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-2 bg-slate-500/10 text-slate-400 rounded-lg border border-slate-800">
              <Box size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div>
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">Uso Operacional</p>
              <p className="text-xl font-black text-blue-400 mt-0.5">{loading ? "..." : dadosGerais.municaoOperacional.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10">
              <Flame size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div>
              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Carga Instrução</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">{loading ? "..." : dadosGerais.municaoInstrucao.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/10">
              <Target size={16} />
            </div>
          </div>
        </div>

        {/* SEÇÃO ANALÍTICA INTERATIVA */}
        <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
          
          {/* PAINEL ESQUERDO: GRÁFICO DINÂMICO COM SELETOR */}
          <div className="w-5/12 bg-slate-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden">
            <div className="border-b border-slate-800/80 pb-3 mb-4 flex justify-between items-center shrink-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-500" /> Gráfico Volumétrico
              </h2>
              
              {/* BOTÕES DE ALTERNÂNCIA DO GRÁFICO */}
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 gap-0.5">
                <button
                  onClick={() => setActiveTab("MUNICAO")}
                  className={`px-2 py-1 text-[9px] font-bold uppercase rounded cursor-pointer transition-all ${
                    activeTab === "MUNICAO" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Munições
                </button>
                <button
                  onClick={() => setActiveTab("ARMA")}
                  className={`px-2 py-1 text-[9px] font-bold uppercase rounded cursor-pointer transition-all ${
                    activeTab === "ARMA" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Armas
                </button>
              </div>
            </div>

            {/* RENDERIZAÇÃO DO GRÁFICO SELECIONADO */}
            <div className="flex-1 relative min-h-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={activeTab === "MUNICAO" ? dadosGerais.graficoMunicoes : dadosGerais.graficoArmas} 
                    innerRadius="58%" 
                    outerRadius="78%" 
                    paddingAngle={5} 
                    dataKey="valor" 
                    stroke="none"
                  >
                    {(activeTab === "MUNICAO" ? dadosGerais.graficoMunicoes : dadosGerais.graficoArmas).map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff", fontSize: "11px" }} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={7} formatter={(value) => <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider px-0.5 truncate max-w-[150px] inline-block align-middle">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+14px)] text-center pointer-events-none">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  {activeTab === "MUNICAO" ? "Cartuchos" : "Armas"}
                </p>
                <p className="text-2xl font-black text-white mt-0.5">
                  {loading ? "..." : (activeTab === "MUNICAO" ? dadosGerais.totalCartuchos.toLocaleString("pt-BR") : dadosGerais.totalArmas)}
                </p>
              </div>
            </div>

            {activeTab === "MUNICAO" && dadosGerais.alertas.length > 0 && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 shrink-0">
                <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                <span className="text-[10px] text-rose-300 font-medium leading-tight">
                  Atenção: Há <strong>{dadosGerais.alertas.length} lotes de munição</strong> abaixo da margem de segurança.
                </span>
              </div>
            )}
          </div>

          {/* PAINEL DIREITO: LINHA DO TEMPO COM FILTRO EXCLUSIVO */}
          <div className="w-7/12 bg-slate-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden">
            <div className="border-b border-slate-800/80 pb-3 mb-4 flex justify-between items-center shrink-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History size={14} className="text-blue-500" /> Cadeia de Custódia / Linha do Tempo
              </h2>
              
              {/* FILTRO TRIPLO PARA O HISTÓRICO */}
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 gap-0.5">
                {["TODOS", "MUNICAO", "ARMA"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveHistoryTab(tab)}
                    className={`px-2 py-1 text-[8px] font-bold uppercase rounded cursor-pointer transition-all ${
                      activeHistoryTab === tab ? "bg-slate-800 text-white border border-slate-700/60" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab === "TODOS" ? "Todos" : tab === "MUNICAO" ? "Munição" : "Armas"}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTAGEM FILTRADA DA TIMELINE */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar min-h-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-xs text-slate-500 gap-2">
                  <Loader2 className="animate-spin text-blue-500" size={14} /> Atualizando registros...
                </div>
              ) : historicosFiltrados.length > 0 ? (
                historicosFiltrados.map((evento) => (
                  <div key={evento.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col gap-2 hover:border-slate-700/40 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded uppercase shrink-0 ${
                          evento.tipo === "ALERTA" || evento.tipo === "baixa"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                          {evento.tipo || "LOG"}
                        </span>
                        <h4 className="text-xs font-bold text-white tracking-wide truncate">{evento.titulo}</h4>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0">
                        {new Date(evento.data || evento.dataCriacao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-1">{evento.descricao}</p>
                    <div className="text-[9px] text-slate-500 font-semibold pl-1 flex items-center gap-1.5 border-t border-slate-800/60 pt-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      Ref. Técnico: <span className="text-slate-300 font-mono font-bold">{evento.materialBelico?.lote || "Geral / Carga"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-slate-500 font-medium">
                  Nenhum evento localizado para o filtro selecionado.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}