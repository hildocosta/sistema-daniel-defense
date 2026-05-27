"use client";

import React, { useState } from "react";
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
  History
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function DashboardPage() {
  // Dados estáveis extraídos diretamente da sua planilha oficial
  const [inventario] = useState({
    armas: [
      { id: 1, tipo: "ARMAMENTO", marca: "DANIEL DEFENSE", descricao: "FUZIL", status: "Disponível", cia: "Almoxarifado", quantidade: 28 }
    ],
    municoes: [
      { id: 1, tipo: "LETAL", lote: "GLC30", marca: "CBC", descricao: "Munição Comum M193 - 55GR", finalidade: "Instrução", quantidade: 1800, utilizacao: 0, estoqueMinimo: 2000 },
      { id: 2, tipo: "LETAL", lote: "GLC55", marca: "CBC", descricao: "Munição Comum M193 - 55GR", finalidade: "Instrução", quantidade: 10000, utilizacao: 0, estoqueMinimo: 3000 },
      { id: 3, tipo: "LETAL", lote: "HBL29", marca: "CBC", descricao: "Munição OTM (HPBT) - 77GR", finalidade: "Operacional", quantidade: 2500, utilizacao: 0, estoqueMinimo: 1000 }
    ],
    historicoEventos: [
      { id: 1, tipo: "INFORMATIVO", titulo: "Abertura de Carga de Munição", descricao: "Lote GLC30 recebido e conferido para fins de Instrução de Tiro.", data: "25/05/2026, 06:30", loteReferencia: "GLC30" },
      { id: 2, tipo: "INFORMATIVO", titulo: "Dotação Operacional HBL29", descricao: "Munições OTM de alta precisão alocadas na reserva de armas.", data: "24/05/2026, 21:29", loteReferencia: "HBL29" },
      { id: 3, tipo: "INFORMATIVO", titulo: "Conferência de Fuzis Daniel Defense", descricao: "Carga de 28 fuzis inspecionada e liberada para escala pelo P4.", data: "24/05/2026, 21:28", loteReferencia: "DANIEL DEFENSE" }
    ]
  });

  const processarDadosPlanilha = () => {
    let totalArmas = 0;
    inventario.armas.forEach(a => totalArmas += a.quantidade);

    let totalCartuchos = 0;
    let municaoOperacional = 0;
    let municaoInstrucao = 0;
    let alertasEstoque = [];

    inventario.municoes.forEach((lote) => {
      const saldoAtual = lote.quantidade - lote.utilizacao;
      totalCartuchos += saldoAtual;

      if (lote.finalidade.toLowerCase() === "operacional") {
        municaoOperacional += saldoAtual;
      } else if (lote.finalidade.toLowerCase() === "instrução") {
        municaoInstrucao += saldoAtual;
      }

      if (saldoAtual < lote.estoqueMinimo) {
        alertasEstoque.push({
          identificador: `Lote: ${lote.lote} (${lote.finalidade})`,
          subunidade: "Estoque Crítico",
          detalhe: `Saldo atual: ${saldoAtual} un.`
        });
      }
    });

    return {
      totalArmas,
      totalCartuchos,
      municaoOperacional,
      municaoInstrucao,
      alertas: alertasEstoque
    };
  };

  const dadosReais = processarDadosPlanilha();

  const graficoDados = [
    { name: "Munição Operacional", valor: dadosReais.municaoOperacional, fill: "#2563eb" },
    { name: "Munição Instrução", valor: dadosReais.municaoInstrucao, fill: "#f59e0b" },
    { name: "Fuzis em Carga", valor: dadosReais.totalArmas, fill: "#10b981" }
  ];

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
              Gerenciamento estrito de dotação belica, controle volumétrico de lotes de cartuchos e fluxo operacional/instrução.
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 flex items-center gap-2 shrink-0">
            <Activity size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Modo Demonstração Planilha Ativo</span>
          </div>
        </div>

        {/* CORREÇÃO DOS CARDS: Utilizando flex-wrap dinâmico com controle fino de espaço interno */}
        <div className="flex flex-wrap gap-3 mb-5 shrink-0 w-full">
          
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">Carga de Fuzis</p>
              <p className="text-xl font-black text-white mt-0.5">{dadosReais.totalArmas}</p>
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
              <p className="text-xl font-black text-white mt-0.5">{dadosReais.totalCartuchos}</p>
            </div>
            <div className="p-2 bg-slate-500/10 text-slate-400 rounded-lg border border-slate-800 shrink-0 ml-2">
              <Box size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider truncate">Uso Operacional</p>
              <p className="text-xl font-black text-blue-400 mt-0.5">{dadosReais.municaoOperacional}</p>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10 shrink-0 ml-2">
              <Flame size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between flex-1 min-w-[180px] h-20">
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider truncate">Carga Instrução</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">{dadosReais.municaoInstrucao}</p>
            </div>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/10 shrink-0 ml-2">
              <Target size={16} />
            </div>
          </div>

        </div>

        {/* Gráfico e Histórico Recente */}
        <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
          
          {/* Gráfico Analítico */}
          <div className="w-5/12 bg-slate-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden">
            <div className="border-b border-slate-800/80 pb-3 mb-4 shrink-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle size={14} className="text-blue-500" /> Distribuição de Recursos Belicos
              </h2>
            </div>

            <div className="flex-1 relative min-h-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={graficoDados} innerRadius="60%" outerRadius="80%" paddingAngle={6} dataKey="valor" stroke="none">
                    {graficoDados.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #334155", color: "#fff", fontSize: "11px" }} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={8} formatter={(value) => <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider px-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+14px)] text-center pointer-events-none">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Saldo Geral</p>
                <p className="text-2xl font-black text-white mt-0.5">
                  {dadosReais.totalArmas + dadosReais.totalCartuchos}
                </p>
              </div>
            </div>

            {dadosReais.alertas.length > 0 && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 shrink-0">
                <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                <span className="text-[10px] text-rose-300 font-medium leading-tight">
                  Estoque de munição do lote <strong>GLC30</strong> está abaixo da margem mínima estabelecida!
                </span>
              </div>
            )}
          </div>

          {/* Histórico Recente de Alterações */}
          <div className="w-7/12 bg-slate-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden">
            <div className="border-b border-slate-800/80 pb-3 mb-4 flex justify-between items-center shrink-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <History size={14} className="text-blue-500" /> Relatórios de Uso e Linha do Tempo
              </h2>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold border border-slate-700">
                Total Eventos: {inventario.historicoEventos.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar min-h-0">
              {inventario.historicoEventos.map((evento) => (
                <div key={evento.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase shrink-0">
                        {evento.tipo}
                      </span>
                      <h4 className="text-xs font-bold text-white tracking-wide truncate">{evento.titulo}</h4>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono shrink-0">{evento.data}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-1">{evento.descricao}</p>
                  <div className="text-[9px] text-slate-500 font-semibold pl-1 flex items-center gap-1.5 border-t border-slate-800/60 pt-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Identificador Técnico: <span className="text-slate-300 font-mono font-bold">{evento.loteReferencia}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}