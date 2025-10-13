import Link from 'next/link';
import { Logo } from '@/components/logo';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
      </div>
    </header>
  );
}
