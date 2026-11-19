import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { RING_SIZES } from '../data/glassesConfig';

interface RingSizingModalProps {
  isOpen: boolean;
  selectedSize: number;
  onSelectSize: (size: number) => void;
  onClose: () => void;
}

export const RingSizingModal: React.FC<RingSizingModalProps> = ({
  isOpen,
  selectedSize,
  onSelectSize,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ring-guide-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-[#F7F7F5] border border-black/10 p-6 md:p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/[0.08]">
          <div>
            <h2 id="ring-guide-title" className="font-display text-[18px] font-semibold text-[#141413]">
              Even R1 Ring Sizing Guide
            </h2>
            <p className="text-[13px] text-[#5A5A56] mt-1">
              Recommended on your index or middle finger for seamless touch and gesture control.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sizing guide"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5A5A56] hover:text-[#141413] hover:bg-[#EAEAE6] cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-black/[0.08] text-[#6B6B68] text-[12px]">
                <th className="py-2.5 font-medium">US Size</th>
                <th className="py-2.5 font-medium">Inner Diameter</th>
                <th className="py-2.5 font-medium">Inner Circumference</th>
                <th className="py-2.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {RING_SIZES.map((row) => {
                const active = selectedSize === row.us;
                return (
                  <tr key={row.us} className={active ? 'bg-white' : ''}>
                    <td className="py-2.5 font-mono-tech font-medium text-[#141413]">
                      US {row.us}
                    </td>
                    <td className="py-2.5 font-mono-tech text-[#5A5A56]">
                      {row.diameterMm} mm
                    </td>
                    <td className="py-2.5 font-mono-tech text-[#5A5A56]">
                      {row.circumferenceMm} mm
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSize(row.us);
                          onClose();
                        }}
                        className={`px-3 py-1 rounded-md text-[12px] font-medium cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#141413] text-[#F7F7F5]'
                            : 'bg-[#EAEAE6] text-[#141413] hover:bg-[#DFDFDA]'
                        }`}
                      >
                        {active ? 'Selected' : 'Choose'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
