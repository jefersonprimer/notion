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
  const { session } = useAuth();
  const userName = session?.user.displayName || 'Usuário';
  const userInitial = userName[0]?.toUpperCase() || 'U';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
            {/* Sidebar - Hidden on mobile */}
            <aside className="hidden md:block w-64 border-r border-zinc-800 overflow-y-auto p-3 text-sm bg-[#272727]">
              <div className="mb-4 px-2 text-sm text-[#7d7a75] font-medium">Conta</div>
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-zinc-800 px-2 py-1.5">
                <div
                  className="
                    w-5 h-5 rounded-full
                    border border-gray-300 dark:border-[#7d7a75]
                    flex items-center justify-center
                    text-sm text-[#7d7a75] font-medium leading-none
                  "
                >
                  {userInitial}
                </div>
                <span className="text-base text-[#bcbab6]">
                  {session?.user.displayName || 'Usuário'}
                </span>
              </div>

              <nav className="space-y-1">
                <SidebarItem icon={Settings2} label="Preferências" active />
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
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Configurações</h2>
                <button onClick={onClose} className="rounded-lg p-1 hover:bg-zinc-800">
                  <X size={18} />
                </button>
              </div>

              {/* Account Section - Visible on mobile only since it's in the sidebar on desktop */}
              <div className="md:hidden mb-8">
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
                      {session?.user.email}
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

              {/* Placeholder for other sections that would normally be in the sidebar */}
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
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function SidebarItem({ icon: Icon, label, active }: any) {
  return (
    <div
      className={`flex cursor-pointer items-center text-base text-[#bcbab6] hover:text-[#f0efed] font-medium gap-2 rounded-lg px-2 py-1.5 hover:bg-[#ffffff0e] ${
        active ? "bg-zinc-800" : ""
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
