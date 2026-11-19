import React from 'react';
import { PAGE_TABS, PageTab } from './Header';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-black/[0.08] bg-[#F2F2EF] mt-8">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="font-display text-[13px] font-semibold tracking-[0.14em] uppercase text-[#141413]">
            EVEN REALITIES
          </div>
          <p className="text-[12px] text-[#6B6B68] mt-1">
            Designed for quiet everyday clarity. CE, FCC &amp; ISO optical compliant.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[12px] text-[#5A5A56]">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="hover:text-[#141413] transition-colors cursor-pointer"
            >
              {tab.label}
            </button>
          ))}
          <span className="text-[#6B6B68]">© 2026 Even Realities</span>
        </div>
      </div>
    </footer>
  );
};
