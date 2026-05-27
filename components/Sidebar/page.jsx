"use client";

import { useState } from "react"; 
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard,   
  Shield,          
  FileSpreadsheet,  
  PlusCircle,    
  LogOut,
  Loader2,
  ChevronRight,
  History,
  Box
} from "lucide-react";

// Itens de menu adaptados para o gerenciamento de Armamento, Munições e novos cadastros
const menuItems = [
  { name: "Painel Geral", icon: LayoutDashboard, path: "/" }, 
  { name: "Arsenal de Armas", icon: FileSpreadsheet, path: "/dashboard/armas" }, 
  { name: "Controle de Munições", icon: Box, path: "/dashboard/municoes" },
  { name: "Entrada de Material", icon: PlusCircle, path: "/dashboard/cadastro" }, 
  { name: "Distribuição (Cias)", icon: Shield, path: "/dashboard/companhias" },  
  { name: "Histórico de Movimentações", icon: History, path: "/dashboard/historico" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault(); 
    setIsLoggingOut(true); 
    
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <aside className="w-full h-full bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between overflow-hidden">
      
      {/* Cabeçalho com Identidade do 17º BPM e Nome do Sistema */}
      <div className="flex items-center px-5 py-6 border-b border-slate-800/50 shrink-0">
        <div className="relative w-12 h-12 shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/40 p-1 border border-slate-800/60 shadow-inner">
          <Image 
            src="/image/bg-profile.png" // CORRIGIDO: Removido o "/public" para o Next.js mapear corretamente
            alt="Logo 17º BPM" 
            width={48} 
            height={48}
            priority 
            className="select-none object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <div className="flex flex-col ml-3.5">
          <span className="text-white font-extrabold tracking-widest text-sm uppercase leading-none">
            17º BPM
          </span>
          <span className="text-[10px] text-blue-400 font-bold tracking-wider mt-1.5 whitespace-nowrap uppercase">
            Daniel Defense - P4
          </span>
        </div>
      </div>

      <div className="px-6 shrink-0">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>

      {/* Navegação do Dashboard - Ajustado para justify-start para evitar desalinhamento vertical */}
      <nav className="flex-1 flex flex-col justify-start space-y-1.5 py-6 overflow-y-auto container-sombrio">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          const isActive = item.path === "/" 
            ? pathname === item.path 
            : pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link key={item.path} href={item.path} className="block px-4">
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/10" 
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}>
                <div className="flex items-center gap-3">
                  <Icon 
                    size={18} 
                    className={`transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} 
                  />
                  <span className="text-[13px] tracking-wide">{item.name}</span>
                </div>
                
                {isActive && (
                  <ChevronRight size={14} className="text-white/70 animate-in fade-in slide-in-from-left-1" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 shrink-0">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>
      
      {/* Botão de Sair */}
      <div className="w-full px-4 pt-6 mb-8 shrink-0">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 m-0 cursor-pointer
            ${isLoggingOut ? "opacity-70 bg-slate-600 cursor-not-allowed text-white" : "botao-logout-militar"}`}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Saindo...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span className="font-bold uppercase text-xs tracking-widest">Sair</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}