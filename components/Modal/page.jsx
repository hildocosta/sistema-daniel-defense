import { AlertTriangle, Loader2 } from "lucide-react";

// 💡 Correção: Adicionado "export default" para o Next.js conseguir importar este componente
export default function ConfirmModal({ isOpen, onClose, onConfirm, serie, isDeletando }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/50 flex flex-col items-center text-center animate-in scale-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone de Alerta */}
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
          <AlertTriangle size={24} />
        </div>

        {/* Título */}
        <h3 className="text-base font-bold text-white tracking-tight">
          CONFIRMAÇÃO DO P4
        </h3>

        {/* Descrição */}
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Deseja realmente remover em definitivo o etilômetro de Série{" "}
          <span className="font-mono font-bold text-rose-400">[{serie}]</span> da base de dados do 17º BPM? Esta ação não poderá ser desfeita.
        </p>

        {/* Ações */}
        <div className="flex items-center gap-3 w-full mt-6">
          <button
            type="button"
            disabled={isDeletando}
            onClick={onClose}
            className="flex-1 py-2 px-4 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            disabled={isDeletando}
            onClick={onConfirm}
            className="flex-1 py-2 px-4 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeletando ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <span>Confirmar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}