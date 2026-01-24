import { X, ChevronDown, Bell, User, Settings, Users, Globe, Link2, Download, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay background click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            className="relative flex h-[80vh] w-[900px] overflow-hidden rounded-2xl bg-zinc-900 text-zinc-100 shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 p-3 text-sm">
              <div className="mb-4 px-2 text-xs text-zinc-400">Conta</div>
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-zinc-800 px-2 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-xs">J</div>
                Jeferson Primer
              </div>

              <nav className="space-y-1">
                <SidebarItem icon={Settings} label="Preferências" active />
                <SidebarItem icon={Bell} label="Notificações" />
                <SidebarItem icon={Link2} label="Conexões" />

                <div className="mt-4 px-2 text-xs text-zinc-400">Espaço de trabalho</div>
                <SidebarItem icon={Settings} label="Geral" />
                <SidebarItem icon={Users} label="Pessoas" />
                <SidebarItem icon={Globe} label="Páginas públicas" />
                <SidebarItem icon={Download} label="Importações" />
                <SidebarItem icon={Sparkles} label="IA do Notion" />
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Preferências</h2>
                <button onClick={onClose} className="rounded-lg p-1 hover:bg-zinc-800">
                  <X size={18} />
                </button>
              </div>

              <Section title="Aparência">
                <Row label="Personalize a aparência do Notion no seu dispositivo.">
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
      className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-800 ${
        active ? "bg-zinc-800" : ""
      }`}
    >
      <Icon size={16} className="text-zinc-400" />
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
        {description && <div className="text-xs text-zinc-400">{description}</div>}
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
