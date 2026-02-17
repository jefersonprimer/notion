import { X, ChevronDown, Bell, Settings, Settings2, Users, Globe, Smile, Link2, Download, Building2, Sparkles, CircleArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAuth } from '@/context/AuthContext';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('preferencias');
  const { session } = useAuth();
  const userName = session?.user.displayName || 'Usuário';
  const userEmail = session?.user.email;
  const userInitial = userName[0]?.toUpperCase() || 'U';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderContent = () => {
    if (activeTab === 'minha-conta') {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg text-[#f0efed] font-medium">Conta</h2>
          </div>

          <div className="mb-2 h-px w-full bg-[#fffff315]" />

          <div className="mb-8 p-4">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="
                  w-16 h-16 rounded-full
                  bg-[#ffffff0e]
                  flex items-center justify-center
                  text-2xl text-[#e6e5e3] font-medium
                "
              >
                {userInitial}
              </div>
              
              <div className="flex flex-col">
                <div className="text-sm font-medium text-[#bcbab6] mb-1">Nome</div>
                <div className="px-2 py-1 rounded-lg bg-[#ffffff0e] border border-zinc-800 text-[#f0efed]">
                  {userName}
                </div>
              </div>            
            </div>
            
            <p className="text-sm text-[#7d7a75]">
              <a href="#" className="text-[#2783de]">Adicione uma foto </a> 
              ou
              <a href="#" className="text-[#2783de]">  crie um autorretrati personalizado com o Cognition Face.</a> 
            </p>
          </div>

          <div>
            <h2 className="text-lg text-[#f0efed] font-medium">Segurança</h2>
            <div className="my-2 h-px w-full bg-[#fffff315]" />


            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-[#f0efed] text-base font-medium">E-mail</p>
                <p className="text-[#ada9a3] text-sm font-normal">{userEmail}</p>
              </div>
              <button className="px-2 py-1 border border-[#ffffeb1a] hover:bg-[#fffff315] rounded-md">
                Gerenciar e-mails
              </button>
            </div>

            <div className="flex items-center justify-between my-6">
              <div className="flex flex-col gap-2">
                <p className="text-[#f0efed] text-base font-medium">senha</p>
                <p className="text-[#ada9a3] text-sm font-normal">Defina uma senha para sua conta</p>
              </div>
              <button className="px-2 py-1 border border-[#ffffeb1a] hover:bg-[#fffff315] rounded-md">
                Adicionar senha
              </button>
            </div>

            <div className="flex items-center justify-between my-6">
              <div className="flex flex-col gap-2">
                <p className="text-[#f0efed] text-base font-medium">Verificação de duas etapas</p>
                <p className="text-[#ada9a3] text-sm font-normal">Adicione outra camada de segurança à sua conta</p>
              </div>
              <button className="px-2 py-1 border border-[#ffffeb1a] hover:bg-[#fffff315] rounded-md">
                Adicionar um método de verificação
              </button>
            </div>

            <div className="flex items-center justify-between my-6">
              <div className="flex flex-col gap-2">
                <p className="text-[#f0efed] text-base font-medium">Chave de acesso</p>
                <p className="text-[#ada9a3] text-sm font-normal">Entre com segurança usando a autenticação biometrica no dispositivo</p>
              </div>
              <button className="px-2 py-1 border border-[#ffffeb1a] hover:bg-[#fffff315] rounded-md">
                Adicionar passkey
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Configurações</h2>
        </div>

        {/* Account Section - Visible on mobile only since it's in the sidebar on desktop */}
        <div className="md:hidden mb-8" onClick={() => setActiveTab('minha-conta')}>
          <div className="mb-4 text-sm text-[#7d7a75] font-medium uppercase tracking-wider">Conta</div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-800">
            <div
              className="
                w-10 h-10 rounded-full
                border border-gray-300 dark:border-[#7d7a75]
                flex items-center justify-center
                text-lg text-[#7d7a75] font-medium leading-none
              "
            >
              {userInitial}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium text-[#f0efed]">
                {session?.user.displayName || 'Usuário'}
              </span>
              <span className="text-xs text-[#7d7a75]">
                {userEmail}
              </span>
            </div>
          </div>
        </div>

        <Section title="Aparência">
          <Row label="Aparência" description="Personalize a aparência do Notion no seu dispositivo.">
            <Select value="Usar configuração do sistema" />
          </Row>
        </Section>

        <Section title="Idioma e horário">
          <Row label="Idioma" description="Altere o idioma usado na interface.">
            <Select value="Português (Brasil)" />
          </Row>

          <Toggle label="Sempre mostra os controles de direção do texto" />
          <Toggle label="Iniciar semana na segunda-feira" />
          <Toggle label="Defina o fuso horário automaticamente usando sua localização" checked />

          <Row label="Fuso horário">
            <Select value="(GMT-3:00) São Paulo" />
          </Row>
        </Section>

        <div className="md:hidden space-y-8">
          <Section title="Notificações">
             <Toggle label="Notificações no desktop" checked />
             <Toggle label="Notificações por e-mail" />
          </Section>

          <Section title="Segurança">
            <button className="w-full text-left px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm">
              Alterar senha
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm text-red-400">
              Sair de todas as sessões
            </button>
          </Section>
        </div>
      </div>
    );
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay background click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            className="relative flex h-full w-full md:h-150 md:w-287.5 overflow-hidden md:rounded-2xl bg-[#202020] md:bg-zinc-900 text-zinc-100 shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-lg p-1 hover:bg-zinc-800 text-[#bcbab6]"
            >
              <X size={18} />
            </button>
            {/* Sidebar - Hidden on mobile */}
            <aside className="hidden md:block w-64 border-r border-zinc-800 overflow-y-auto p-3 text-sm bg-[#272727]">
              <div className="mb-4 px-2 text-sm text-[#7d7a75] font-medium">Conta</div>
              <div 
                className={`mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-[#ffffff0e] transition-colors ${activeTab === 'minha-conta' ? 'bg-[#ffffff0e]' : ''}`}
                onClick={() => setActiveTab('minha-conta')}
              >
                <div
                  className="
                    w-5 h-5 rounded-full
                    border border-gray-300 dark:border-[#7d7a75] bg-[#252525]
                    flex items-center justify-center
                    text-xs text-[#ada9a3] font-medium leading-none
                  "
                >
                  {userInitial}
                </div>
                <span className="text-base text-[#bcbab6]">
                  {session?.user.displayName || 'Usuário'}
                </span>
              </div>

              <nav className="space-y-1">
                <SidebarItem 
                  icon={Settings2} 
                  label="Preferências" 
                  active={activeTab === 'preferencias'} 
                  onClick={() => setActiveTab('preferencias')}
                />
                <SidebarItem icon={Bell} label="Notificações" />
                <SidebarItem icon={Link2} label="Conexões" />

                <div className="mt-4 px-2 text-sm text-[#7d7a75] font-medium">Espaço de trabalho</div>
                <SidebarItem icon={Settings} label="Geral" />
                <SidebarItem icon={Users} label="Pessoas" />
                <SidebarItem icon={Download} label="Importações" />
                
                <div className="mt-4 px-2 text-sm text-[#7d7a75] font-medium">Features</div>
                <SidebarItem icon={Sparkles} label="IA do Notion" />
                <SidebarItem icon={Globe} label="Páginas públicas" />
                <SidebarItem icon={Smile} label="Emoji" />
                
                <div className="mt-4 px-2 text-sm text-[#7d7a75] font-medium">Integrations</div>
                <SidebarItem icon={Link2} label="Conexões" />
                
                <div className="mt-4 px-2 text-sm text-[#7d7a75] font-medium">Admin</div>
                <SidebarItem icon={Building2} label="Espaços de equipe" />

                <div className="mt-4 px-2 text-sm text-[#7d7a75] font-medium">Acess e billing</div>
                <SidebarItem icon={CircleArrowUp} label="Fazer upgrade do plano" />
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-[#202020] p-4 md:p-6">
              {renderContent()}
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center text-base text-[#bcbab6] hover:text-[#f0efed] font-medium gap-2 rounded-lg px-2 py-1.5 hover:bg-[#ffffff0e] transition-colors ${
        active ? "bg-[#ffffff0e] text-[#f0efed]" : ""
      }`}
    >
      <Icon size={20} />
      {label}
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <section className="mb-8">
      <h3 className="mb-4 border-b border-zinc-800 pb-2 text-sm font-semibold text-zinc-300">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, description, children }: any) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm">{label}</div>
        {description && <div className="text-sm text-zinc-400">{description}</div>}
      </div>
      {children}
    </div>
  );
}

function Select({ value }: { value: string }) {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700">
      {value}
      <ChevronDown size={14} className="text-zinc-400" />
    </button>
  );
}

function Toggle({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <button
        className={`h-5 w-9 rounded-full p-0.5 transition ${
          checked ? "bg-blue-600" : "bg-zinc-700"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
