'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, ListTodo, HelpCircle } from 'lucide-react';

export default function HomeAndMyTasksHelp() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] text-gray-900 dark:text-gray-100">
      <nav className="h-12 border-b border-gray-200 dark:border-[#2f2f2f] flex items-center px-4 sticky top-0 bg-white dark:bg-[#191919] z-10">
        <button 
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4 text-blue-500">
            <HelpCircle size={32} />
            <span className="text-sm font-bold uppercase tracking-wider">Ajuda e Suporte</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Página Inicial e Minhas Tarefas</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Aprenda a personalizar sua página inicial e gerenciar suas tarefas diárias com eficiência.
          </p>
        </header>

        <section className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Home size={24} className="text-gray-500" />
              Página Inicial
            </h2>
            <p className="mb-4 leading-relaxed">
              A Página Inicial é o seu centro de comando no Notion. Ela oferece uma visão geral de seus acessos recentes, favoritos e widgets úteis para começar o seu dia.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Acessos Recentes:</strong> Veja rapidamente as últimas páginas em que você trabalhou.</li>
              <li><strong>Favoritos:</strong> Mantenha suas páginas mais importantes sempre à mão.</li>
              <li><strong>Personalização:</strong> Use o menu superior direito (ícone de três pontos) para alterar qual página deve ser sua inicial.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ListTodo size={24} className="text-gray-500" />
              Minhas Tarefas
            </h2>
            <p className="mb-4 leading-relaxed">
              O widget de Minhas Tarefas permite que você visualize e gerencie seus itens pendentes sem sair da página inicial.
            </p>
            <div className="bg-gray-50 dark:bg-[#202020] p-6 rounded-lg border border-gray-200 dark:border-[#2f2f2f]">
              <h3 className="font-medium mb-2 text-blue-500">Dica Pro</h3>
              <p className="text-sm italic">
                Você pode alternar a visibilidade deste e de outros widgets através do menu "Mostrar/ocultar widgets" no canto superior direito da sua página inicial.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-gray-200 dark:border-[#2f2f2f] text-center text-sm text-gray-500">
          <p>© 2026 Notion Clone. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
