'use client'

import { useEffect, useState, useRef } from 'react'

export const TEXT_COLORS = [
    '#37352f', '#787774', '#976d57', '#d9730d', '#cb912f',
    '#448361', '#337ea9', '#7858cc', '#d15796', '#df5452'
]

export const BACK_COLORS = [
    '#37352f', '#787774', '#976d57', '#d9730d', '#cb912f',
    '#448361', '#337ea9', '#7858cc', '#d15796', '#df5452'
]

interface ColorModalProps {
    onClose: () => void
    onApplyColor: (type: 'text' | 'bg', color: string) => void
    onResetColor: (type: 'text' | 'bg') => void
}

export default function ColorModal({
    onClose,
    onApplyColor,
    onResetColor
}: ColorModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const [flipAbove, setFlipAbove] = useState(false)
    const [adjustedLeft, setAdjustedLeft] = useState<number | null>(null)

    useEffect(() => {
        if (modalRef.current) {
            const rect = modalRef.current.getBoundingClientRect()
            const padding = 8

            // Vertical flip
            if (rect.bottom > window.innerHeight) {
                setFlipAbove(true)
            }

            // Horizontal clamp
            if (rect.right > window.innerWidth - padding) {
                const overflow = rect.right - window.innerWidth + padding
                setAdjustedLeft(-overflow)
            } else if (rect.left < padding) {
                const overflow = padding - rect.left
                setAdjustedLeft(overflow)
            }
        }

        // Close when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    return (
        <div
            ref={modalRef}
            style={adjustedLeft !== null ? { marginLeft: adjustedLeft } : undefined}
            className={`absolute left-[calc(50%+400px)] -translate-x-1/2 z-60 w-64 bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg shadow-2xl p-3 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-100 ${flipAbove ? 'bottom-full mb-3' : 'top-full mt-3'
                }`}
            onMouseDown={(e) => e.preventDefault()}
        >
            <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase mb-2 px-1">Recentemente usado</div>
                <div className="flex gap-2 px-1">
                    <div className="w-6 h-6 rounded border border-[#2f2f2f] bg-[#df5452]" />
                    <div className="w-6 h-6 rounded border border-[#2f2f2f] bg-[#337ea9]" />
                </div>
            </div>

            <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase mb-2 px-1">Cor do texto</div>
                <div className="grid grid-cols-5 gap-1">
                    <button
                        onClick={() => onResetColor('text')}
                        className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
                        title="Padrão"
                    >
                        <span className="text-lg font-medium border px-1.5 rounded text-gray-300 border-gray-500">A</span>
                    </button>
                    {TEXT_COLORS.map((color, i) => (
                        <button
                            key={`text-${i}`}
                            onClick={() => onApplyColor('text', color)}
                            className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
                        >
                            <span className="text-lg font-medium border px-1.5 rounded" style={{ color: color, borderColor: color }}>A</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase mb-2 px-1">Cor de fundo</div>
                <div className="grid grid-cols-5 gap-1">
                    <button
                        onClick={() => onResetColor('bg')}
                        className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
                        title="Padrão"
                    >
                        <div className="w-6 h-6 rounded border border-dashed border-gray-500 flex items-center justify-center">
                            <span className="text-[10px] text-gray-500">⊘</span>
                        </div>
                    </button>
                    {BACK_COLORS.map((color, i) => (
                        <button
                            key={`bg-${i}`}
                            onClick={() => onApplyColor('bg', color)}
                            className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
                        >
                            <div className="w-6 h-6 rounded border border-[#333]" style={{ backgroundColor: color }} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
