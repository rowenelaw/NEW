import React from 'react';
import { Check } from 'lucide-react';
import { FrameId, FRAMES, IN_THE_BOX, TECHNICAL_SPECS } from '../data/glassesConfig';

interface SpecsAndComparisonProps {
  selectedFrameId: FrameId;
  onSelectFrame: (frameId: FrameId) => void;
}

export const SpecsAndComparison: React.FC<SpecsAndComparisonProps> = ({
  selectedFrameId,
  onSelectFrame,
}) => {
  return (
    <div className="max-w-[1360px] mx-auto px-6 md:px-10">
      {/* Section 1: Frame Geometry Comparison */}
      <section
        id="geometry"
        className="py-16 md:py-24 border-t border-black/[0.08]"
        aria-labelledby="geometry-heading"
      >
        <div className="max-w-xl mb-12">
          <h2
            id="geometry-heading"
            className="font-display text-[24px] md:text-[30px] font-semibold tracking-tight text-[#141413]"
            style={{ textWrap: 'balance' }}
          >
            Frame Geometry &amp; Proportions
          </h2>
          <p className="text-[15px] text-[#5A5A56] mt-2 leading-relaxed">
            Both silhouettes house identical micro-LED waveguide optics inside a balanced 36–37 g chassis. Choose the front architecture that fits your facial width.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FRAMES.map((frame) => {
            const isSelected = selectedFrameId === frame.id;
            return (
              <div
                key={frame.id}
                className={`p-6 md:p-8 rounded-2xl border transition-colors ${
                  isSelected
                    ? 'bg-white border-[#141413]'
                    : 'bg-[#EFEFED] border-black/[0.06]'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-[20px] font-semibold text-[#141413]">
                      {frame.name}
                    </h3>
                    <p className="text-[13px] text-[#5A5A56] mt-0.5">
                      {frame.silhouette} · {frame.fitNote}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectFrame(frame.id);
                      document.getElementById('selection')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#141413] text-[#F7F7F5]'
                        : 'bg-white text-[#141413] border border-black/15 hover:border-[#141413]'
                    }`}
                  >
                    {isSelected ? 'Selected' : `Select ${frame.name}`}
                  </button>
                </div>

                {/* Precision Front Blueprint SVG */}
                <div className="py-6 px-4 bg-[#F7F7F5] rounded-xl border border-black/[0.05] mb-6 flex items-center justify-center">
                  <svg
                    viewBox="0 0 320 110"
                    className="w-full max-w-[300px] h-auto text-[#141413]"
                    fill="none"
                    aria-label={`${frame.name} dimensional diagram`}
                  >
                    {/* Dimension lines */}
                    <line x1="28" y1="16" x2="292" y2="16" stroke="#8C8C87" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="160" y="12" textAnchor="middle" fill="#5A5A56" fontSize="10" fontFamily="JetBrains Mono, monospace">
                      {frame.dimensions.totalWidth} mm total width
                    </text>

                    {frame.id === 'g2-a' ? (
                      <>
                        <circle cx="96" cy="60" r="34" stroke="currentColor" strokeWidth="2.5" />
                        <circle cx="224" cy="60" r="34" stroke="currentColor" strokeWidth="2.5" />
                        <path d="M130 52 C145 43, 175 43, 190 52" stroke="currentColor" strokeWidth="2.5" />
                        <path d="M28 52 L62 52 M258 52 L292 52" stroke="currentColor" strokeWidth="2.5" />
                      </>
                    ) : (
                      <>
                        <rect x="56" y="30" width="76" height="54" rx="11" stroke="currentColor" strokeWidth="2.5" />
                        <rect x="188" y="30" width="76" height="54" rx="11" stroke="currentColor" strokeWidth="2.5" />
                        <path d="M132 48 L188 48" stroke="currentColor" strokeWidth="2.5" />
                        <path d="M28 45 L56 45 M264 45 L292 45" stroke="currentColor" strokeWidth="2.5" />
                      </>
                    )}

                    <text x="95" y="104" textAnchor="middle" fill="#6B6B68" fontSize="10" fontFamily="JetBrains Mono, monospace">
                      {frame.dimensions.lensWidth} mm lens
                    </text>
                    <text x="160" y="104" textAnchor="middle" fill="#6B6B68" fontSize="10" fontFamily="JetBrains Mono, monospace">
                      {frame.dimensions.bridge} mm
                    </text>
                    <text x="225" y="104" textAnchor="middle" fill="#6B6B68" fontSize="10" fontFamily="JetBrains Mono, monospace">
                      {frame.dimensions.lensHeight} mm H
                    </text>
                  </svg>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
                  <div>
                    <dt className="text-[#6B6B68] text-[11px]">Lens Width</dt>
                    <dd className="font-mono-tech font-medium text-[#141413] mt-0.5">
                      {frame.dimensions.lensWidth} mm
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6B6B68] text-[11px]">Bridge Width</dt>
                    <dd className="font-mono-tech font-medium text-[#141413] mt-0.5">
                      {frame.dimensions.bridge} mm
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6B6B68] text-[11px]">Temple Arm</dt>
                    <dd className="font-mono-tech font-medium text-[#141413] mt-0.5">
                      {frame.dimensions.temple} mm
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6B6B68] text-[11px]">Frame Weight</dt>
                    <dd className="font-mono-tech font-medium text-[#141413] mt-0.5">
                      {frame.dimensions.weightGrams} g
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Optical Engineering & Included Kit */}
      <section
        id="optics"
        className="py-16 md:py-24 border-t border-black/[0.08]"
        aria-labelledby="optics-heading"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2
              id="optics-heading"
              className="font-display text-[24px] md:text-[30px] font-semibold tracking-tight text-[#141413]"
              style={{ textWrap: 'balance' }}
            >
              Optical Architecture
            </h2>
            <p className="text-[15px] text-[#5A5A56] mt-2 leading-relaxed max-w-xl">
              Zero cameras, zero external speakers. Only crisp, private contextual information floating effortlessly in your peripheral field of view.
            </p>

            <div className="mt-8 divide-y divide-black/[0.08] border-t border-b border-black/[0.08]">
              {TECHNICAL_SPECS.map((spec) => (
                <div
                  key={spec.title}
                  className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
                >
                  <div className="sm:col-span-4 text-[12px] font-medium text-[#6B6B68]">
                    {spec.category}
                  </div>
                  <div className="sm:col-span-8">
                    <div className="font-display text-[15px] font-semibold text-[#141413]">
                      {spec.title}
                    </div>
                    <p className="text-[13px] text-[#5A5A56] mt-1 leading-relaxed">
                      {spec.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="included" className="lg:col-span-5">
            <div className="p-6 md:p-8 rounded-2xl bg-[#EFEFED] border border-black/[0.06]">
              <h2 className="font-display text-[20px] font-semibold text-[#141413]">
                Included in the Box
              </h2>
              <p className="text-[13px] text-[#5A5A56] mt-1.5 leading-relaxed">
                Every Even G2 order ships complete with our wireless charging case and optical care kit.
              </p>

              <ul className="mt-6 space-y-3.5">
                {IN_THE_BOX.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[13px] text-[#141413]">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-[#141413]/8 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#141413]" aria-hidden="true" />
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
