import React, { useState } from 'react';
import { Eye, Layers, Sparkles } from 'lucide-react';
import {
  COLORS,
  ConfigurationState,
  FRAMES,
  getStudioImageForConfig,
  STUDIO_IMAGES,
} from '../data/glassesConfig';

export type StageMode = 'studio' | 'hud' | 'kit';
type HudAppMode = 'navigation' | 'teleprompt' | 'translate' | 'quicknote';

interface StudioStageProps {
  config: ConfigurationState;
  stageMode: StageMode;
  onChangeStageMode: (mode: StageMode) => void;
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
    header: 'DE → EN · Live Caption',
    lines: [
      '"Die neue Magnesium-Titan-Fassung wiegt',
      'nur sechsunddreißig Gramm."',
      '→ The new magnesium-titanium frame',
      'weighs only thirty-six grams.',
    ],
    footer: 'Low-latency microphone active',
  },
  quicknote: {
    label: 'QuickNote',
    header: 'Voice Memo · 09:38',
    lines: [
      '• Confirm 1.74 lens bevel tolerances',
      '• Review anodized sage hinge samples',
      '• Book Thursday flight to Munich',
    ],
    footer: 'Synced to Even App',
  },
};

export const StudioStage: React.FC<StudioStageProps> = ({
  config,
  stageMode,
  onChangeStageMode,
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
            className={`w-full h-full object-cover transition-all duration-300 ${
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25 flex flex-col justify-between p-5 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[12px] font-medium text-white/85 tracking-wide">
                HaLo Waveguide Projection · 640 × 200 px
              </div>
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-lg border border-white/10">
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

            <div className="mx-auto w-full max-w-md rounded-xl bg-black/70 backdrop-blur-md border border-[#52D97E]/30 px-5 py-4 shadow-lg">
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
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-5 py-4 flex items-end justify-between gap-4">
            <div className="text-white">
              <p className="font-display text-[14px] font-medium leading-tight">
                {stageMode === 'kit'
                  ? 'Even G2 Kit · Clip-On & Even R1 Ring'
                  : `${frame.name} — ${color.name}`}
              </p>
              <p className="text-[12px] text-white/80 mt-0.5">
                {stageMode === 'kit'
                  ? 'Polarized magnetic sun clip, leather case, and ceramic-titanium ring'
                  : `${frame.silhouette} · ${color.finish}`}
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
            <span>HUD Display</span>
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
            <span>Clip &amp; Ring Kit</span>
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
