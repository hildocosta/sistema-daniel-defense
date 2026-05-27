"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import { 
  FileSpreadsheet, 
  Search, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Wrench, 
  ExternalLink,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";

export default function ArsenalArmasPage() {
  // Mock dos dados reais dos Fuzis Daniel Defense do 17º BPM
  const [armas] = useState([
    { id: 1, modelo: "Fuzil 5.56 Daniel Defense", serie: "DD-5627", patrimonio: "100002385269", cia: "Almoxarifado", status: "Disponível", situacao: "Excelente" },
    { id: 2, modelo: "Fuzil 5.56 Daniel Defense", serie: "DD-9941", patrimonio: "100002385310", cia: "2ª Cia (Araucária)", status: "Disponível", situacao: "Excelente" },
    { id: 3, modelo: "Fuzil 5.56 Daniel Defense", serie: "DD-1245", patrimonio: "100002385412", cia: "1ª Cia (Sede)", status: "Acautelado", situacao: "Bom" },
    { id: 4, modelo: "Fuzil 5.56 Daniel Defense", serie: "DD-8821", patrimonio: "100002385105", cia: "CIAOP / PPTRAN", status: "Disponível", situacao: "Excelente" },
    { id: 5, modelo: "Fuzil 5.56 Daniel Defense", serie: "DD-4112", patrimonio: "100002385962", cia: "3ª Cia (Sede)", status: "Manutenção", situacao: "Reparo no Retém" },
    { id: 6, modelo: "Fuzil 5.56 Daniel Defense", serie: "DD-7536", patrimonio: "100002385741", cia: "4ª Cia (Sede)", status: "Acautelado", situacao: "Bom" },
    { id: 7, modelo: "Fuzil 5.56 Daniel Defense", serie: "DD-3321", patrimonio: "100002385632", cia: "Almoxarifado", status: "Disponível", situacao: "Excelente" },
  ]);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  // Filtros dinâmicos em tempo de execução
  const armasFiltradas = armas.filter(arma => {
    const correspondeBusca = 
      arma.serie.toLowerCase().includes(busca.toLowerCase()) ||
      arma.patrimonio.includes(busca) ||
      arma.cia.toLowerCase().includes(busca.toLowerCase());
    
    const correspondeStatus = filtroStatus === "Todos" || arma.status === filtroStatus;

    return correspondeBusca && correspondeStatus;
  });

  // Indicadores volumétricos baseados na dotação total (28 armas)
  const totalArmas = 28; 
  const disponiveis = armas.filter(a => a.status === "Disponível").length + 21; 
  const acautelados = armas.filter(a => a.status === "Acautelado").length;
  const manutencao = armas.filter(a => a.status === "Manutenção").length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Disponível": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Acautelado": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Manutenção": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
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
              <FileSpreadsheet className="text-blue-500" size={22} />
              Arsenal de Armas (Dotação Daniel Defense)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Controle individualizado por número de série, localização patrimonial e estado de prontidão operacional.
            </p>
          </div>
        </div>

        {/* Cards de Status Superiores */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5 shrink-0">
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Dotação Total</p>
              <p className="text-xl font-black text-white mt-0.5">{totalArmas}</p>
            </div>
            <div className="p-2 bg-slate-800 text-slate-400 rounded-lg border border-slate-700">
              <Shield size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Disponíveis (Prontidão)</p>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{disponiveis}</p>
            </div>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/10">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Acautelados (Em Escala)</p>
              <p className="text-xl font-black text-blue-400 mt-0.5">{acautelados}</p>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/10">
              <ShieldAlert size={16} />
            </div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Em Manutenção</p>
              <p className="text-xl font-black text-rose-400 mt-0.5">{manutencao}</p>
            </div>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/10">
              <Wrench size={16} />
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="mb-4 shrink-0 flex flex-col sm:flex-row gap-3 items-center justify-between p-3 bg-slate-950/30 border border-slate-800/60 rounded-xl">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Buscar por Série, Patr. ou Cia..."
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
              <option value="Todos">Todos os Status</option>
              <option value="Disponível">Disponível</option>
              <option value="Acautelado">Acautelado</option>
              <option value="Manutenção">Manutenção</option>
            </select>
          </div>
        </div>

        {/* Tabela do Arsenal */}
        <div className="flex-1 bg-slate-950/20 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          {/* Aplicada a classe utilitária global para scrollbars escuras */}
          <div className="flex-1 overflow-y-auto min-h-0 container-sombrio">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/80 sticky top-0 backdrop-blur-md border-b border-slate-800 z-10">
                <tr>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Armamento Spec</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Nº de Série</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Patrimônio</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Subunidade Alocada</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Status</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {armasFiltradas.length > 0 ? (
                  armasFiltradas.map((arma) => (
                    <tr key={arma.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-bold text-white tracking-wide">{arma.modelo}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs text-slate-300 font-bold">{arma.serie}</td>
                      <td className="p-3 font-mono text-xs text-slate-400">{arma.patrimonio}</td>
                      <td className="p-3 text-xs text-slate-300 font-medium">{arma.cia}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border inline-block min-w-[90px] text-center ${getStatusStyle(arma.status)}`}>
                          {arma.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Link href={`/dashboard/armas/${arma.id}`}>
                          <button 
                            title="Ver Ficha Completa"
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
                    <td colSpan="6" className="text-center py-12 text-xs text-slate-500 font-medium">
                      Nenhum fuzil localizado para os critérios informados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Rodapé Informativo */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[10px] text-slate-500 font-semibold tracking-wide flex justify-between items-center shrink-0">
            <span>Mostrando {armasFiltradas.length} de {armas.length} registros listados</span>
            <span className="text-slate-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Carga Homologada P4</span>
          </div>
        </div>

      </main>
    </div>
  );
}