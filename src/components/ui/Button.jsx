import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
    children,
    variant = 'primary',
    className,
    ...props
}) {
    const baseStyles = "px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-soft flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "text-text-secondary hover:bg-gray-100",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
