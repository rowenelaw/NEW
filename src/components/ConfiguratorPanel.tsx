import React from 'react';
import { Check, Gamepad2, Info, PackageCheck, RotateCcw, Truck, Zap } from 'lucide-react';
import {
  calculatePrice,
  CLIP_ON_PRICE,
  CLIP_TINTS,
  COLORS,
  ConfigurationState,
  CYL_VALUES,
  FRAMES,
  GAME_APP_VALUE,
  HIGH_INDEX_PRICE,
  LENS_OPTIONS,
  PD_VALUES,
  PrescriptionValues,
  RING_FINISHES,
  RING_PRICE,
  RING_SIZES,
  SPH_VALUES,
} from '../data/glassesConfig';
import { StageMode } from './StudioStage';

interface ConfiguratorPanelProps {
  config: ConfigurationState;
  onChange: (updater: (prev: ConfigurationState) => ConfigurationState) => void;
  onReset: () => void;
  onAddToBag: () => void;
  onOneClickBuy: () => void;
  onOpenRingGuide: () => void;
  onSwitchStageMode: (mode: StageMode) => void;
  justAdded: boolean;
}

export const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({
  config,
  onChange,
  onReset,
  onAddToBag,
  onOneClickBuy,
  onOpenRingGuide,
  onSwitchStageMode,
  justAdded,
}) => {
  const pricing = calculatePrice(config);
  const selectedFrame = FRAMES.find((f) => f.id === config.frameId) ?? FRAMES[0];
  const selectedColor = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];

  const updateRx = (field: keyof PrescriptionValues, value: string | boolean) => {
    onChange((prev) => ({
      ...prev,
      prescription: {
        ...prev.prescription,
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col">
      {/* Header & Loss-Avoidance 20% Discount Pricing */}
      <div className="pb-6 border-b border-black/[0.08]">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1
            className="font-display text-[28px] md:text-[32px] font-semibold tracking-tight text-[#141413] leading-[1.15]"
            style={{ textWrap: 'balance' }}
          >
            Select Your Even G2
          </h1>

          <div className="flex items-baseline gap-2.5 shrink-0">
            <span className="font-mono-tech text-[17px] text-[#6B6B68] line-through">
              ${pricing.originalTotal}
            </span>
            <span className="font-display text-[28px] font-bold text-[#DC2626] tabular-nums">
              ${pricing.total}
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[13px]">
          <span className="font-semibold text-[#DC2626]">
            20% Discount Applied · Save ${pricing.savingsAmount} today
          </span>
          <span className="text-[#5A5A56]">
            Free delivery · Free charging case included
          </span>
        </div>

        <ul className="mt-3.5 space-y-2 text-[13.5px] text-[#5A5A56] leading-snug list-disc pl-4 marker:text-[#141413]">
          <li>
            <strong className="font-semibold text-[#141413]">Capture Life Hands-Free in 4K POV</strong> — Instant temple-tap video recording turns every unscripted moment into crisp, stabilized footage.
          </li>
          <li>
            <strong className="font-semibold text-[#141413]">Lock On with 10× Hybrid Zoom Focus</strong> — Bring distant stages, street signs, and fine details into razor-sharp focus from afar.
          </li>
          <li>
            <strong className="font-semibold text-[#141413]">Step Inside Spatial VR Effects</strong> — Real-time stereoscopic depth overlays and waveguide HUD visuals blend effortlessly into your field of view.
          </li>
          <li>
            <strong className="font-semibold text-[#141413]">Featherlight 36 g All-Day Comfort</strong> — Crafted in magnesium-titanium so smart optics wear like classic everyday luxury eyewear.
          </li>
          <li>
            <strong className="font-semibold text-[#141413]">Complimentary Launch Extras Included</strong> — Ships with a free wireless charging case ($79 value) and free express delivery.
          </li>
        </ul>
      </div>

      {/* 01. Frame Style */}
      <section className="py-6 border-b border-black/[0.08]" aria-labelledby="step-frame">
        <div className="flex items-baseline justify-between gap-4 mb-3.5">
          <h2 id="step-frame" className="font-display text-[15px] font-semibold text-[#141413]">
            01. Frame Shape
          </h2>
          <span className="text-[12px] text-[#6B6B68]">
            {selectedFrame.name} · {selectedFrame.silhouette}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FRAMES.map((frame) => {
            const active = config.frameId === frame.id;
            const discountedFramePrice = Math.round(frame.basePrice * 0.8);
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => {
                  onChange((prev) => ({ ...prev, frameId: frame.id }));
                  onSwitchStageMode('studio');
                }}
                aria-pressed={active}
                className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
                  active
                    ? 'bg-white border-[#141413] shadow-xs'
                    : 'bg-[#EFEFED] border-black/[0.06] hover:border-black/25'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <svg
                    viewBox="0 0 88 28"
                    className="w-16 h-5 text-[#141413]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    aria-hidden="true"
                  >
                    {frame.id === 'g2-a' ? (
                      <>
                        <circle cx="24" cy="14" r="10" />
                        <circle cx="64" cy="14" r="10" />
                        <path d="M34 12 C40 9, 48 9, 54 12" />
                        <path d="M8 12 L14 12 M74 12 L80 12" />
                      </>
                    ) : (
                      <>
                        <rect x="13" y="5" width="23" height="17" rx="4" />
                        <rect x="52" y="5" width="23" height="17" rx="4" />
                        <path d="M36 11 L52 11" />
                        <path d="M7 10 L13 10 M75 10 L81 10" />
                      </>
                    )}
                  </svg>
                  <div className="flex items-baseline gap-1.5 font-mono-tech text-[12px]">
                    <span className="text-[#6B6B68] line-through">${frame.basePrice}</span>
                    <span className="font-semibold text-[#DC2626]">${discountedFramePrice}</span>
                  </div>
                </div>
                <div className="font-display text-[15px] font-semibold text-[#141413]">
                  {frame.name}
                </div>
                <div className="text-[12px] text-[#6B6B68] mt-0.5">
                  {frame.silhouette} · {frame.dimensions.totalWidth} mm wide
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 02. Frame Color */}
      <section className="py-6 border-b border-black/[0.08]" aria-labelledby="step-color">
        <div className="flex items-baseline justify-between gap-4 mb-3.5">
          <h2 id="step-color" className="font-display text-[15px] font-semibold text-[#141413]">
            02. Frame Finish
          </h2>
          <span className="text-[12px] text-[#6B6B68]">
            {selectedColor.name} · {selectedColor.finish}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {COLORS.map((color) => {
            const active = config.colorId === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => {
                  onChange((prev) => ({ ...prev, colorId: color.id }));
                  onSwitchStageMode('studio');
                }}
                aria-pressed={active}
                className={`flex flex-col items-start p-3.5 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
                  active
                    ? 'bg-white border-[#141413] shadow-xs'
                    : 'bg-[#EFEFED] border-black/[0.06] hover:border-black/25'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2.5">
                  <span
                    className="w-6 h-6 rounded-full border border-black/15 shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${color.accentHex} 0%, ${color.swatchHex} 100%)`,
                    }}
                    aria-hidden="true"
                  />
                  {active && <Check className="w-3.5 h-3.5 text-[#141413]" aria-hidden="true" />}
                </div>
                <span className="font-display text-[14px] font-semibold text-[#141413]">
                  {color.name}
                </span>
                <span className="text-[11px] text-[#6B6B68] leading-tight mt-0.5 text-left">
                  {color.finish}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 03. Lens & Prescription */}
      <section className="py-6 border-b border-black/[0.08]" aria-labelledby="step-lens">
        <div className="flex items-baseline justify-between gap-4 mb-3.5">
          <h2 id="step-lens" className="font-display text-[15px] font-semibold text-[#141413]">
            03. Lens &amp; Prescription
          </h2>
          <span className="text-[12px] text-[#6B6B68]">MR-Series Waveguide</span>
        </div>

        <div className="space-y-3">
          {LENS_OPTIONS.map((lens) => {
            const active = config.lensType === lens.id;
            return (
              <button
                key={lens.id}
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, lensType: lens.id }))}
                aria-pressed={active}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
                  active
                    ? 'bg-white border-[#141413] shadow-xs'
                    : 'bg-[#EFEFED] border-black/[0.06] hover:border-black/25'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-[14px] font-semibold text-[#141413]">
                    {lens.name}
                  </span>
                  <span className="font-mono-tech text-[13px] font-medium text-[#141413] shrink-0">
                    {lens.priceDelta === 0 ? 'Included' : `+$${lens.priceDelta}`}
                  </span>
                </div>
                <p className="text-[12px] text-[#5A5A56] mt-1 leading-relaxed">
                  {lens.description}
                </p>
              </button>
            );
          })}
        </div>

        {config.lensType === 'single-vision' && (
          <div className="mt-4 p-4 rounded-xl bg-white border border-black/[0.09] space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[13px] font-semibold text-[#141413]">
                Optical Prescription Parameters
              </span>
              <span className="font-mono-tech text-[11px] text-[#5A5A56]">
                Range -12.00 to +12.00
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 items-end">
                <div className="text-[12px] font-medium text-[#141413] pb-2">
                  Right (OD)
                </div>
                <label className="block">
                  <span className="block text-[11px] text-[#6B6B68] mb-1">SPH</span>
                  <select
                    value={config.prescription.odSph}
                    onChange={(e) => updateRx('odSph', e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-black/15 bg-[#F7F7F5] font-mono-tech text-[12px] text-[#141413] focus:outline-none focus:border-[#141413]"
                  >
                    {SPH_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-[11px] text-[#6B6B68] mb-1">CYL</span>
                  <select
                    value={config.prescription.odCyl}
                    onChange={(e) => updateRx('odCyl', e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-black/15 bg-[#F7F7F5] font-mono-tech text-[12px] text-[#141413] focus:outline-none focus:border-[#141413]"
                  >
                    {CYL_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-[11px] text-[#6B6B68] mb-1">Axis</span>
                  <input
                    type="number"
                    min={0}
                    max={180}
                    value={config.prescription.odAxis}
                    onChange={(e) => updateRx('odAxis', e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-black/15 bg-[#F7F7F5] font-mono-tech text-[12px] text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-4 gap-2 items-end">
                <div className="text-[12px] font-medium text-[#141413] pb-2">
                  Left (OS)
                </div>
                <label className="block">
                  <span className="block text-[11px] text-[#6B6B68] mb-1">SPH</span>
                  <select
                    value={config.prescription.osSph}
                    onChange={(e) => updateRx('osSph', e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-black/15 bg-[#F7F7F5] font-mono-tech text-[12px] text-[#141413] focus:outline-none focus:border-[#141413]"
                  >
                    {SPH_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-[11px] text-[#6B6B68] mb-1">CYL</span>
                  <select
                    value={config.prescription.osCyl}
                    onChange={(e) => updateRx('osCyl', e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-black/15 bg-[#F7F7F5] font-mono-tech text-[12px] text-[#141413] focus:outline-none focus:border-[#141413]"
                  >
                    {CYL_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-[11px] text-[#6B6B68] mb-1">Axis</span>
                  <input
                    type="number"
                    min={0}
                    max={180}
                    value={config.prescription.osAxis}
                    onChange={(e) => updateRx('osAxis', e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-black/15 bg-[#F7F7F5] font-mono-tech text-[12px] text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2.5">
                <span className="text-[12px] font-medium text-[#141413] whitespace-nowrap">
                  Pupillary Distance (PD)
                </span>
                <select
                  value={config.prescription.pd}
                  onChange={(e) => updateRx('pd', e.target.value)}
                  className="h-9 px-2.5 rounded-lg border border-black/15 bg-[#F7F7F5] font-mono-tech text-[12px] text-[#141413]"
                >
                  {PD_VALUES.map((pd) => (
                    <option key={pd} value={pd}>
                      {pd} mm
                    </option>
                  ))}
                </select>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-[12px] text-[#141413]">
                <input
                  type="checkbox"
                  checked={config.prescription.highIndex}
                  onChange={(e) => updateRx('highIndex', e.target.checked)}
                  className="w-4 h-4 rounded accent-[#141413]"
                />
                <span>1.74 Ultra-Thin Index (+${HIGH_INDEX_PRICE})</span>
              </label>
            </div>
          </div>
        )}
      </section>

      {/* 04. Sun Clip-On */}
      <section className="py-6 border-b border-black/[0.08]" aria-labelledby="step-clip">
        <div className="flex items-baseline justify-between gap-4 mb-3.5">
          <h2 id="step-clip" className="font-display text-[15px] font-semibold text-[#141413]">
            04. Sun Clip-On Shades
          </h2>
          <span className="text-[12px] text-[#6B6B68]">Matched to {selectedFrame.name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, includeClip: false }))}
            aria-pressed={!config.includeClip}
            className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
              !config.includeClip
                ? 'bg-white border-[#141413] shadow-xs'
                : 'bg-[#EFEFED] border-black/[0.06] hover:border-black/25'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[14px] font-semibold text-[#141413]">
                No Clip-On
              </span>
              <span className="font-mono-tech text-[12px] text-[#5A5A56]">+$0</span>
            </div>
            <p className="text-[12px] text-[#6B6B68] mt-1">Standard indoor &amp; outdoor clear wear</p>
          </button>

          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, includeClip: true }))}
            aria-pressed={config.includeClip}
            className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
              config.includeClip
                ? 'bg-white border-[#141413] shadow-xs'
                : 'bg-[#EFEFED] border-black/[0.06] hover:border-black/25'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[14px] font-semibold text-[#141413]">
                Add Sun Clip
              </span>
              <span className="font-mono-tech text-[12px] font-medium text-[#141413]">
                +${CLIP_ON_PRICE}
              </span>
            </div>
            <p className="text-[12px] text-[#6B6B68] mt-1">
              Polarized UV400 clip + slim pouch
            </p>
          </button>
        </div>

        {config.includeClip && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {CLIP_TINTS.map((tint) => {
              const active = config.clipTint === tint.id;
              return (
                <button
                  key={tint.id}
                  type="button"
                  onClick={() => onChange((prev) => ({ ...prev, clipTint: tint.id }))}
                  aria-pressed={active}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-white border-[#141413]'
                      : 'bg-[#F3F3F1] border-black/[0.06] hover:border-black/20'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: tint.swatch }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-[#141413] truncate">
                      {tint.name}
                    </div>
                    <div className="text-[11px] text-[#6B6B68] truncate">
                      {tint.transmission}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 05. Even R1 Companion Ring */}
      <section className="py-6 border-b border-black/[0.08]" aria-labelledby="step-ring">
        <div className="flex items-baseline justify-between gap-4 mb-3.5">
          <h2 id="step-ring" className="font-display text-[15px] font-semibold text-[#141413]">
            05. Companion Control — Even R1 Ring
          </h2>
          <button
            type="button"
            onClick={onOpenRingGuide}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#5A5A56] hover:text-[#141413] underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Size Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, includeRing: false }))}
            aria-pressed={!config.includeRing}
            className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
              !config.includeRing
                ? 'bg-white border-[#141413] shadow-xs'
                : 'bg-[#EFEFED] border-black/[0.06] hover:border-black/25'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[14px] font-semibold text-[#141413]">
                Glasses Only
              </span>
              <span className="font-mono-tech text-[12px] text-[#5A5A56]">+$0</span>
            </div>
            <p className="text-[12px] text-[#6B6B68] mt-1">Control via temple touchbars &amp; voice</p>
          </button>

          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, includeRing: true }))}
            aria-pressed={config.includeRing}
            className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
              config.includeRing
                ? 'bg-white border-[#141413] shadow-xs'
                : 'bg-[#EFEFED] border-black/[0.06] hover:border-black/25'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[14px] font-semibold text-[#141413]">
                Add Even R1 Ring
              </span>
              <span className="font-mono-tech text-[12px] font-medium text-[#141413]">
                +${RING_PRICE}
              </span>
            </div>
            <p className="text-[12px] text-[#6B6B68] mt-1">
              Subtle gesture navigation &amp; wellness tracking
            </p>
          </button>
        </div>

        {config.includeRing && (
          <div className="mt-3 p-4 rounded-xl bg-white border border-black/[0.09] space-y-4">
            <div>
              <span className="block text-[12px] font-medium text-[#141413] mb-2">
                Ring Finish
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {RING_FINISHES.map((finish) => {
                  const active = config.ringFinish === finish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => onChange((prev) => ({ ...prev, ringFinish: finish.id }))}
                      aria-pressed={active}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-[12px] font-medium cursor-pointer transition-colors ${
                        active
                          ? 'border-[#141413] bg-[#F7F7F5] text-[#141413]'
                          : 'border-black/10 text-[#5A5A56] hover:border-black/25'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: finish.swatch }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{finish.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-[12px] font-medium text-[#141413] mb-2">
                US Ring Size
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {RING_SIZES.map((s) => {
                  const active = config.ringSize === s.us;
                  return (
                    <button
                      key={s.us}
                      type="button"
                      onClick={() => onChange((prev) => ({ ...prev, ringSize: s.us }))}
                      aria-pressed={active}
                      className={`h-9 rounded-lg border font-mono-tech text-[12px] font-medium cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#141413] text-[#F7F7F5] border-[#141413]'
                          : 'bg-[#F7F7F5] text-[#141413] border-black/10 hover:border-black/30'
                      }`}
                    >
                      {s.us}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 06. Add-on Game App (Loss Avoidance Bundle Bonus) */}
      <section className="py-6 border-b border-black/[0.08]" aria-labelledby="step-game">
        <div className="flex items-baseline justify-between gap-4 mb-3.5">
          <h2 id="step-game" className="font-display text-[15px] font-semibold text-[#141413]">
            06. Add-On Game App — Even Hawker Quest
          </h2>
          <button
            type="button"
            onClick={() => onSwitchStageMode('hud')}
            className="text-[12px] font-medium text-[#15803D] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
          >
            Preview in HUD
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange((prev) => ({ ...prev, includeGameApp: !prev.includeGameApp }))
          }
          aria-pressed={config.includeGameApp}
          className={`w-full text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] ${
            config.includeGameApp
              ? 'bg-white border-[#141413] shadow-xs'
              : 'bg-[#EFEFED] border-black/[0.06] hover:border-black/25'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="w-4 h-4 text-[#141413]" aria-hidden="true" />
              <span className="font-display text-[14px] font-semibold text-[#141413]">
                Include Even Hawker Quest AR Game App
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 font-mono-tech text-[12px] shrink-0">
              <span className="text-[#6B6B68] line-through">${GAME_APP_VALUE}</span>
              <span className="font-semibold text-[#15803D]">
                {config.includeGameApp ? 'Free Bundle' : 'Skipped'}
              </span>
            </div>
          </div>
          <p className="text-[12px] text-[#5A5A56] mt-1.5 leading-relaxed">
            Unlock live Hawker Stall check-ins, Friend Streaks, OWNDAYS referral rewards, and collectible ARMY Badges inside your waveguide HUD.
          </p>
        </button>
      </section>

      {/* Loss Avoidance & Pricing Breakdown + 1-Click Green Flashing CTA */}
      <div className="pt-6 space-y-5">
        <div className="p-4 rounded-xl bg-[#EFEFED] border border-black/[0.07] space-y-2 text-[13px]">
          <div className="flex items-center justify-between text-[#141413] font-medium">
            <span className="inline-flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
              <span>Free Express Delivery</span>
            </span>
            <span className="font-mono-tech text-[12px] text-[#15803D]">
              <span className="line-through text-[#6B6B68] mr-1.5">$25</span>
              FREE
            </span>
          </div>
          <div className="flex items-center justify-between text-[#141413] font-medium">
            <span className="inline-flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
              <span>Free Wireless Charging Case</span>
            </span>
            <span className="font-mono-tech text-[12px] text-[#15803D]">
              <span className="line-through text-[#6B6B68] mr-1.5">$79</span>
              FREE
            </span>
          </div>
          {config.includeGameApp && (
            <div className="flex items-center justify-between text-[#141413] font-medium">
              <span className="inline-flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
                <span>Add-on Game App (Hawker Quest)</span>
              </span>
              <span className="font-mono-tech text-[12px] text-[#15803D]">
                <span className="line-through text-[#6B6B68] mr-1.5">${GAME_APP_VALUE}</span>
                INCLUDED
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between text-[#5A5A56]">
            <span>
              {selectedFrame.name} · {selectedColor.name}
            </span>
            <span className="font-mono-tech text-[#141413]">${pricing.base}</span>
          </div>
          {pricing.lens > 0 && (
            <div className="flex justify-between text-[#5A5A56]">
              <span>Single-Vision Prescription Waveguide</span>
              <span className="font-mono-tech text-[#141413]">+${pricing.lens}</span>
            </div>
          )}
          {pricing.highIndex > 0 && (
            <div className="flex justify-between text-[#5A5A56]">
              <span>1.74 Ultra-Thin Index Upgrade</span>
              <span className="font-mono-tech text-[#141413]">+${pricing.highIndex}</span>
            </div>
          )}
          {pricing.clip > 0 && (
            <div className="flex justify-between text-[#5A5A56]">
              <span>Even Sun Clip-On Shades</span>
              <span className="font-mono-tech text-[#141413]">+${pricing.clip}</span>
            </div>
          )}
          {pricing.ring > 0 && (
            <div className="flex justify-between text-[#5A5A56]">
              <span>Even R1 Smart Ring (US {config.ringSize})</span>
              <span className="font-mono-tech text-[#141413]">+${pricing.ring}</span>
            </div>
          )}
          <div className="flex justify-between text-[#DC2626] font-medium">
            <span>20% Limited Discount</span>
            <span className="font-mono-tech">-${pricing.savingsAmount}</span>
          </div>

          <div className="pt-3 border-t border-black/[0.08] flex items-baseline justify-between">
            <span className="font-display text-[15px] font-semibold text-[#141413]">
              Total (20% Off)
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono-tech text-[15px] text-[#6B6B68] line-through">
                ${pricing.originalTotal}
              </span>
              <span className="font-display text-[24px] font-bold text-[#DC2626] tabular-nums">
                ${pricing.total}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Primary Green Flashing Bold 1-Click Button */}
          <button
            type="button"
            onClick={onOneClickBuy}
            className="w-full h-13 px-6 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-display text-[15px] font-bold tracking-tight transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer animate-buy-flash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]"
          >
            <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
            <span className="font-bold">Buy now with 1-Click — ${pricing.total}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onAddToBag}
              className="flex-1 h-11 px-5 rounded-xl bg-[#141413] hover:bg-[#2B2B29] text-[#F7F7F5] font-display text-[13px] font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141413]"
            >
              {justAdded ? 'Added to Bag' : `Add to Bag — $${pricing.total}`}
            </button>

            <button
              type="button"
              onClick={onReset}
              title="Reset configuration"
              aria-label="Reset configuration"
              className="h-11 px-4 rounded-xl border border-black/15 bg-transparent hover:bg-[#EAEAE6] text-[#5A5A56] hover:text-[#141413] transition-colors inline-flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <p className="text-[12px] text-[#6B6B68] leading-relaxed">
          Includes free delivery, free charging case, 30-day home trial, and 1-year warranty.
        </p>
      </div>
    </div>
  );
};
