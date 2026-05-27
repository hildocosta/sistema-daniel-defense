"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/page";
import { 
  ArrowLeft, 
  Shield, 
  Cpu, 
  Calendar, 
  Wrench, 
  FileText,
  AlertTriangle,
  Loader2,
  Info,
  Target,
  X
} from "lucide-react";

export default function DetalhesArmamentoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [arma, setArma] = useState(null);
  const [listaHistoricos, setListaHistoricos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalAtivo, setModalAtivo] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError(false);
        const origin = window.location.origin;
        const resArma = await fetch(`${origin}/api/armas/${id}`);
        
        if (!resArma.ok) {
          throw new Error("Equipamento offline. Carregando dados locais homologados.");
        }
        
        const dadosArma = await resArma.json();
        setArma(dadosArma);
        setListaHistoricos(dadosArma.historicos || []);

      } catch (err) {
        const bancoMockArmas = {
          "1": { id: 1, equipamento: "Fuzil 5.56 Daniel Defense", serie: "DD-5627", patrimonio: "100002385269", cia: "Almoxarifado (P4)", responsavel: "Cap. QOPM Chefe da Seção", status: "Disponível", carregadores: 4, bandoleira: "Magpul MS4", otica: "Mira Holográfica EOTech EXPS3", ultimaInspecao: "2026-03-15", proximaInspecao: "2026-09-15", observacoes: "Fuzil de dotação oficial do Batalhão, armazenado na reserva de armas central. Estado de conservação excelente e lubrificação em dia." },
          "2": { id: 2, equipamento: "Fuzil 5.56 Daniel Defense", serie: "DD-9941", patrimonio: "100002385310", cia: "2ª Cia (Araucária)", responsavel: "Sgt. CMT da Equipe Alfa", status: "Disponível", carregadores: 4, bandoleira: "Magpul MS4", otica: "Massa/Alça de Mira Padrão", ultimaInspecao: "2026-04-10", proximaInspecao: "2026-10-10", observacoes: "Armamento tático destacado para policiamento ostensivo e radiopatrulha na subunidade de Araucária." },
          "3": { id: 3, equipamento: "Fuzil 5.56 Daniel Defense", serie: "DD-1245", patrimonio: "100002385412", cia: "1ª Cia (Sede)", responsavel: "Sd. 1º Classe Escutado", status: "Acautelado", carregadores: 4, bandoleira: "Padrão DD", otica: "Red Dot Aimpoint Micro T-2", ultimaInspecao: "2026-05-01", proximaInspecao: "2026-11-01", observacoes: "Cautela ativa expedida via Boletim Interno para emprego tático em operações especiais da sede." },
          "5": { id: 5, equipamento: "Fuzil 5.56 Daniel Defense", serie: "DD-4112", patrimonio: "100002385962", cia: "3ª Cia (Sede)", responsavel: "Seção de Manutenção Bélica", status: "Manutenção", carregadores: 0, bandoleira: "Removida", otica: "Mecanismo Desmontado", ultimaInspecao: "2026-05-20", proximaInspecao: "2026-06-05", observacoes: "Retida na oficina para substituição do retém do ferrolho e mola recuperadora. Bloqueada para escalas de serviço." }
        };

        const armaEncontrada = bancoMockArmas[String(id)];

        if (armaEncontrada) {
          setArma(armaEncontrada);
          
          const mockHistoricos = [
            { id: 101, tipo: "Inspecao", data: "2026-05-20T14:30:00Z", titulo: "Inspeção Trimestral de Armamento", descricao: "Verificação do cano, percutor e engatilhamento efetuados pelo P4. Nenhum sinal de corrosão ou fadiga encontrado." },
            { id: 102, tipo: "Alerta", data: "2026-04-15T09:15:00Z", titulo: "Registro de Disparos em Instrução", descricao: "Efetuados 120 disparos em stand de tiro. Limpeza em primeiro escalão realizada pelo operador logo após o término." },
            { id: 103, tipo: "Critico", data: "2026-03-02T11:00:00Z", titulo: "Substituição de Guarda-Mão (Handguard)", descricao: "Manutenção de segundo escalão corretiva por desgaste no trilho Picatinny superior." }
          ];
          
          if (armaEncontrada.status === "Manutenção") {
            mockHistoricos.unshift({
              id: 100,
              tipo: "Critico",
              data: new Date().toISOString(),
              titulo: "Recolhimento para Oficina",
              descricao: "Arma apresentou falha na retenção do ferrolho ao término do carregador em ambiente operacional. Encaminhada para reparos."
            });
          }

          setListaHistoricos(mockHistoricos);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      carregarDados();
    }
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Disponível": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "Acautelado": return "bg-blue-500/10 text-blue-400 border-blue-500/25";
      case "Manutenção": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/25";
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Não informada";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    } catch {
      return dataString;
    }
  };

  const formatarDataHora = (dataString) => {
    if (!dataString) return "Sem data";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dataString;
    }
  };

  const getHistoricoEstilo = (tipo) => {
    const t = String(tipo || "").toLowerCase();
    if (t.includes("crit") || t.includes("recolh") || t.includes("falha")) {
      return { cor: "bg-rose-500", linha: "border-rose-500/30" };
    }
    if (t.includes("alerta") || t.includes("tiro") || t.includes("instruc")) {
      return { cor: "bg-amber-500", linha: "border-amber-500/30" };
    }
    return { cor: "bg-emerald-500", linha: "border-emerald-500/30" };
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 p-4 gap-4">
        <div className="w-80 h-full shrink-0"><Sidebar /></div>
        <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="text-blue-500 animate-spin mb-3" size={32} />
          <p className="text-xs">Sincronizando armamento bélico com o Neon Postgres...</p>
        </main>
      </div>
    );
  }

  if (error || !arma) {
    return (
      <div className="flex h-screen w-screen bg-slate-950 p-4 gap-4">
        <div className="w-80 h-full shrink-0"><Sidebar /></div>
        <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-400">
          <AlertTriangle className="text-rose-500 mb-2" size={32} />
          <p className="font-semibold text-white">Armamento não localizado</p>
          <p className="text-xs text-slate-500 mt-1">O número identificador de arsenal não consta na base do 17º BPM.</p>
          <button onClick={() => router.push("/dashboard/armas")} className="mt-4 text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all cursor-pointer">
            Voltar ao Arsenal
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased relative">
      
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-y-auto container-sombrio">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-5 mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard/armas")} 
              className="p-2 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white tracking-tight">{arma.equipamento}</h2>
                <span className="font-mono bg-slate-950 text-slate-400 border border-slate-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                  SÉRIE: {arma.serie}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Ficha histórica militar, kits vinculados e prontidão de emprego.</p>
            </div>
          </div>

          <span className={`inline-block px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border text-center whitespace-nowrap min-w-[140px] ${getStatusStyle(arma.status)}`}>
            {arma.status}
          </span>
        </div>

        {/* Grid de Blocos Técnicos Operacionais */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-6 shrink-0">
          
          {/* Card 1: Especificações */}
          <div 
            onClick={() => setModalAtivo("especificacoes")}
            className="card-tatico bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
          >
            <h3 className="titulo-card text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 transition-colors duration-200">
              <Cpu size={14} className="icone-card text-blue-500 transition-all duration-200" /> 
              Especificações
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Nº de Patrimônio:</span>
                <span className="font-mono font-bold text-blue-400 text-right">{arma.patrimonio}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Calibre Oficial:</span>
                <span className="font-bold text-slate-200 text-right">5.56x45mm NATO</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <span className="text-slate-500">Plataforma:</span>
                <span className="font-semibold text-slate-400 text-right">AR-15 M4 Spec</span>
              </div>
            </div>
          </div>

          {/* Card 2: Custódia Atual */}
          <div 
            onClick={() => setModalAtivo("custodia")}
            className="card-tatico bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
          >
            <h3 className="titulo-card text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 transition-colors duration-200">
              <Shield size={14} className="icone-card text-blue-500 transition-all duration-200" /> 
              Custódia Atual
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Subunidade Alocada:</span>
                <span className="font-bold text-slate-200 text-right">{arma.cia}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Detentor Fiscal:</span>
                <span className="font-bold text-slate-300 text-right truncate max-w-[130px]" title={arma.responsavel}>
                  {arma.responsavel}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <span className="text-slate-500">Unidade:</span>
                <span className="font-medium text-slate-500 text-right">17º BPM</span>
              </div>
            </div>
          </div>

          {/* Card 3: Componentes / Kit */}
          <div 
            onClick={() => setModalAtivo("componentes")}
            className="card-tatico bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
          >
            <h3 className="titulo-card text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 transition-colors duration-200">
              <Target size={14} className="icone-card text-blue-500 transition-all duration-200" /> 
              Componentes / Kit
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Carregadores Inclusos:</span>
                <span className="font-bold text-slate-200 text-right">{arma.carregadores} un.</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Aparelho de Pontaria:</span>
                <span className="font-medium text-slate-300 text-right truncate max-w-[130px]" title={arma.otica}>
                  {arma.otica}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <span className="text-slate-500">Bandoleira Fixada:</span>
                <span className="font-medium text-slate-400 text-right truncate max-w-[130px]">{arma.bandoleira}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Vistorias e Prontidão */}
          <div 
            onClick={() => setModalAtivo("vistorias")}
            className="card-tatico bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
          >
            <h3 className="titulo-card text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 transition-colors duration-200">
              <Calendar size={14} className="icone-card text-blue-500 transition-all duration-200" /> 
              Vistorias e Prontidão
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Última Inspeção Bélica:</span>
                <span className="font-semibold text-slate-300 text-right">{formatarData(arma.ultimaInspecao)}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] border-b border-slate-800/40 pb-2 gap-2">
                <span className="text-slate-500">Próxima Revisão P4:</span>
                <span className={`font-bold text-right ${arma.status === "Manutenção" ? "text-rose-400" : "text-emerald-400"}`}>
                  {formatarData(arma.proximaInspecao)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <span className="text-slate-500">Condição do Cano:</span>
                <span className={`font-bold text-right ${arma.status === "Manutenção" ? "text-rose-400" : "text-emerald-400"}`}>
                  {arma.status === "Manutenção" ? "Retido Oficina" : "Pronto p/ Combate"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Parecer de Livro de Carga */}
        <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5 mb-6 flex flex-col gap-3 shrink-0">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} className="text-blue-500" /> Parecer de Livro Geral de Carga
          </h3>
          <p className="text-xs text-slate-300 bg-slate-950/50 p-4 border border-slate-800/60 rounded-lg font-medium leading-relaxed">
            {arma.observacoes}
          </p>
        </div>

        {/* Linha do Tempo */}
        <div className="bg-slate-950/10 rounded-xl border border-slate-800 flex flex-col flex-1 min-h-[280px]">
          <div className="p-4 bg-slate-900/50 border-b border-slate-800 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench size={14} className="text-blue-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Histórico de Alterações, Disparos e Laudos do Fuzil</h3>
            </div>
            <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono font-bold">
              Eventos Mapeados: {listaHistoricos.length}
            </span>
          </div>
          
          <div className="p-5 flex-1 overflow-y-auto space-y-5 container-sombrio">
            {listaHistoricos.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 py-12 gap-2">
                <Info size={20} className="text-slate-600" />
                <p className="text-xs">Nenhum laudo técnico inserido para esta arma de fogo.</p>
              </div>
            ) : (
              listaHistoricos.map((hist, index) => {
                const estilo = getHistoricoEstilo(hist.tipo);
                return (
                  <div 
                    key={hist.id} 
                    className={`relative pl-6 space-y-1 ${
                      index !== listaHistoricos.length - 1 ? `border-l-2 ${estilo.linha}` : "border-l-2 border-transparent"
                    }`}
                  >
                    <div className={`absolute w-2.5 h-2.5 rounded-full ${estilo.cor} -left-[6px] top-1.5 shadow-sm`} />
                    
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800/80 tabular-nums">
                        {formatarDataHora(hist.data)}
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        {hist.titulo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-5xl pt-0.5">
                      {hist.descricao}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>

      {/* MODAL DINÂMICO */}
      {modalAtivo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all"
          onClick={() => setModalAtivo(null)}
        >
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative flex flex-col gap-5 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setModalAtivo(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {modalAtivo === "especificacoes" && (
              <>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Cpu size={18} className="text-blue-500" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Especificações Detalhadas</h3>
                </div>
                <div className="space-y-3.5 pt-1">
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Modelo</span><span className="font-bold text-white">{arma.equipamento}</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Nº de Série</span><span className="font-mono font-bold text-slate-300">{arma.serie}</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Nº de Patrimônio</span><span className="font-mono font-bold text-blue-400">{arma.patrimonio}</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Calibre Oficial</span><span className="font-bold text-slate-300">5.56x45mm NATO</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Plataforma Base</span><span className="font-semibold text-slate-300">AR-15 / M4 Custom</span></div>
                </div>
              </>
            )}

            {modalAtivo === "custodia" && (
              <>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Shield size={18} className="text-blue-500" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Detalhamento de Custódia</h3>
                </div>
                <div className="space-y-3.5 pt-1">
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Organização Militar</span><span className="font-bold text-white">17º Batalhão de Polícia Militar</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Subunidade Responsável</span><span className="font-bold text-blue-400">{arma.cia}</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Detentor Fiscal Direto</span><span className="font-bold text-slate-200">{arma.responsavel}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Status de Atribuição</span><span className="font-medium text-slate-400">Carga Patrimonial do Estado</span></div>
                </div>
              </>
            )}

            {modalAtivo === "componentes" && (
              <>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Target size={18} className="text-blue-500" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Kit de Componentes Acoplados</h3>
                </div>
                <div className="space-y-3.5 pt-1">
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Carregadores Vinculados</span><span className="font-bold text-white">{arma.carregadores} unidades inclusas</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Sistema de Mira (Ótica)</span><span className="font-semibold text-slate-200">{arma.otica}</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Bandoleira Instalada</span><span className="font-medium text-slate-300">{arma.bandoleira}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Acessórios Extras</span><span className="text-xs text-slate-500 italic">Trilho Picatinny original e handguard integrado.</span></div>
                </div>
              </>
            )}

            {modalAtivo === "vistorias" && (
              <>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Calendar size={18} className="text-blue-500" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Controle de Vistorias e Prontidão</h3>
                </div>
                <div className="space-y-3.5 pt-1">
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Última Inspeção Geral</span><span className="font-semibold text-slate-200">{formatarData(arma.ultimaInspecao)}</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Próxima Revisão Escalonada</span><span className={`font-bold ${arma.status === "Manutenção" ? "text-rose-400" : "text-emerald-400"}`}>{formatarData(arma.proximaInspecao)}</span></div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-2.5"><span className="text-slate-400">Estado Fisiológico do Cano</span><span className="font-medium text-slate-300">Raiamento íntegro - Sem obstruções</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Prontidão Operacional</span><span className={`font-bold uppercase ${arma.status === "Manutenção" ? "text-rose-500" : "text-emerald-500"}`}>{arma.status === "Manutenção" ? "Bloqueado para uso" : "Pronto para combate"}</span></div>
                </div>
              </>
            )}
            
            <div className="flex justify-end pt-2 border-t border-slate-800/60">
              <button 
                onClick={() => setModalAtivo(null)}
                className="px-4 py-2 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Fechar Visualização
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}