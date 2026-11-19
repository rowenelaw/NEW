import React, { useEffect, useRef, useState } from 'react';
import { Download, Eye, Layers, Sparkles, Square, Video, Zap, ZoomIn } from 'lucide-react';
import {
  COLORS,
  ConfigurationState,
  FRAMES,
  getStudioImageForConfig,
  STUDIO_IMAGES,
} from '../data/glassesConfig';

export type StageMode = 'studio' | 'hud' | 'vr-zoom' | 'kit';
type HudAppMode = 'navigation' | 'teleprompt' | 'translate' | 'hawker-quest';
type VrEffectMode = 'spatial-grid' | 'stereo-depth' | 'off';

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
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [vrEffect, setVrEffect] = useState<VrEffectMode>('spatial-grid');

  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const rafRef = useRef<number | null>(null);
  const zoomRef = useRef(zoomLevel);
  const vrEffectRef = useRef(vrEffect);

  zoomRef.current = zoomLevel;
  vrEffectRef.current = vrEffect;

  const frame = FRAMES.find((f) => f.id === config.frameId) ?? FRAMES[0];
  const color = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];
  const activeImgSrc =
    stageMode === 'kit'
      ? STUDIO_IMAGES.kit
      : getStudioImageForConfig(config.frameId, config.colorId);

  const hasError = imgError[activeImgSrc];
  const activeHud = HUD_PREVIEWS[hudMode];

  // Clean up object URLs & active recorder on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    };
  }, [recordedVideoUrl]);

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  const stopRecording = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startRecording = () => {
    setRecordError(null);
    if (typeof MediaRecorder === 'undefined') {
      setRecordError('Video recording is not supported in this browser.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stream = canvas.captureStream(24);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType });
    } catch {
      recorder = new MediaRecorder(stream);
    }

    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    };

    mediaRecorderRef.current = recorder;
    setRecordSeconds(0);
    setIsRecording(true);
    recorder.start(250);

    const startTime = performance.now();
    const renderFrame = (now: number) => {
      const elapsed = ((now - startTime) / 1000).toFixed(1);
      ctx.fillStyle = '#EAEAE6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = imgRef.current;
      const z = zoomRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        const drawW = canvas.width * z;
        const drawH = canvas.height * z;
        const dx = (canvas.width - drawW) / 2;
        const dy = (canvas.height - drawH) * 0.25;
        ctx.drawImage(img, dx, dy, drawW, drawH);
      }

      // VR Spatial overlay on recorded video
      if (vrEffectRef.current !== 'off') {
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += 80) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Focus reticle + telemetry overlay
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.85)';
      ctx.lineWidth = 2;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const box = 90;
      ctx.strokeRect(cx - box, cy - box, box * 2, box * 2);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(24, 24, 340, 38);
      ctx.fillStyle = '#8FF5AF';
      ctx.font = '15px monospace';
      ctx.fillText(
        `REC 4K POV · ${z.toFixed(1)}x (${Math.round(24 * z)}mm) · ${elapsed}s`,
        36,
        48
      );

      rafRef.current = requestAnimationFrame(renderFrame);
    };
    rafRef.current = requestAnimationFrame(renderFrame);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const rem = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${rem}`;
  };

  const visualScale = stageMode === 'vr-zoom' ? 1 + (zoomLevel - 1) * 0.18 : 1;

  return (
    <div className="lg:sticky lg:top-24 flex flex-col gap-5">
      {/* Main Studio Frame */}
      <div className="relative w-full aspect-[4/3] bg-[#EAEAE6] rounded-2xl overflow-hidden border border-black/[0.06]">
        {!hasError ? (
          <img
            ref={imgRef}
            key={activeImgSrc}
            src={activeImgSrc}
            alt={`${frame.name} in ${color.name} (${color.finish})`}
            referrerPolicy="no-referrer"
            onError={() =>
              setImgError((prev) => ({ ...prev, [activeImgSrc]: true }))
            }
            style={{
              transform: `scale(${visualScale})`,
              transformOrigin: '50% 42%',
            }}
            className={`w-full h-full object-cover object-top transition-all duration-300 ${
              stageMode === 'hud' ? 'brightness-[0.72] contrast-[1.06] scale-[1.02]' : ''
            } ${
              stageMode === 'vr-zoom' && vrEffect === 'stereo-depth'
                ? 'contrast-[1.08] saturate-[1.08]'
                : ''
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

        {/* VR Effects + 10x Zoom Focus + Video Recording Overlay */}
        {stageMode === 'vr-zoom' && (
          <div
            className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6"
            style={{
              background:
                vrEffect === 'spatial-grid'
                  ? 'radial-gradient(circle at center, transparent 42%, rgba(15, 23, 42, 0.48) 100%)'
                  : vrEffect === 'stereo-depth'
                  ? 'radial-gradient(circle at center, transparent 36%, rgba(109, 40, 217, 0.34) 100%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.45), transparent 40%)',
            }}
          >
            {/* VR Spatial Wireframe Grid */}
            {vrEffect === 'spatial-grid' && (
              <div
                className="absolute inset-0 opacity-35"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(139, 92, 246, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.35) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
                aria-hidden="true"
              />
            )}

            {/* Stereoscopic Chromatic Rim Simulation */}
            {vrEffect === 'stereo-depth' && (
              <div
                className="absolute inset-3 rounded-2xl border-2 border-[#7C3AED]/45 shadow-[inset_3px_0_0_rgba(34,211,238,0.45),inset_-3px_0_0_rgba(244,63,94,0.45)]"
                aria-hidden="true"
              />
            )}

            {/* Top Telemetry Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white font-mono-tech text-[11px] border border-white/15">
                {isRecording && (
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" aria-hidden="true" />
                )}
                <span>
                  {isRecording ? `REC ${formatTimer(recordSeconds)} · 4K POV` : '4K Video Capture Ready'}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-[#8FF5AF] font-mono-tech text-[11px] border border-[#52D97E]/30">
                {zoomLevel.toFixed(1)}× Zoom Focus · {Math.round(24 * zoomLevel)} mm
              </div>
            </div>

            {/* Center Autofocus Reticle */}
            <div className="relative z-10 mx-auto w-36 h-28 flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#4ADE80]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#4ADE80]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#4ADE80]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#4ADE80]" />
              <span className="font-mono-tech text-[10px] text-[#8FF5AF] bg-black/55 px-2 py-0.5 rounded">
                AF LOCK · {zoomLevel.toFixed(1)}×
              </span>
            </div>

            {/* Interactive Control Dock */}
            <div className="relative z-10 pointer-events-auto bg-black/75 backdrop-blur-md border border-white/15 rounded-xl p-3 space-y-2.5 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#8FF5AF]" aria-hidden="true" />
                  <span className="text-[11px] font-medium">10× Zoom Focus</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 5, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setZoomLevel(preset)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono-tech cursor-pointer transition-colors ${
                        Math.round(zoomLevel) === preset
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {preset}×
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                aria-label="Optical and digital zoom focus level"
                className="w-full accent-[#4ADE80] cursor-pointer h-1.5"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-white/75 mr-1">VR Effect:</span>
                  {(
                    [
                      { id: 'spatial-grid', label: 'Spatial Grid' },
                      { id: 'stereo-depth', label: 'Stereo VR' },
                      { id: 'off', label: 'Off' },
                    ] as { id: VrEffectMode; label: string }[]
                  ).map((fx) => (
                    <button
                      key={fx.id}
                      type="button"
                      onClick={() => setVrEffect(fx.id)}
                      className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                        vrEffect === fx.id
                          ? 'bg-[#7C3AED] text-white'
                          : 'bg-white/10 text-white/75 hover:text-white'
                      }`}
                    >
                      {fx.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      <Video className="w-3 h-3" aria-hidden="true" />
                      <span>Start REC</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-[#141413] text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      <Square className="w-3 h-3 fill-current" aria-hidden="true" />
                      <span>Stop REC</span>
                    </button>
                  )}

                  {recordedVideoUrl && !isRecording && (
                    <a
                      href={recordedVideoUrl}
                      download="even-g2-pov-capture.webm"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-semibold transition-colors"
                    >
                      <Download className="w-3 h-3" aria-hidden="true" />
                      <span>Save Clip</span>
                    </a>
                  )}
                </div>
              </div>

              {recordError && (
                <p className="text-[11px] text-red-300">{recordError}</p>
              )}
            </div>
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
        {(stageMode === 'studio' || stageMode === 'kit') && (
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
                  : `${frame.silhouette} · 4K Video, 10× Zoom & VR Effects · Free Case Included`}
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
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EAEAE6] rounded-lg border border-black/[0.05] self-start"
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
            aria-selected={stageMode === 'vr-zoom'}
            onClick={() => onChangeStageMode('vr-zoom')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              stageMode === 'vr-zoom'
                ? 'bg-white text-[#141413] shadow-xs'
                : 'text-[#5A5A56] hover:text-[#141413]'
            }`}
          >
            <Video className="w-3.5 h-3.5" aria-hidden="true" />
            <span>VR &amp; 10× Zoom</span>
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
