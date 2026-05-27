export default function Input({ label, type, value, onChange, placeholder, children }) {
  return (
    <div className="mb-4 relative group">
      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 ml-1 tracking-tight">
        {label}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 bg-transparent placeholder-gray-400 text-sm ${
            children ? "pr-10" : ""
          }`}
          placeholder={placeholder} 
          required
        />
        
        {children}
      </div>
    </div>
  );
}