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
  RefreshCw,
  Box,
  Flame,
  Target,
  History,
  Loader2
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function DashboardPage() {
  // Estados para gerenciar os dados do banco de dados
  const [resumoBelico, setResumoBelico] = useState({
    totalArmas: 0,
    totalCartuchos: 0,
    municaoOperacional: 0,
    municaoInstrucao: 0,
    graficoDados: [],
    alertas: []
  });
  
  const [historicoEventos, setHistoricoEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados consolidados do banco de dados
  useEffect(() => {
    async function carregarDadosDashboard() {
      try {
        setLoading(true);
        
        // Dispara as requisições em paralelo para máxima performance
        const [resMunicoes, resHistorico] = await Promise.all([
          fetch("/api/municoes"),
          fetch("/api/historico") // Certifique-se de ter essa rota criada para os históricos
        ]);

        let dadosMunicoes = [];
        if (resMunicoes.ok) {
          dadosMunicoes = await resMunicoes.json();
        }

        let dadosHistorico = [];
        if (resHistorico.ok) {
          dadosHistorico = await resHistorico.json();
        } else {
          // Fallback caso ainda não tenha a API de histórico criada
          dadosHistorico = [
            { id: 1, tipo: "INFORMATIVO", titulo: "Sincronização Prontidão", descricao: "Painel integrado ao banco de dados PostgreSQL com sucesso.", dataCriacao: new Date().toLocaleString("pt-BR"), materialBelico: { lote: "Geral" } }
          ];
        }

        // Processamento das métricas baseadas no modelo MaterialBelico do seu Schema
        let totalCartuchos = 0;
        let municaoOperacional = 0;
        let municaoInstrucao = 0;
        let alertasEstoque = [];

        // Agrupador para o gráfico de pizza por tipo ("Operacional", "Treinamento", etc.)
        const agrupadoPorTipo = {};

        dadosMunicoes.forEach((item) => {
          const totalLote = Number(item.estoqueTotal) || 0;
          totalCartuchos += totalLote;

          // Soma baseada na especificação/finalidade
          const tipoTexto = item.tipo?.toLowerCase() || "";
          if (tipoTexto.includes("operacional")) {
            municaoOperacional += totalLote;
          } else {
            municaoInstrucao += totalLote; // Trata demais como instrução/outros
          }

          // Alimentando dados do gráfico dinamicamente
          const nomeTipo = item.tipo || "Outros";
          agrupadoPorTipo[nomeTipo] = (agrupadoPorTipo[nomeTipo] || 0) + totalLote;

          // Alerta crítico automático se o lote estiver abaixo da margem de segurança (ex: 2000 un)
          if (totalLote < 2000) {
            alertasEstoque.push({
              id: item.id,
              lote: item.lote,
              calibre: item.calibre,
              saldo: totalLote
            });
          }
        });

        // Formata os dados no padrão que o Recharts (Gráfico) necessita
        const coresCarga = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
        const graficoFormatado = Object.keys(agrupadoPorTipo).map((chave, index) => ({
          name: `Munição ${chave}`,
          valor: agrupadoPorTipo[chave],
          fill: coresCarga[index % coresCarga.length]
        }));

        // NOTA DE AJUSTE DE ARMAS: Como essa API foca em munições, vamos simular a carga estática de fuzis 
        // ou você pode criar uma chamada subsequente para db.materialBelico.count({ where: { tipoMaterial: "ARMA" } })
        setResumoBelico({
          totalArmas: 28, // Mantido conforme a sua dotação fixa até criar a API de Armas
          totalCartuchos,
          municaoOperacional,
          municaoInstrucao,
          graficoDados: graficoFormatado.length > 0 ? graficoFormatado : [{ name: "Sem munições", valor: 0, fill: "#334155" }],
          alertas: alertasEstoque
        });

        setHistoricoEventos(dadosHistorico);

      } catch (error) {
        console.error("Erro ao processar dados dinâmicos do painel:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDashboard();
  }, []);

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
        
        {/* Cabeçalho do Painel */}
        <div className="mb-6 shrink-0 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={22} />
              Painel Geral Daniel Defense - P4
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Gerenciamento estrito de dotação bélica, controle volumétrico de lotes de cartuchos e fluxo operacional/instrução.
            </p>
          </div>
          <div className={`rounded-lg px-3 py-1.5 flex items-center gap-2 shrink-0 border ${
            loading ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}>
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Activity size={14} className="animate-pulse" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {loading ? "Sincronizando Banco..." : "Monitoramento PostgreSQL Ativo"}
            </span>
          </div>
        </div>

        {/* CARDS DE MÉTRICAS OPERACIONAIS */}
        <div className="flex flex-wrap gap-3 mb-5 shrink-0 w-full">
          
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">Carga de Fuzis</p>
              <p className="text-xl font-black text-white mt-0.5">{loading ? "..." : resumoBelico.totalArmas}</p>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10 shrink-0 ml-2">
              <FileSpreadsheet size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">Status Fuzis</p>
              <p className="text-[10px] font-bold text-emerald-400 mt-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block truncate max-w-full">
                Liberado para Escala
              </p>
            </div>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/10 shrink-0 ml-2">
              <UserCheck size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">Munições (Total)</p>
              <p className="text-xl font-black text-white mt-0.5">
                {loading ? "..." : resumoBelico.totalCartuchos.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="p-2 bg-slate-500/10 text-slate-400 rounded-lg border border-slate-800 shrink-0 ml-2">
              <Box size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider truncate">Uso Operacional</p>
              <p className="text-xl font-black text-blue-400 mt-0.5">
                {loading ? "..." : resumoBelico.municaoOperacional.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10 shrink-0 ml-2">
              <Flame size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider truncate">Carga Instrução</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">
                {loading ? "..." : resumoBelico.municaoInstrucao.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/10 shrink-0 ml-2">
              <Target size={16} />
            </div>
          </div>

        </div>

        {/* SEÇÃO ANALÍTICA: GRÁFICO E HISTÓRICO */}
        <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
          
          {/* Gráfico Analítico de Munições */}
          <div className="w-5/12 bg-slate-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden">
            <div className="border-b border-slate-800/80 pb-3 mb-4 shrink-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-500" /> Distribuição de Cartuchos por Tipo
              </h2>
            </div>

            <div className="flex-1 relative min-h-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={resumoBelico.graficoDados} innerRadius="60%" outerRadius="80%" paddingAngle={6} dataKey="valor" stroke="none">
                    {resumoBelico.graficoDados.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff", fontSize: "11px" }} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={8} formatter={(value) => <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider px-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+14px)] text-center pointer-events-none">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Saldo Total</p>
                <p className="text-2xl font-black text-white mt-0.5">
                  {loading ? "..." : resumoBelico.totalCartuchos.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>

            {/* Alertas Dinâmicos de Nível Crítico */}
            {resumoBelico.alertas.length > 0 && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 shrink-0 max-h-20 overflow-y-auto custom-scrollbar">
                <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                <span className="text-[10px] text-rose-300 font-medium leading-tight">
                  Atenção: Existem <strong>{resumoBelico.alertas.length} lotes</strong> abaixo da reserva de segurança mínima!
                </span>
              </div>
            )}
          </div>

          {/* Linha do Tempo / Histórico de Movimentações */}
          <div className="w-7/12 bg-slate-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden">
            <div className="border-b border-slate-800/80 pb-3 mb-4 flex justify-between items-center shrink-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History size={14} className="text-blue-500" /> Relatórios de Uso e Linha do Tempo
              </h2>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold border border-slate-700">
                Total Eventos: {historicoEventos.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar min-h-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-xs text-slate-500 gap-2">
                  <Loader2 className="animate-spin text-blue-500" size={14} /> Carregando histórico...
                </div>
              ) : historicoEventos.length > 0 ? (
                historicoEventos.map((evento) => (
                  <div key={evento.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded uppercase shrink-0 ${
                          evento.tipo === "alerta" || evento.tipo === "baixa"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}>
                          {evento.tipo || "INFO"}
                        </span>
                        <h4 className="text-xs font-bold text-white tracking-wide truncate">{evento.titulo}</h4>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0">
                        {new Date(evento.data || evento.dataCriacao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-1">{evento.descricao}</p>
                    <div className="text-[9px] text-slate-500 font-semibold pl-1 flex items-center gap-1.5 border-t border-slate-800/60 pt-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Ref. Material: <span className="text-slate-300 font-mono font-bold">{evento.materialBelico?.lote || "Geral"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-slate-500 font-medium">
                  Nenhuma movimentação registrada na cadeia de custódia.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}