type Props = {
    size: number;
}

export default function SquareRootSmallIcon({size}: Props) {
    return (
        <svg
            aria-hidden="true" 
            role="graphics-symbol" 
            viewBox="0 0 16 16"
            fill="currentColor" 
            width={size} 
            height={size}
        >
            <path d="M15.425 3.4a.625.625 0 0 1-.5.613l-.125.012H7.338l-3.763 8.82a.626.626 0 0 1-1.119.063l-1.8-3.175a.625.625 0 0 1 1.088-.616l1.177 2.076 3.43-8.038.042-.083a.63.63 0 0 1 .532-.297H14.8l.126.013c.284.058.499.31.499.612">
            </path>
            <path d="M13.97 12.218a.626.626 0 0 1-.99.764l-2.055-2.66-2.056 2.66a.626.626 0 0 1-.99-.764l2.257-2.92L7.88 6.383l-.068-.108a.625.625 0 0 1 .97-.748l.086.092 2.056 2.66 2.055-2.66.087-.092a.625.625 0 0 1 .97.748l-.068.108L11.714 9.3z">
            </path>
       </svg>
    );
} 
