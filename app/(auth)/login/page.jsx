"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import Input from "../../../components/Input/Input";
import ActionButton from "../../../components/ActionButton/ActionButton";
import Footer from "../../../components/Footer/Footer";

const loginSchema = z.object({
  email: z.string().email("E-MAIL INVÁLIDO.").min(5, "E-MAIL MUITO CURTO."),
  password: z.string().min(6, "A SENHA DEVE TER PELO MENOS 6 CARACTERES.")
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      setError(validation.error.issues[0].message.toUpperCase());
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-MAIL OU SENHA INVÁLIDOS.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("ERRO DE CONEXÃO COM O SERVIDOR.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
      
      
      <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-blue-600 to-black pointer-events-none" />

      
      <div className="relative w-full max-w-sm z-10 mt-8 mb-12">
        
        {/* LOGO DO 17º BPM */}
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
            <h2 className="text-lg font-bold text-slate-700 tracking-tight">Acessar Sistema</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Etilômetros - 17º BPM</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-2 mb-4 animate-pulse">
              <p className="text-red-700 text-[9px] text-center font-bold uppercase tracking-widest leading-tight">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-2.5">
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
              placeholder="Digite sua senha..." 
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

            
            <div className="flex justify-end pr-1 mb-4">
              <Link 
                href="/esqueceu-senha" 
                className="text-[11px] text-blue-500 font-bold hover:underline transition-all"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <ActionButton 
              label="ENTRAR NO SISTEMA"
              type="submit"
              loading={isLoading}
              fullWidth={true}
            />
            

            <div className="text-center text-[11px] text-slate-500 pt-4 border-t border-slate-50 mt-4">
              Não tem uma conta?{" "}
              <Link 
                href="/register" 
                className="text-blue-500 font-bold hover:underline transition-all"
              >
                Cadastre-se
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