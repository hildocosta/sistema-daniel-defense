export default function Footer({ light = false }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className={`w-full py-6 flex flex-col md:flex-row items-center justify-between px-6 text-[11px] gap-4 transition-all ${
        light ? "text-slate-500" : "text-white/80"
      }`}
    >
      <div className="flex items-center gap-1.5 tracking-wide">
        <span>© {currentYear}, by</span>
        <a 
          href="https://github.com/hildocosta" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-bold hover:text-blue-400 cursor-pointer transition-all border-b border-transparent hover:border-blue-400"
        >
          Hildo Costa
        </a>
      </div>

      <div className="flex gap-6 font-bold uppercase tracking-widest">
        <a 
          href="#" 
          className="hover:text-blue-400 transition-all cursor-pointer"
        >
          Sobre mim
        </a>
      </div>
    </footer>
  );
}