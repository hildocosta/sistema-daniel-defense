"use client";

export default function ActionButton({ 
  onClick, 
  icon: Icon,
  label, 
  className = "",
  type = "button", 
  loading = false, 
  loadingText = "CARREGANDO...",
  fullWidth = false 
}) {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`
        flex items-center justify-center gap-2 
        bg-linear-to-tr from-[#1a73e8] to-[#63a4ff] 
        text-white px-6 py-3 rounded-2xl text-[11px] 
        font-black uppercase tracking-widest shadow-xl 
        shadow-blue-500/25 hover:scale-[1.03] active:scale-95 
        transition-all cursor-pointer disabled:opacity-70 
        disabled:cursor-not-allowed disabled:hover:scale-100
        ${fullWidth ? "w-full" : ""} 
        ${className}
      `}
    >
      {!loading && Icon && <Icon size={16} strokeWidth={3} />}
      
      {loading ? loadingText : label}
    </button>
  );
}