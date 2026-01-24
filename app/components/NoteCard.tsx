import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createNoteSlug, formatRelativeDate, formatFullDate } from '../../lib/utils';
import { Note } from '../../types/note';

interface NoteCardProps {
  note: Note;
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
          w-36 h-36
          rounded-2xl
          bg-white dark:bg-[#202020]
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
            <FileText size={20} className="text-gray-600 dark:text-gray-300" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col justify-between flex-1 px-4 pt-6 pb-3">
          {/* Título */}
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
            {note.title || 'Sem título'}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <div
              className="
                w-4 h-4 rounded-full
                border border-gray-300 dark:border-[#3f3f3f]
                flex items-center justify-center
                text-[10px] font-semibold
              "
            >
              {userInitial}
            </div>
            <span title={`Última edição por ${userName} em ${formatFullDate(updatedDate)}`}>
              {formatRelativeDate(updatedDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

