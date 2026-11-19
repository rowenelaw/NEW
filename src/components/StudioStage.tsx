import React, { useState } from 'react';
import { Eye, Layers, Sparkles, Zap } from 'lucide-react';
import {
  COLORS,
  ConfigurationState,
  FRAMES,
  getStudioImageForConfig,
  STUDIO_IMAGES,
} from '../data/glassesConfig';

export type StageMode = 'studio' | 'hud' | 'kit';
type HudAppMode = 'navigation' | 'teleprompt' | 'translate' | 'hawker-quest';

interface StudioStageProps {
  config: ConfigurationState;
  stageMode: StageMode;
  onChangeStageMode: (mode: StageMode) => void;
  totalPrice: number;
  onOneClickBuy: () => void;
}

const HUD_PREVIEWS: Record<
  HudAppMode,
  { label: string; header: string; lines: string[]; footer: string }
> = {
  navigation: {
    label: 'Navigate',
    header: '120 m · Turn right onto Mercer St',
    lines: ['4 min (0.3 km) · ETA 09:42', 'Follow bike lane past Greene St'],
    footer: 'Heading NE · 14°C Clear',
  },
  teleprompt: {
    label: 'Teleprompt',
    header: 'Keynote · Section 02',
    lines: [
      'Everyday eyewear should never feel like',
      'a screen strapped to your face. When',
      'display disappears into glass, focus stays',
      'entirely on the person across from you.',
    ],
    footer: 'AI Sync · 1.0x Pace',
  },
  translate: {
    label: 'Translate',
    header: 'KR → EN · Live Caption',
    lines: [
      '"이븐 리얼리티즈 안경은 정말 가볍고',
      '매일 착용하기에 완벽합니다."',
      '→ Even Realities glasses feel remarkably',
      'lightweight and effortless for daily wear.',
    ],
    footer: 'Low-latency microphone active',
  },
  'hawker-quest': {
    label: 'Hawker Quest',
    header: 'Add-On Game App · Maxwell Food Centre',
    lines: [
      '• Stall #01-10 Checked In (+120 XP)',
      '• Friend Streak: 14 Days Active with Minji K.',
      '• Rank #3 Citywide · 64 Unique Stalls',
    ],
    footer: 'ARMY Pioneer Badge Equipped',
  },
};

export const StudioStage: React.FC<StudioStageProps> = ({
  config,
  stageMode,
  onChangeStageMode,
  totalPrice,
  onOneClickBuy,
}) => {
  const [hudMode, setHudMode] = useState<HudAppMode>('navigation');
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const frame = FRAMES.find((f) => f.id === config.frameId) ?? FRAMES[0];
  const color = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];
  const activeImgSrc =
    stageMode === 'kit'
      ? STUDIO_IMAGES.kit
      : getStudioImageForConfig(config.frameId, config.colorId);

  const hasError = imgError[activeImgSrc];
  const activeHud = HUD_PREVIEWS[hudMode];

  return (
    <div className="lg:sticky lg:top-24 flex flex-col gap-5">
      {/* Main Studio Frame */}
      <div className="relative w-full aspect-[4/3] bg-[#EAEAE6] rounded-2xl overflow-hidden border border-black/[0.06]">
        {!hasError ? (
          <img
            key={activeImgSrc}
            src={activeImgSrc}
            alt={`${frame.name} in ${color.name} (${color.finish})`}
            referrerPolicy="no-referrer"
            onError={() =>
              setImgError((prev) => ({ ...prev, [activeImgSrc]: true }))
            }
            className={`w-full h-full object-cover object-top transition-all duration-300 ${
              stageMode === 'hud' ? 'brightness-[0.72] contrast-[1.06] scale-[1.02]' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#EAEAE6] to-[#DFDFDA] p-8 text-center">
            <svg
              viewBox="0 0 220 72"
              className="w-48 h-16 text-[#141413]/70 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              {config.frameId === 'g2-a' ? (
                <>
                  <circle cx="58" cy="36" r="24" />
                  <circle cx="162" cy="36" r="24" />
                  <path d="M82 32 C95 26, 125 26, 138 32" />
                  <path d="M16 32 L34 32 M186 32 L204 32" />
                </>
              ) : (
                <>
                  <rect x="30" y="14" width="58" height="44" rx="10" />
                  <rect x="132" y="14" width="58" height="44" rx="10" />
                  <path d="M88 30 L132 30" />
                  <path d="M14 28 L30 28 M190 28 L206 28" />
                </>
              )}
            </svg>
            <p className="font-display text-sm font-medium text-[#141413]">
              {frame.name} · {color.name}
            </p>
            <p className="text-xs text-[#6B6B68] mt-1">{color.finish}</p>
          </div>
        )}

        {/* HUD Waveguide Simulation Overlay */}
        {stageMode === 'hud' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25 flex flex-col justify-between p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[12px] font-medium text-white/85 tracking-wide">
                HaLo Waveguide Projection · 640 × 200 px
              </div>
              <div className="flex items-center gap-1 bg-black/55 backdrop-blur-md p-1 rounded-lg border border-white/10">
                {(Object.keys(HUD_PREVIEWS) as HudAppMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setHudMode(mode)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      hudMode === mode
                        ? 'bg-[#2C4A38] text-[#98F5B1]'
                        : 'text-white/75 hover:text-white'
                    }`}
                  >
                    {HUD_PREVIEWS[mode].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-md rounded-xl bg-black/75 backdrop-blur-md border border-[#52D97E]/30 px-5 py-4 shadow-lg">
              <div className="font-mono-tech text-[11px] text-[#7CF0A0]/80 pb-2 mb-2.5 border-b border-[#52D97E]/20 flex items-center justify-between gap-2">
                <span>{activeHud.header}</span>
                <span>1,000 nits</span>
              </div>
              <div className="font-mono-tech text-[13px] leading-relaxed text-[#8FF5AF] space-y-1">
                {activeHud.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="font-mono-tech text-[11px] text-[#7CF0A0]/70 pt-2.5 mt-2.5 border-t border-[#52D97E]/15">
                {activeHud.footer}
              </div>
            </div>

            <div className="text-[12px] text-white/75 text-center">
              Monochrome micro-LED optics remain invisible to people standing in front of you.
            </div>
          </div>
        )}

        {/* Bottom Caption Scrim in Studio / Kit Mode */}
        {stageMode !== 'hud' && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-5 py-4 flex items-end justify-between gap-4">
            <div className="text-white">
              <p className="font-display text-[14px] font-medium leading-tight">
                {stageMode === 'kit'
                  ? 'Even G2 Kit · Free Charging Case, Clip-On & Even R1 Ring'
                  : `${frame.name} — ${color.name}`}
              </p>
              <p className="text-[12px] text-white/80 mt-0.5">
                {stageMode === 'kit'
                  ? 'Includes complimentary wireless charging case ($79 value) & express delivery'
                  : `${frame.silhouette} · ${color.finish} · Free Case & Delivery Included`}
              </p>
            </div>
            {(config.includeClip || config.includeRing) && stageMode === 'studio' && (
              <button
                type="button"
                onClick={() => onChangeStageMode('kit')}
                className="text-[12px] font-medium text-white bg-black/45 hover:bg-black/65 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Preview Added Kit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Duplicate Buy now with 1-Click Button below first image */}
      <button
        type="button"
        onClick={onOneClickBuy}
        className="w-full h-13 px-6 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-display text-[15px] font-bold tracking-tight transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer animate-buy-flash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]"
      >
        <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
        <span className="font-bold">Buy now with 1-Click — ${totalPrice}</span>
      </button>

      {/* Stage Mode Switcher & Optical Spec Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Preview mode"
          className="inline-flex items-center gap-1 p-1 bg-[#EAEAE6] rounded-lg border border-black/[0.05] self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={stageMode === 'studio'}
            onClick={() => onChangeStageMode('studio')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              stageMode === 'studio'
                ? 'bg-white text-[#141413] shadow-xs'
                : 'text-[#5A5A56] hover:text-[#141413]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Studio View</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={stageMode === 'hud'}
            onClick={() => onChangeStageMode('hud')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              stageMode === 'hud'
                ? 'bg-white text-[#141413] shadow-xs'
                : 'text-[#5A5A56] hover:text-[#141413]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>HUD &amp; Game App</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={stageMode === 'kit'}
            onClick={() => onChangeStageMode('kit')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              stageMode === 'kit'
                ? 'bg-white text-[#141413] shadow-xs'
                : 'text-[#5A5A56] hover:text-[#141413]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Free Case &amp; Kit</span>
          </button>
        </div>

        <p className="text-[12px] text-[#6B6B68]">{frame.fitNote}</p>
      </div>

      {/* Tabular Millimeter Dimensions Strip */}
      <div className="grid grid-cols-4 border-t border-b border-black/[0.08] py-3.5 gap-2">
        <div>
          <span className="block text-[11px] text-[#6B6B68]">Lens Width</span>
          <span className="font-mono-tech text-[14px] font-medium text-[#141413]">
            {frame.dimensions.lensWidth} mm
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#6B6B68]">Bridge</span>
          <span className="font-mono-tech text-[14px] font-medium text-[#141413]">
            {frame.dimensions.bridge} mm
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#6B6B68]">Temple</span>
          <span className="font-mono-tech text-[14px] font-medium text-[#141413]">
            {frame.dimensions.temple} mm
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#6B6B68]">Weight</span>
          <span className="font-mono-tech text-[14px] font-medium text-[#141413]">
            {frame.dimensions.weightGrams} g
          </span>
        </div>
      </div>
    </div>
  );
};
