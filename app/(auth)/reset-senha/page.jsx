"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

import Input from "../../../components/Input/Input";
import ActionButton from "../../../components/ActionButton/ActionButton";
import Footer from "../../../components/Footer/Footer";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("A SENHA DEVE TER NO MÍNIMO 6 CARACTERES.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("AS SENHAS DIGITADAS NÃO CONFEREM.");
      setIsLoading(false);
      return;
    }

    
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
      
    
      <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-blue-600 to-black pointer-events-none" />

      
      <div className="relative w-full max-w-sm z-10 mt-8 mb-12">
        
        
        <header className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white p-2.5 rounded-full shadow-xl border-[3px] border-slate-100 flex items-center justify-center">
            <Image 
              src="/assets/image/bg-profile.png" 
              alt="Logo 17BPM" 
              width={60} 
              height={60} 
              className="object-contain"
              priority 
            />
          </div>
        </header>

        
        <div className="bg-white rounded-2xl shadow-2xl p-6 pt-14 pb-6 border border-slate-100">
          {!isSuccess ? (
            
            <>
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-700 tracking-tight">Nova Senha</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Etilômetros - 17º BPM</p>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-4 animate-pulse">
                  <p className="text-red-700 text-[9px] text-center font-bold uppercase tracking-widest leading-tight">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-2.5">
                <Input 
                  label="NOVA SENHA" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Digite sua nova senha..." 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-blue-600 transition-all"
                    tabIndex="-1" 
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </Input>

                <Input 
                  label="CONFIRMAR NOVA SENHA" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirme sua nova senha..." 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                >
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-blue-600 transition-all"
                    tabIndex="-1" 
                  >
                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </Input>

                <div className="pt-3">
                  <ActionButton 
                    label="ATUALIZAR SENHA"
                    type="submit"
                    loading={isLoading}
                    fullWidth={true}
                  />
                </div>
                
                
                <div className="text-center text-[11px] text-slate-500 pt-4 border-t border-slate-50 mt-4">
                  Lembrou a senha?{" "}
                  <Link 
                    href="/login" 
                    className="text-blue-500 font-bold hover:underline transition-all"
                  >
                    Voltar ao Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            
            <div className="text-center">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-700 tracking-tight">Senha Alterada!</h2>
                <p className="text-[12px] text-slate-400 mt-0.5">Etilômetros - 17º BPM</p>
              </div>

              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              
              <div className="space-y-3 mb-5">
                <p className="text-[11px] text-slate-500 leading-relaxed px-2">
                  Sua nova credencial foi registrada com sucesso.<br/>
                  <span className="text-slate-700 font-medium">Você já pode acessar o sistema com segurança.</span>
                </p>
              </div>

              <ActionButton 
                label="IR PARA O LOGIN"
                onClick={() => router.push("/login")}
                fullWidth={true}
              />
            </div>
          )}
        </div>
      </div>

      
      <div className="absolute bottom-4 w-full z-10">
        <Footer />
      </div>
    </main>
  );
}