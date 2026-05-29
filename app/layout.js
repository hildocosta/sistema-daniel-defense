import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sistema de Controle P4 - 17º BPM",
  description: "Gerenciamento de Armamentos e Munições",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {/* O conteúdo das páginas é renderizado aqui */}
        {children}
        
        {/* Componente global de notificações configurado para o tema escuro */}
        <Toaster theme="dark" position="top-right" richColors closeButton />
      </body>
    </html>
  );
}