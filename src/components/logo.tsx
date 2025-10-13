import { Hand } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Hand className="h-8 w-8 text-primary drop-shadow-glow-primary" />
      <span className="text-2xl font-bold text-foreground">Talking Hands</span>
    </div>
  );
}
