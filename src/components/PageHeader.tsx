interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-2 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
      <h1 className="text-4xl md:text-5xl font-display font-medium uppercase tracking-tight text-bone">
        {title}
      </h1>
      {subtitle && (
        <p className="text-bone/50 text-lg font-light tracking-wide max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
