"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import { toast } from "sonner";
import { 
  PlusCircle, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  ShieldAlert, 
  PackagePlus, 
  FileText, 
  Layers
} from "lucide-react";

export default function CadastroMaterialPage() {
  const [step, setStep] = useState(1);
  const [tipoMaterial, setTipoMaterial] = useState("fuzil"); // "fuzil" ou "municao"
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado do formulário unificado
  const [formData, setFormData] = useState({
    numeroSerie: "",
    modelo: "Daniel Defense M4A1 V7",
    calibreArma: "5.56x45mm",
    comprimentoCano: '14.5"',
    loteCodigo: "",
    calibreMunicao: "5.56x45mm",
    tipoProjetil: "Operacional (Comum)",
    quantidadeRecebida: "",
    carregadoresInclusos: "3",
    localArmazenamento: "Almoxarifado (P4)",
    documentoOrigem: "",
    armeiroResponsavel: "Sd. QP PM Hildo",
    observacoes: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // FUNÇÃO DE VALIDAÇÃO POR ETAPA (Trava o avanço se faltar dado)
  const isStepValid = () => {
    if (step === 1) {
      // Categoria sempre começa selecionada ("fuzil" ou "municao")
      return !!tipoMaterial;
    }
    if (step === 2) {
      if (tipoMaterial === "fuzil") {
        return formData.numeroSerie.trim() !== "" && formData.modelo.trim() !== "";
      } else {
        return formData.loteCodigo.trim() !== "" && formData.calibreMunicao.trim() !== "";
      }
    }
    if (step === 3) {
      if (tipoMaterial === "municao") {
        return formData.quantidadeRecebida.trim() !== "" && formData.localArmazenamento.trim() !== "";
      } else {
        return formData.carregadoresInclusos.trim() !== "" && formData.localArmazenamento.trim() !== "";
      }
    }
    if (step === 4) {
      return formData.documentoOrigem.trim() !== "";
    }
    return true;
  };

  const nextStep = () => {
    if (!isStepValid()) {
      toast.warning("Por favor, preencha todos os campos obrigatórios deste passo.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };
  
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Segunda barreira de segurança na submissão final
    if (step !== 4 || !isStepValid()) {
      toast.error("Formulário incompleto. Revise os passos anteriores.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Registrando material no sistema P4...");

    try {
      const response = await fetch("/api/material", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoMaterial,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao registrar o lote ou armamento.");
      }

      toast.success(
        `${tipoMaterial === "fuzil" ? "Armamento" : "Lote de munição"} tombado com sucesso!`, 
        { id: toastId }
      );

      // Reseta o formulário e volta para a primeira etapa
      setFormData({
        numeroSerie: "",
        modelo: "Daniel Defense M4A1 V7",
        calibreArma: "5.56x45mm",
        comprimentoCano: '14.5"',
        loteCodigo: "",
        calibreMunicao: "5.56x45mm",
        tipoProjetil: "Operacional (Comum)",
        quantidadeRecebida: "",
        carregadoresInclusos: "3",
        localArmazenamento: "Almoxarifado (P4)",
        documentoOrigem: "",
        armeiroResponsavel: "Sd. QP PM Hildo",
        observacoes: ""
      });
      setStep(1);

    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error(error.message || "Erro operacional no servidor.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    { title: "Classificação", desc: "Origem do material" },
    { title: "Especificações", desc: "Dados técnicos e série" },
    { title: "Logística interna", desc: "Volumes e depósitos" },
    { title: "Autenticação", desc: "Revisão e fechamento" }
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden p-4 gap-4 antialiased">
      
      {/* Menu Lateral */}
      <div className="w-80 h-full shrink-0">
        <Sidebar />
      </div>

      {/* Painel Principal */}
      <main className="flex-1 h-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="mb-6 shrink-0 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <PlusCircle className="text-blue-500" size={22} />
              Entrada de Material Tático / Cadastro P4
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Fluxo controlado em 4 etapas para recebimento, conferência e tombamento patrimonial de fuzis e insumos.
            </p>
          </div>
        </div>

        {/* Indicador de Progresso (4 Steps) */}
        <div className="grid grid-cols-4 gap-2 mb-6 shrink-0 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
          {stepTitles.map((item, idx) => {
            const currentIdx = idx + 1;
            const isCompleted = step > currentIdx;
            const isActive = step === currentIdx;

            return (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center border transition-all duration-300 ${
                  isCompleted ? "bg-blue-600 text-white border-blue-500" :
                  isActive ? "bg-slate-800 text-blue-400 border-blue-500 shadow-md shadow-blue-500/10" :
                  "bg-slate-900 text-slate-600 border-slate-800"
                }`}>
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : currentIdx}
                </div>
                <div className="hidden md:block">
                  <p className={`text-[10px] font-bold uppercase tracking-wider leading-none ${isActive ? "text-blue-400" : isCompleted ? "text-slate-300" : "text-slate-500"}`}>{item.title}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Área Centralizadora do Formulário */}
        <div className="flex-1 bg-slate-950/20 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-0">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0 overflow-y-auto p-6">
            
            {/* STEP 1: CLASSIFICAÇÃO */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-slate-800/60 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers size={14} className="text-blue-500" /> Seleção de Categoria
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Determine a natureza do item físico que está dando entrada no paiol.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setTipoMaterial("fuzil")}
                    className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-4 text-left w-full ${
                      tipoMaterial === "fuzil" 
                        ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5 text-white" 
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <ShieldAlert size={24} className={tipoMaterial === "fuzil" ? "text-blue-400" : "text-slate-500"} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-white">Armamento de Fogo Central *</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Cadastro individualizado de plataformas de assalto.</p>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setTipoMaterial("municao")}
                    className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-4 text-left w-full ${
                      tipoMaterial === "municao" 
                        ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5 text-white" 
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <PackagePlus size={24} className={tipoMaterial === "municao" ? "text-blue-400" : "text-slate-500"} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-white">Lote Coletivo de Munições *</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Entrada volumétrica de cartuchos por lote.</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ESPECIFICAÇÕES TÉCNICAS */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-800/60 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {tipoMaterial === "fuzil" ? "Especificações do Fuzil" : "Dados Físicos do Lote"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Insira os identificadores de rastreio balístico emitidos pelo fabricante.</p>
                </div>

                {tipoMaterial === "fuzil" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Número de Série (Baixo Receptor) *</label>
                      <input 
                        type="text" name="numeroSerie" required placeholder="Ex: DD-998877X" value={formData.numeroSerie} onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white uppercase focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Modelo Comercial *</label>
                      <select name="modelo" required value={formData.modelo} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500/50">
                        <option value="Daniel Defense M4A1 V7">Daniel Defense M4A1 V7</option>
                        <option value="Daniel Defense DDM4 V7 LW">Daniel Defense DDM4 V7 LW</option>
                        <option value="Daniel Defense MK18">Daniel Defense MK18</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Calibre Nominal</label>
                      <input type="text" disabled value={formData.calibreArma} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Comprimento do Cano</label>
                      <input type="text" name="comprimentoCano" value={formData.comprimentoCano} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Código identificador do Lote *</label>
                      <input 
                        type="text" name="loteCodigo" required placeholder="Ex: CBC-A2026" value={formData.loteCodigo} onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white uppercase focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Calibre do Lote *</label>
                      <select name="calibreMunicao" required value={formData.calibreMunicao} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500/50">
                        <option value="5.56x45mm NATO">5.56x45mm</option>
                        <option value="9x19mm Parabellum">9x19mm</option>
                        <option value=".40 S&W">.40 S&W</option>
                        <option value="12 GA">12 GA</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Especificação do Projétil</label>
                      <select name="tipoProjetil" value={formData.tipoProjetil} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500/50">
                        <option value="Operacional (Comum)">COMUM M193 - 55GR</option>
                        <option value="Operacional (Comum)">OTM (HPBT) - 77GR</option>
                        <option value="Traçante">Traçante</option>
                        <option value="Menos Que Letal (Borracha)">Menos Que Letal (Borracha)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: QUANTITATIVOS E LOGÍSTICA */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-800/60 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quantitativos e Armazenagem</h3>
                  <p className="text-xs text-slate-400 mt-1">Especifique as volumetrias e o local exato onde o material ficará sob custódia.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tipoMaterial === "municao" ? (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Quantidade de Cartuchos *</label>
                      <input 
                        type="number" name="quantidadeRecebida" required placeholder="Ex: 5000" value={formData.quantidadeRecebida} onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Carregadores Inclusos *</label>
                      <input type="number" name="carregadoresInclusos" required value={formData.carregadoresInclusos} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50" />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Destinação de Prateleira (Paiol Físico) *</label>
                    <input type="text" name="localArmazenamento" required value={formData.localArmazenamento} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: AUTENTICAÇÃO E REVISÃO */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-800/60 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} className="text-blue-500" /> Autenticidade e Notas Fiscais
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Último estágio do processo. Vincule o documento oficial e confira o resumo.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Nº do Boletim Interno / Nota de Empenho *</label>
                    <input type="text" name="documentoOrigem" required placeholder="Ex: BI nº 42/2026" value={formData.documentoOrigem} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Armeiro Recebedor</label>
                    <input type="text" disabled value={formData.armeiroResponsavel} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-500 font-bold" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Observações Adicionais</label>
                    <textarea name="observacoes" rows="2" value={formData.observacoes} onChange={handleInputChange} placeholder="Ex: Acessórios inclusos..." className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500/50 resize-none" />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-400">
                  <span className="font-bold text-blue-400">Resumo da Carga:</span> Gravando entrada de um(a) <span className="text-white font-bold">{tipoMaterial.toUpperCase()}</span> modelo <span className="text-white font-bold">{tipoMaterial === "fuzil" ? formData.modelo : formData.calibreMunicao}</span> identificação <span className="text-white font-mono font-bold">{tipoMaterial === "fuzil" ? formData.numeroSerie || "NÃO INFORMADO" : formData.loteCodigo || "NÃO INFORMADO"}</span>.
                </div>
              </div>
            )}

            {/* Controle de Navegação Inferior */}
            <div className="pt-4 border-t border-slate-800/60 mt-6 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1 || isSubmitting}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
                  step === 1 || isSubmitting
                    ? "opacity-30 border-slate-800 text-slate-600 cursor-not-allowed" 
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <ChevronLeft size={14} /> Voltar
              </button>

              {step < 4 ? (
                <button
                  type="button" 
                  onClick={nextStep}
                  // Opocional: estiliza o botão desativado visualmente caso queira desabilitar o clique completamente
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                    !isStepValid() ? "bg-blue-600/50 cursor-not-allowed opacity-60" : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/10"
                  }`}
                >
                  Avançar <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !isStepValid()}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-gradient-to-tr from-blue-600 to-blue-400 text-white transition-all shadow-lg shadow-blue-500/20 ${
                    isSubmitting || !isStepValid() ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Gravando..." : "Concluir Cadastro"}
                </button>
              )}
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}