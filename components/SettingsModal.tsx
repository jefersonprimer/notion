"use client";

import { X, ChevronDown, Bell, Settings, Settings2, Users, Globe, Smile, Link2, Download, Building2, Sparkles, CircleArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from '@/context/AuthContext';
import { useTheme } from "@/context/ThemeContext";
import type { Theme } from "@/context/ThemeContext";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const t = useTranslations('SettingsModal');
  const [activeTab, setActiveTab] = useState('preferencias');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const { session } = useAuth();
  const userName = session?.user?.name?.trim() || t('user.fallbackName');
  const userEmail = session?.user?.email;
  const userInitial =
    (userName.trim().charAt(0) || t('user.fallbackInitial') || 'U').toUpperCase();
  const languageOptions = [
    { value: 'pt-BR', label: t('languageOptions.ptBR') },
    { value: 'en', label: t('languageOptions.en') },
  ];
  const selectedLanguageLabel =
    languageOptions.find((option) => option.value === locale)?.label || t('languageOptions.en');
  const themeOptions: { value: Theme; label: string }[] = [
    { value: "dark", label: t("preferences.appearance.options.dark") },
    { value: "light", label: t("preferences.appearance.options.light") },
    { value: "system", label: t("preferences.appearance.options.system") },
  ];
  const selectedThemeLabel =
    themeOptions.find((option) => option.value === theme)?.label || themeOptions[0].label;

  if (typeof document === 'undefined') return null;

  const renderContent = () => {
    if (activeTab === 'minha-conta') {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base text-gray-900 dark:text-[#f0efed] font-medium">{t('account.title')}</h2>
          </div>

          <div className="mb-2 h-px w-full bg-gray-200 dark:bg-[#fffff315]" />

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="
                  w-16 h-16 rounded-full
                  bg-gray-100 dark:bg-[#ffffff0e]
                  flex items-center justify-center
                  text-2xl text-gray-700 dark:text-[#e6e5e3] font-medium
                "
              >
                {userInitial}
              </div>
              
              <div className="flex flex-col">
                <div className="text-xs font-medium text-gray-500 dark:text-[#bcbab6] mb-1">{t('account.name')}</div>
                <div className="px-2 py-1 text-sm rounded-lg bg-gray-100 border border-gray-200 text-gray-900 dark:bg-[#ffffff0e] dark:border-zinc-800 dark:text-[#f0efed]">
                  {userName}
                </div>
              </div>            
            </div>
            
            <p className="text-sm text-gray-600 dark:text-[#7d7a75]">
              <a href="#" className="text-[#2783de]">{t('account.addPhoto')}</a>
              {t('account.or')}
              <a href="#" className="text-[#2783de]"> {t('account.createAvatarWithFace')}</a>
            </p>
          </div>

          <div>
            <h2 className="text-base text-gray-900 dark:text-[#f0efed] font-medium">{t('security.title')}</h2>
            <div className="my-2 h-px w-full bg-gray-200 dark:bg-[#fffff315]" />


            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-gray-900 dark:text-[#f0efed] text-sm font-medium">{t('security.email')}</p>
                <p className="text-gray-600 dark:text-[#ada9a3] text-xs font-normal">{userEmail}</p>
              </div>
              <button className="px-2 py-1 border text-sm border-gray-200 hover:bg-gray-100 rounded-md dark:border-[#ffffeb1a] dark:hover:bg-[#fffff315]">
                {t('security.manageEmails')}
              </button>
            </div>

            <div className="flex items-center justify-between my-6">
              <div className="flex flex-col gap-2">
                <p className="text-gray-900 dark:text-[#f0efed] text-sm font-medium">{t('security.password')}</p>
                <p className="text-gray-600 dark:text-[#ada9a3] text-xs font-normal">{t('security.setPasswordDescription')}</p>
              </div>
              <button className="px-2 py-1 text-sm border border-gray-200 hover:bg-gray-100 rounded-md dark:border-[#ffffeb1a] dark:hover:bg-[#fffff315]">
                {t('security.addPassword')}
              </button>
            </div>

            <div className="flex items-center justify-between my-6">
              <div className="flex flex-col gap-2">
                <p className="text-gray-900 dark:text-[#f0efed] text-sm font-medium">{t('security.twoStepVerification')}</p>
                <p className="text-gray-600 dark:text-[#ada9a3] text-xs font-normal">{t('security.twoStepVerificationDescription')}</p>
              </div>
              <button className="px-2 text-sm py-1 border border-gray-200 hover:bg-gray-100 rounded-md dark:border-[#ffffeb1a] dark:hover:bg-[#fffff315]">
                {t('security.addVerificationMethod')}
              </button>
            </div>

            <div className="flex items-center justify-between my-6">
              <div className="flex flex-col gap-2">
                <p className="text-gray-900 dark:text-[#f0efed] text-sm font-medium">{t('security.passkey')}</p>
                <p className="text-gray-600 dark:text-[#ada9a3] text-xs font-normal">{t('security.passkeyDescription')}</p>
              </div>
              <button className="px-2 text-sm py-1 border border-gray-200 hover:bg-gray-100 rounded-md dark:border-[#ffffeb1a] dark:hover:bg-[#fffff315]">
                {t('security.addPasskey')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('preferences.title')}</h2>
        </div>

        {/* Account Section - Visible on mobile only since it's in the sidebar on desktop */}
        <div className="md:hidden mb-8" onClick={() => setActiveTab('minha-conta')}>
          <div className="mb-4 text-sm text-gray-500 dark:text-[#7d7a75] font-medium uppercase tracking-wider">{t('account.title')}</div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 dark:bg-zinc-800/50 dark:border-zinc-800">
            <div
              className="
                w-10 h-10 rounded-full
                border border-gray-300 dark:border-[#7d7a75]
                flex items-center justify-center
                text-lg text-gray-600 dark:text-[#7d7a75] font-medium leading-none
              "
            >
              {userInitial}
            </div>
	            <div className="flex flex-col">
	              <span className="text-sm font-medium text-gray-900 dark:text-[#f0efed]">
	                {userName}
	              </span>
	              <span className="text-xs text-gray-600 dark:text-[#7d7a75]">
	                {userEmail}
	              </span>
	            </div>
          </div>
        </div>

        <Section title={t('preferences.appearance.sectionTitle')}>
          <Row label={t('preferences.appearance.label')} description={t('preferences.appearance.description')}>
            <ThemeSelect
              value={selectedThemeLabel}
              open={themeMenuOpen}
              options={themeOptions}
              onToggle={() => setThemeMenuOpen((prev) => !prev)}
              onSelect={(nextTheme) => {
                setTheme(nextTheme);
                setThemeMenuOpen(false);
              }}
            />
          </Row>
        </Section>

        <Section title={t('preferences.languageAndTime.sectionTitle')}>
          <Row label={t('preferences.languageAndTime.languageLabel')} description={t('preferences.languageAndTime.languageDescription')}>
            <LanguageSelect
              value={selectedLanguageLabel}
              open={languageMenuOpen}
              options={languageOptions}
              onToggle={() => setLanguageMenuOpen((prev) => !prev)}
              onSelect={(nextLocale) => {
                if (nextLocale === locale) {
                  setLanguageMenuOpen(false);
                  return;
                }

                document.cookie = `locale=${encodeURIComponent(nextLocale)}; path=/; max-age=31536000; samesite=lax`;
                setLanguageMenuOpen(false);
                router.refresh();
              }}
            />
          </Row>

          <Toggle label={t('preferences.languageAndTime.alwaysShowTextDirectionControls')} />
          <Toggle label={t('preferences.languageAndTime.startWeekOnMonday')} />
          <Toggle label={t('preferences.languageAndTime.setTimeZoneAutomatically')} checked />

          <Row label={t('preferences.languageAndTime.timeZoneLabel')}>
            <Select value={t('preferences.languageAndTime.timeZoneValue')} />
          </Row>
        </Section>

        <div className="md:hidden space-y-8">
          <Section title={t('preferences.notifications.sectionTitle')}>
             <Toggle label={t('preferences.notifications.desktopNotifications')} checked />
             <Toggle label={t('preferences.notifications.emailNotifications')} />
          </Section>

          <Section title={t('security.title')}>
            <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm dark:bg-zinc-800 dark:hover:bg-zinc-700">
              {t('preferences.security.changePassword')}
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm text-red-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-red-400">
              {t('preferences.security.signOutAllSessions')}
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
            className="settings-modal-container relative flex h-full w-full md:h-150 md:w-287.5 overflow-hidden md:rounded-2xl bg-white text-gray-900 shadow-2xl dark:bg-[#202020] md:dark:bg-zinc-900 dark:text-zinc-100"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-lg p-1 hover:bg-gray-100 text-gray-600 dark:hover:bg-zinc-800 dark:text-[#bcbab6]"
            >
              <X size={18} />
            </button>
            {/* Sidebar - Hidden on mobile */}
            <aside className="hidden md:block w-64 border-r border-gray-200 overflow-y-auto p-3 text-sm bg-gray-50 dark:border-zinc-800 dark:bg-[#272727]">
              <div className="mb-2 px-2 text-sm text-gray-500 dark:text-[#7d7a75] font-medium">{t('account.title')}</div>
              <div 
                className={`mb-0.5 flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors dark:hover:bg-[#ffffff0e] ${activeTab === 'minha-conta' ? 'bg-gray-100 dark:bg-[#ffffff0e]' : ''}`}
                onClick={() => setActiveTab('minha-conta')}
              >
                <div
                  className="
                    w-5 h-5 rounded-full
                    border border-gray-300 dark:border-[#7d7a75] bg-gray-100 dark:bg-[#252525]
                    flex items-center justify-center
                    text-xs text-gray-700 dark:text-[#ada9a3] font-medium leading-none
                  "
                >
                  {userInitial}
                </div>
	                <span className="text-sm text-gray-700 dark:text-[#bcbab6]">
	                  {userName}
	                </span>
	              </div>

              <nav className="space-y-0.5">
                <SidebarItem 
                  icon={Settings2} 
                  label={t('sidebar.preferences')} 
                  active={activeTab === 'preferencias'} 
                  onClick={() => setActiveTab('preferencias')}
                />
                <SidebarItem icon={Bell} label={t('sidebar.notifications')} />
                <SidebarItem icon={Link2} label={t('sidebar.connections')} />

                <div className="mt-4 px-2 text-xs text-gray-500 dark:text-[#7d7a75] font-medium">{t('sidebar.workspaceSection')}</div>
                <SidebarItem icon={Settings} label={t('sidebar.general')} />
                <SidebarItem icon={Users} label={t('sidebar.people')} />
                <SidebarItem icon={Download} label={t('sidebar.imports')} />
                
                <div className="mt-4 px-2 text-xs text-gray-500 dark:text-[#7d7a75] font-medium">{t('sidebar.featuresSection')}</div>
                <SidebarItem icon={Sparkles} label={t('sidebar.NolioAI')} />
                <SidebarItem icon={Globe} label={t('sidebar.publicPages')} />
                <SidebarItem icon={Smile} label={t('sidebar.emoji')} />
                
                <div className="mt-4 px-2 text-xs text-gray-500 dark:text-[#7d7a75] font-medium">{t('sidebar.integrationsSection')}</div>
                <SidebarItem icon={Link2} label={t('sidebar.connections')} />
                
                <div className="mt-4 px-2 text-xs text-gray-500 dark:text-[#7d7a75] font-medium">{t('sidebar.adminSection')}</div>
                <SidebarItem icon={Building2} label={t('sidebar.teamspaces')} />

                <div className="mt-4 px-2 text-xs text-gray-500 dark:text-[#7d7a75] font-medium">{t('sidebar.accessAndBillingSection')}</div>
                <SidebarItem icon={CircleArrowUp} label={t('sidebar.upgradePlan')} />
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6 dark:bg-[#202020]">
              {renderContent()}
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: React.ComponentType<{ size?: number }>; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center text-sm text-gray-700 hover:text-gray-900 font-medium gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors dark:text-[#bcbab6] dark:hover:text-[#f0efed] dark:hover:bg-[#ffffff0e] ${
        active ? "bg-gray-100 text-gray-900 dark:bg-[#ffffff0e] dark:text-[#f0efed]" : ""
      }`}
    >
      <Icon size={20} />
      {label}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-semibold text-gray-600 dark:border-zinc-800 dark:text-zinc-300">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm">{label}</div>
        {description && <div className="text-sm text-gray-500 dark:text-zinc-400">{description}</div>}
      </div>
      {children}
    </div>
  );
}

function Select({ value }: { value: string }) {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700">
      {value}
      <ChevronDown size={14} className="text-gray-500 dark:text-zinc-400" />
    </button>
  );
}

function LanguageSelect({
  value,
  open,
  options,
  onToggle,
  onSelect,
}: {
  value: string;
  open: boolean;
  options: { value: string; label: string }[];
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      >
        {value}
        <ChevronDown size={14} className="text-gray-500 dark:text-zinc-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeSelect({
  value,
  open,
  options,
  onToggle,
  onSelect,
}: {
  value: string;
  open: boolean;
  options: { value: Theme; label: string }[];
  onToggle: () => void;
  onSelect: (value: Theme) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      >
        {value}
        <ChevronDown size={14} className="text-gray-500 dark:text-zinc-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <button
        className={`h-5 w-9 rounded-full p-0.5 transition ${
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-zinc-700"
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
