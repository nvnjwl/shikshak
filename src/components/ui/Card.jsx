import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }) {
    return (
        <div
            className={twMerge("bg-surface rounded-3xl shadow-card p-6 border border-gray-100", className)}
            {...props}
        >
            {children}
        </div>
    );
}
