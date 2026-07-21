import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Card({ className, children, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-surface-200 p-5",
        onClick && "cursor-pointer hover:border-accent/50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
