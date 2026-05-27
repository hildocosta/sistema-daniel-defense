"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import Input from "../../../components/Input/Input";
import ActionButton from "../../../components/ActionButton/ActionButton";
import Footer from "../../../components/Footer/Footer";

const registerSchema = z.object({
  name: z.string().min(3, "O NOME DEVE TER PELO MENOS 3 LETRAS.").max(50, "NOME MUITO LONGO."),
  email: z.string().email("INSIRA UM E-MAIL VÁLIDO."),
  password: z.string().min(8, "A SENHA DEVE TER PELO MENOS 8 CARACTERES.")
});

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const validation = registerSchema.safeParse({ name, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message.toUpperCase());
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) throw new Error("ERRO AO CRIAR CONTA.");
      toast.success("CONTA CRIADA COM SUCESSO!");
      router.push("/login");
    } catch (err) {
      setError(err.message.toUpperCase());
    } finally {
      setIsLoading(false);
    }
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
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-700 tracking-tight">Nova Conta</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Crie seu acesso administrativo abaixo</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-4 animate-pulse">
              <p className="text-red-700 text-[9px] text-center font-bold uppercase tracking-widest leading-tight">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-2.5">
            <Input 
              label="NOME COMPLETO" 
              type="text" 
              placeholder="Ex: Cb. Silva" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />

            <Input 
              label="E-MAIL" 
              type="email" 
              placeholder="Digite seu e-mail..." 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />

            <Input 
              label="SENHA" 
              type={showPassword ? "text" : "password"} 
              placeholder="Mínimo 8 caracteres" 
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

            <div className="pt-3">
              <ActionButton 
                label="CRIAR MINHA CONTA"
                type="submit"
                loading={isLoading}
                fullWidth={true}
              />
            </div>
            
            <div className="text-center text-[11px] text-slate-500 pt-4 border-t border-slate-50 mt-4">
              Já tem cadastro?{" "}
              <Link 
                href="/login" 
                className="text-blue-500 font-bold hover:underline transition-all"
              >
                Voltar ao Login
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      
      <div className="absolute bottom-4 w-full z-10">
        <Footer />
      </div>
    </main>
  );
}