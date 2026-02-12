import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createNoteSlug, formatRelativeDate, formatFullDate } from '../../lib/utils';
import { Note } from '../../types/note';

interface NoteCardProps {
  note: Note;
}

export function NoteCardSkeleton() {
  return (
    <div className="w-38 h-38 rounded-2xl bg-[#ffffff0d] border border-[#2f2f2f] overflow-hidden flex flex-col animate-pulse">
      <div className="h-11 bg-[#2a2a2a]" />
      <div className="flex flex-col justify-between flex-1 px-4 pt-6 pb-3">
        <div className="h-4 bg-[#2f2f2f] rounded w-full" />
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-[#2f2f2f]" />
          <div className="h-3 bg-[#2f2f2f] rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function NoteCard({ note }: NoteCardProps) {
  const { session } = useAuth();
  const noteSlug = createNoteSlug(note.title, note.id);
  const userName = session?.user.displayName || 'Usuário';
  const userInitial = userName[0]?.toUpperCase() || 'U';
  const updatedDate = new Date(note.updated_at);

  return (
    <Link href={`/${noteSlug}`} className="block">
      <div
        className="
          w-38 h-38
          rounded-2xl
          bg-white dark:bg-[#ffffff0d]
          border border-gray-200 dark:border-[#2f2f2f]
          overflow-hidden
          hover:bg-gray-50 dark:hover:bg-[#252525]
          transition-colors
          flex flex-col
        "
      >
        {/* Capa */}
        <div className="relative h-11 bg-gray-100 dark:bg-[#2a2a2a]">
          {/* Ícone flutuante */}
          <div
            className="
              absolute -bottom-3 left-4
              flex items-center justify-center
            "
          >
            <FileText size={20} className="text-gray-600 dark:text-[#7d7a75]" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col justify-between flex-1 px-4 pt-6 pb-3">
          {/* Título */}
          <div className="text-sm font-medium text-gray-900 dark:text-[#f0efed] line-clamp-2">
            {note.title || 'Sem título'}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-1">
            <div
              className="
                w-4 h-4 rounded-full
                border border-gray-300 dark:border-[#7d7a75]
                flex items-center justify-center
                text-xs text-[#7d7a75] font-medium
              "
            >
              {userInitial}
            </div>
            <span className="text-sm text-[#7d7a75]" title={`Última edição por ${userName} em ${formatFullDate(updatedDate)}`}>
              {formatRelativeDate(updatedDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

