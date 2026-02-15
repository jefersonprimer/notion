'use client'
import { Search, Settings, FileText, File, ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Note } from '@/types/note'
import { createNoteSlug } from '@/lib/utils'
import { useNote } from '@/context/NoteContext';

type Props = {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const router = useRouter()
  const { updatedTitles } = useNote()
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [persistFilters, setPersistFilters] = useState(false)
  const [hideAiSearch, setHideAiSearch] = useState(false)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (showSettings && !(e.target as Element).closest('.settings-container')) {
        setShowSettings(false)
      }
    }
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSettings])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    const fetchNotes = async () => {
      setLoading(true)
      try {
        const url = query ? `/notes?search=${encodeURIComponent(query)}` : '/notes'
        const { data } = await api.get<Note[]>(url)
        setNotes(data)
      } catch (error) {
        console.error('Failed to fetch notes', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
        fetchNotes()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [open, query])

  const handleSelect = (note: Note) => {
    onClose()
    const displayTitle = updatedTitles[note.id] || note.title || 'Nova página'
    const slug = createNoteSlug(displayTitle, note.id)
    router.push(`/${slug}`)
  }

  if (!open) return null

  const groupedNotes = groupNotesByDate(notes)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl rounded-xl bg-neutral-900 text-neutral-200 shadow-xl flex flex-col max-h-[327px]">
        <div className="flex items-center gap-3  px-4 py-3 shrink-0">
          <span className="text-neutral-400">
            <Search size={18} />  
          </span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise ou faça uma pergunta em Notion de Jeferson Primer..."
            className="w-full bg-transparent text-base outline-none placeholder:text-neutral-500"
          />

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 rounded-md transition-colors ${showFilters ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
          >
            <ListFilter size={16}/> 
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center overflow-hidden shrink-0">
            <div className="notion-scroller horizontal flex items-center pt-[10px] px-3 pb-[10px] overflow-x-auto overflow-y-hidden w-full">
              <div className="flex items-center">
                <div className="rounded-[14px] mr-[6px] inline-flex">
                  <div role="button" tabIndex={0} className="select-none transition-colors duration-20 px-2 h-6 flex items-center justify-center gap-[6px] whitespace-nowrap rounded-[32px] text-[14px] leading-6 cursor-pointer text-neutral-400 bg-neutral-800 hover:bg-neutral-700">
                    <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" className="w-5 h-5 block fill-current shrink-0 text-inherit">
                      <path d="M14.075 3.45a.625.625 0 0 0-.884 0l-3.497 3.5a.625.625 0 0 0 .883.884l2.431-2.431v10.705a.625.625 0 0 0 1.25 0V5.402l2.431 2.43a.625.625 0 1 0 .884-.883zM2.427 12.167a.625.625 0 0 1 .884 0l2.43 2.431V3.893a.625.625 0 0 1 .125 0v10.705l2.431-2.43a.625.625 0 0 1 .884.883L6.81 16.55a.625.625 0 0 1-.884 0l-3.498-3.498a.625.625 0 0 1 0-.884"></path>
                    </svg>
                    Ordenar
                    <svg aria-hidden="true" role="graphics-symbol" viewBox="3.06 0 9.88 16" className="w-auto h-3.5 block fill-current shrink-0 text-inherit">
                      <path d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.63.63 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88"></path>
                    </svg>
                  </div>
                </div>
                <div className="h-4 w-[1px] rounded-[1px] bg-neutral-700 mr-[6px]"></div>
              </div>
              
              <div className="flex items-center gap-[6px]">
                <div role="button" tabIndex={0} className="select-none transition-colors duration-20 px-2 h-6 flex items-center justify-center gap-[6px] whitespace-nowrap rounded-[32px] text-[14px] leading-6 cursor-pointer text-neutral-400 hover:bg-neutral-800">
                  <svg aria-hidden="true" role="graphics-symbol" viewBox="1.71 0 16.57 20" className="w-auto h-5 block fill-current shrink-0 text-inherit">
                    <path fillRule="evenodd" d="m8.793 12.35 1.124 3.042a.625.625 0 1 0 1.173-.434L7.352 4.846a.988.988 0 0 0-1.854 0L1.761 14.958a.625.625 0 1 0 1.172.434l1.124-3.042zm-.462-1.25L6.425 5.943 4.52 11.1zm9.322-2.381c.345 0 .625.28.625.625v5.83a.625.625 0 1 1-1.25 0v-.204a3.26 3.26 0 0 1-2.21.83c-.903 0-1.742-.342-2.353-.98s-.961-1.537-.961-2.592.35-1.943.968-2.567c.616-.623 1.454-.942 2.346-.942.824 0 1.606.272 2.21.802v-.177c0-.345.28-.625.625-.625m-4.9 3.51c0-.774.252-1.33.608-1.69.358-.362.864-.57 1.457-.57s1.107.209 1.472.573c.361.361.616.917.616 1.686 0 1.503-.966 2.322-2.088 2.322-.582 0-1.088-.217-1.45-.595-.362-.377-.614-.952-.614-1.727" clipRule="evenodd"></path>
                  </svg>
                  <span className="max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis">Somente título</span>
                </div>

                <div role="button" tabIndex={0} className="select-none transition-colors duration-20 px-2 h-6 flex items-center justify-center gap-[6px] whitespace-nowrap rounded-[32px] text-[14px] leading-6 cursor-pointer text-neutral-400 hover:bg-neutral-800">
                  <svg aria-hidden="true" role="graphics-symbol" viewBox="3.68 0 12.64 20" className="w-auto h-5 block fill-current shrink-0 text-inherit">
                    <path d="M10 2.375c-1.137 0-2.054.47-2.674 1.242-.608.757-.9 1.765-.9 2.824s.292 2.066.9 2.824c.62.772 1.537 1.241 2.674 1.241s2.055-.469 2.675-1.241c.608-.758.9-1.766.9-2.824 0-1.059-.292-2.067-.9-2.824-.62-.773-1.538-1.242-2.675-1.242M7.676 6.441c0-.842.233-1.554.624-2.042.38-.473.937-.774 1.7-.774s1.32.301 1.7.774c.391.488.624 1.2.624 2.042s-.233 1.554-.624 2.041c-.38.473-.937.774-1.7.774s-1.32-.3-1.7-.774c-.391-.487-.624-1.2-.624-2.041M10 11.63c-2.7 0-5.101 1.315-6.12 3.305-.361.706-.199 1.421.23 1.923.412.48 1.06.767 1.74.767h8.3c.68 0 1.328-.287 1.74-.767.429-.502.591-1.217.23-1.923-1.02-1.99-3.42-3.305-6.12-3.305m-5.007 3.875c.761-1.488 2.672-2.626 5.007-2.626s4.246 1.138 5.007 2.626c.105.204.07.378-.067.54-.156.182-.448.33-.79.33h-8.3c-.342 0-.634-.148-.79-.33-.138-.162-.172-.336-.067-.54"></path>
                  </svg>
                  <span className="max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis">Criado por</span>
                  <svg aria-hidden="true" role="graphics-symbol" viewBox="3.06 0 9.88 16" className="w-auto h-3.5 block fill-current shrink-0 text-inherit">
                    <path d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.63.63 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88"></path>
                  </svg>
                </div>

                <div role="button" tabIndex={0} className="select-none transition-colors duration-20 px-2 h-6 flex items-center justify-center gap-[6px] whitespace-nowrap rounded-[32px] text-[14px] leading-6 cursor-pointer text-neutral-400 hover:bg-neutral-800">
                  <svg aria-hidden="true" role="graphics-symbol" viewBox="4.12 0 11.75 20" className="w-auto h-5 block fill-current shrink-0 text-inherit">
                    <path d="M6.25 2.375A2.125 2.125 0 0 0 4.125 4.5v11c0 1.174.951 2.125 2.125 2.125h7.5a2.125 2.125 0 0 0 2.125-2.125V8.121c0-.563-.224-1.104-.622-1.502L11.63 2.997a2.13 2.13 0 0 0-1.502-.622zM5.375 4.5c0-.483.392-.875.875-.875h3.7V6.25A2.05 2.05 0 0 0 12 8.3h2.625v7.2a.875.875 0 0 1-.875.875h-7.5a.875.875 0 0 1-.875-.875zm8.691 2.7H12a.95.95 0 0 1-.95-.95V4.184z"></path>
                  </svg>
                  <span className="max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis">Na página</span>
                  <svg aria-hidden="true" role="graphics-symbol" viewBox="3.06 0 9.88 16" className="w-auto h-3.5 block fill-current shrink-0 text-inherit">
                    <path d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.63.63 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88"></path>
                  </svg>
                </div>

                <div role="button" tabIndex={0} className="select-none transition-colors duration-20 px-2 h-6 flex items-center justify-center gap-[6px] whitespace-nowrap rounded-[32px] text-[14px] leading-6 cursor-pointer text-neutral-400 hover:bg-neutral-800">
                  <svg aria-hidden="true" role="graphics-symbol" viewBox="3.12 0 13.75 20" className="w-auto h-5 block fill-current shrink-0 text-inherit">
                    <path d="M9.537 8.843a.694.694 0 1 1-1.39 0 .694.694 0 0 1 1.39 0m-.695 3.009a.694.694 0 1 0 0-1.389.694.694 0 0 0 0 1.389m.695 1.62a.695.695 0 1 1-1.39 0 .695.695 0 0 1 1.39 0m1.62-3.935a.694.694 0 1 0 0-1.389.694.694 0 0 0 0 1.389m.695 1.621a.694.694 0 1 1-1.39 0 .694.694 0 0 1 1.39 0m-.695 3.009a.695.695 0 1 0 0-1.39.695.695 0 0 0 0 1.39m3.01-5.324a.694.694 0 1 1-1.39 0 .694.694 0 0 1 1.39 0m-7.639 3.009a.694.694 0 1 0 0-1.389.694.694 0 0 0 0 1.389m.694 1.62a.695.695 0 1 1-1.389 0 .695.695 0 0 1 1.39 0m6.249-1.62a.694.694 0 1 0 0-1.389.694.694 0 0 0 0 1.389"></path>
                    <path d="M5.25 3.125A2.125 2.125 0 0 0 3.125 5.25v9.5c0 1.174.951 2.125 2.125 2.125h9.5a2.125 2.125 0 0 0 2.125-2.125v-9.5a2.125 2.125 0 0 0-2.125-2.125zm-.875 3.69h11.25v7.935a.875.875 0 0 1-.875.875h-9.5a.875.875 0 0 1-.875-.875z"></path>
                  </svg>
                  <span className="max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis">Data</span>
                  <svg aria-hidden="true" role="graphics-symbol" viewBox="3.06 0 9.88 16" className="w-auto h-3.5 block fill-current shrink-0 text-inherit">
                    <path d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.63.63 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="overflow-y-auto px-2 py-2 min-h-[100px]">
             {loading && notes.length === 0 ? (
                <div className="p-4 text-center text-neutral-500 text-sm">Carregando...</div>
             ) : notes.length === 0 ? (
                <div className="p-4 text-center text-neutral-500 text-sm">Nenhuma nota encontrada.</div>
             ) : (
                 Object.entries(groupedNotes).map(([dateLabel, groupNotes]) => (
                    <Section key={dateLabel} title={dateLabel}>
                        {groupNotes.map(note => (
                            <Item 
                                key={note.id} 
                                title={(updatedTitles[note.id] !== undefined ? updatedTitles[note.id] : note.title) || 'Nova página'} 
                                note={note}
                                onClick={() => handleSelect(note)}
                            />
                        ))}
                    </Section>
                 ))
             )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-2 text-xs text-neutral-500 shrink-0">
          <span>Ctrl+↵ Abrir em nova guia</span>
          <div className="relative settings-container">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1 rounded-md transition-colors ${showSettings ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
            >
              <Settings size={16}/>
            </button>

            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 w-72 rounded-lg bg-neutral-800 border border-neutral-700 shadow-2xl p-2 z-[60] text-neutral-200">
                <div 
                  className="flex items-center justify-between p-2 hover:bg-neutral-700/50 rounded-md cursor-pointer transition-colors"
                  onClick={() => setPersistFilters(!persistFilters)}
                >
                  <span className="text-[13px]">Persist filters across sessions</span>
                  <div className={`w-8 h-4.5 rounded-full relative transition-colors duration-200 ${persistFilters ? 'bg-blue-500' : 'bg-neutral-600'}`}>
                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all duration-200 ${persistFilters ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
                <div 
                  className="flex items-center justify-between p-2 hover:bg-neutral-700/50 rounded-md cursor-pointer transition-colors"
                  onClick={() => setHideAiSearch(!hideAiSearch)}
                >
                  <span className="text-[13px]">Hide &quot;Search all sources with AI&quot;</span>
                  <div className={`w-8 h-4.5 rounded-full relative transition-colors duration-200 ${hideAiSearch ? 'bg-blue-500' : 'bg-neutral-600'}`}>
                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all duration-200 ${hideAiSearch ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="px-2 py-1 text-xs uppercase text-neutral-500">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Item({ title, note, onClick }: { title: string; note: Note; onClick: () => void }) {
  const { updatedHasContent } = useNote()
  const hasContent = updatedHasContent[note.id] !== undefined 
    ? updatedHasContent[note.id] 
    : (note.title && note.title !== 'Nova página' && note.title.trim() !== '' && note.description && note.description.trim() !== '')

  return (
    <div 
        onClick={onClick}
        className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-neutral-800 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className="text-neutral-400">
          {hasContent ? (
            <FileText size={16} />
          ) : (
            <File size={16} />
          )}
        </span>
        <span className="text-sm">{title}</span>
      </div>
    </div>
  )
}

function groupNotesByDate(notes: Note[]) {
    const groups: Record<string, Note[]> = {}
    
    const sortedNotes = [...notes].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const dayBeforeYesterday = new Date(today)
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2)

    sortedNotes.forEach(note => {
        const noteDate = new Date(note.updated_at)
        const noteDay = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate())
        
        let label = ''
        if (noteDay.getTime() === today.getTime()) {
            label = 'Hoje'
        } else if (noteDay.getTime() === yesterday.getTime()) {
            label = 'Ontem'
        } else if (noteDay.getTime() === dayBeforeYesterday.getTime()) {
            label = 'Anteontem'
        } else {
             label = noteDay.toLocaleDateString('pt-BR')
        }

        if (!groups[label]) {
            groups[label] = []
        }
        groups[label].push(note)
    })
    
    return groups
}
