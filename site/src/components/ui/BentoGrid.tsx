import React from 'react';

// Simple utility for class merging (since we don't have clsx/tailwind-merge setup visible in lib)
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-2xl hover:shadow-cyan-500/10 transition duration-300 shadow-input p-6 bg-cosmic-800/40 border border-cosmic-700/60 justify-between flex flex-col space-y-4 hover:border-cyan-500/30",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-300">
                <div className="mb-2">
                    {icon}
                </div>
                <div className="font-bold text-cyan-100 mb-2 mt-2 text-xl">
                    {title}
                </div>
                <div className="font-normal text-slate-300 text-sm leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
};
