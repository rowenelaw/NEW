import React from 'react';
import { ShoppingBag } from 'lucide-react';

export type PageTab = 'selection' | 'ambassador' | 'community' | 'specs';

export const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: 'selection', label: 'Even G2' },
  { id: 'ambassador', label: 'Ambassador' },
  { id: 'community', label: 'Leaderboard' },
  { id: 'specs', label: 'Optics & Fit' },
];

interface HeaderProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  bagCount: number;
  onOpenBag: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  bagCount,
  onOpenBag,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F7F5]/95 backdrop-blur-md border-b border-black/[0.07]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onSelectTab('selection')}
          className="font-display text-[15px] font-semibold tracking-[0.14em] uppercase text-[#141413] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-sm cursor-pointer"
        >
          EVEN REALITIES
        </button>

        <nav
          role="tablist"
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-7 text-[14px] font-medium"
        >
          {PAGE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectTab(tab.id)}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] rounded-t-sm ${
                  isActive
                    ? 'text-[#141413] border-[#141413] font-semibold'
                    : 'text-[#5A5A56] border-transparent hover:text-[#141413] hover:border-black/25'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
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
