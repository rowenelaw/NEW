import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  bagCount: number;
  onOpenBag: () => void;
}

export const Header: React.FC<HeaderProps> = ({ bagCount, onOpenBag }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F7F5]/95 backdrop-blur-md border-b border-black/[0.07]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-display text-[15px] font-semibold tracking-[0.14em] uppercase text-[#141413] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-sm"
        >
          EVEN REALITIES
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#5A5A56]"
        >
          <a
            href="#selection"
            className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#141413]"
          >
            Even G2
          </a>
          <a
            href="#geometry"
            className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#141413]"
          >
            Geometry
          </a>
          <a
            href="#optics"
            className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#141413]"
          >
            Optics
          </a>
          <a
            href="#included"
            className="hover:text-[#141413] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#141413]"
          >
            Included
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#F7F7F5] bg-[#141413] rounded-lg hover:bg-[#2C2C2A] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Bag</span>
            <span className="tabular-nums opacity-85">({bagCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
