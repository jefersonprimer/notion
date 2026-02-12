import React, { useRef, useState, useEffect } from 'react';
import { Note } from '@/types/note';
import NoteCard from './NoteCard';
import { ChevronLeft, ChevronRight, Clock10 } from 'lucide-react';

interface CarouselProps {
  notes: Note[];
  title?: string;
}

export default function Carousel({ notes, title }: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      // Use a small tolerance for float precision issues
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [notes]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.7; // Scroll 70% of view
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      // checkScroll will be triggered by onScroll event
    }
  };

  if (notes.length === 0) {
    return (
      <div className="py-4">
        {title && <h2 className="text-sm gap-2 flex items-center font-medium mb-4 text-gray-800 dark:text-neutral-400">
          <Clock10 size={14}/>
          {title}
        </h2>}
        <div className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-[#2f2f2f] rounded-lg text-gray-500">
          Nenhuma nota encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 w-full relative">
      {title && 
        <h2 className="text-sm gap-2 flex items-center font-medium px-4 mb-4 text-gray-800 dark:text-[#ada9a3]">
          <Clock10 size={14}/>
          {title}
        </h2>
      }
      
      <div className="relative group">
          {showLeftArrow && (
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-[45%] -translate-y-1/2 z-10 bg-white/90 dark:bg-[#2f2f2f]/90 p-1.5 rounded-full shadow-lg hover:scale-110 transition-all backdrop-blur-sm -ml-4 border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 duration-200"
                aria-label="Scroll left"
            >
                <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for cleaner look with arrows
          >
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>

          {showRightArrow && (
            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-[45%] -translate-y-1/2 z-10 bg-white/90 dark:bg-[#2f2f2f]/90 p-1.5 rounded-full shadow-lg hover:scale-110 transition-all backdrop-blur-sm -mr-4 border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 duration-200"
                aria-label="Scroll right"
            >
                <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}
      </div>
    </div>
  );
}
