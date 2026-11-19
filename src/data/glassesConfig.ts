export type FrameId = 'g2-a' | 'g2-b';
export type ColorId = 'grey' | 'green' | 'brown';
export type LensTypeId = 'non-rx' | 'single-vision';
export type ClipTintId = 'dark-grey' | 'amber-green';
export type RingFinishId = 'brushed-silver' | 'matte-black';

export interface FrameOption {
  id: FrameId;
  name: string;
  silhouette: string;
  tagline: string;
  basePrice: number;
  dimensions: {
    lensWidth: number;
    bridge: number;
    temple: number;
    totalWidth: number;
    lensHeight: number;
    weightGrams: number;
  };
  fitNote: string;
}

export interface ColorOption {
  id: ColorId;
  name: string;
  finish: string;
  swatchHex: string;
  accentHex: string;
  priceDelta: number;
}

export interface PrescriptionValues {
  odSph: string;
  odCyl: string;
  odAxis: string;
  osSph: string;
  osCyl: string;
  osAxis: string;
  pd: string;
  highIndex: boolean;
}

export interface ConfigurationState {
  frameId: FrameId;
  colorId: ColorId;
  lensType: LensTypeId;
  prescription: PrescriptionValues;
  includeClip: boolean;
  clipTint: ClipTintId;
  includeRing: boolean;
  ringFinish: RingFinishId;
  ringSize: number;
  includeGameApp: boolean;
}

export interface CartItem {
  uid: string;
  config: ConfigurationState;
  quantity: number;
  originalUnitPrice: number;
  unitPrice: number;
}

export const AMBASSADOR_IMAGE = '/src/assets/images/bts_ambassador_eyewear_1795071538818.jpg';

export const STUDIO_IMAGES: Record<string, string> = {
  'g2-a-grey': '/src/assets/images/g2_a_grey_studio_1795070557040.jpg',
  'g2-b-grey': '/src/assets/images/g2_b_grey_studio_1795070557050.jpg',
  'green': '/src/assets/images/g2_green_studio_1795070557154.jpg',
  'brown': '/src/assets/images/g2_brown_studio_1795070557069.jpg',
  'kit': '/src/assets/images/g2_clip_and_ring_1795070556815.jpg',
};

export function getStudioImageForConfig(frameId: FrameId, colorId: ColorId): string {
  if (colorId === 'green') return STUDIO_IMAGES.green;
  if (colorId === 'brown') return STUDIO_IMAGES.brown;
  return frameId === 'g2-b' ? STUDIO_IMAGES['g2-b-grey'] : STUDIO_IMAGES['g2-a-grey'];
}

export const FRAMES: FrameOption[] = [
  {
    id: 'g2-a',
    name: 'Even G2 A',
    silhouette: 'Panto Round',
    tagline: 'Balanced rounded silhouette crafted for versatile everyday wear.',
    basePrice: 599,
    dimensions: {
      lensWidth: 48,
      bridge: 21,
      temple: 145,
      totalWidth: 136,
      lensHeight: 42,
      weightGrams: 36,
    },
    fitNote: 'Medium fit · Suits oval, square, and heart face profiles',
  },
  {
    id: 'g2-b',
    name: 'Even G2 B',
    silhouette: 'Architectural Rectangular',
    tagline: 'Crisp geometric browline with a slightly wider optical aperture.',
    basePrice: 599,
    dimensions: {
      lensWidth: 51,
      bridge: 20,
      temple: 148,
      totalWidth: 141,
      lensHeight: 39,
      weightGrams: 37,
    },
    fitNote: 'Medium–Wide fit · Suits round, oval, and broader face profiles',
  },
];

export const COLORS: ColorOption[] = [
  {
    id: 'grey',
    name: 'Grey',
    finish: 'Matte Titanium',
    swatchHex: '#505356',
    accentHex: '#8C9094',
    priceDelta: 0,
  },
  {
    id: 'green',
    name: 'Green',
    finish: 'Muted Sage Olive',
    swatchHex: '#5E6D5A',
    accentHex: '#82917D',
    priceDelta: 0,
  },
  {
    id: 'brown',
    name: 'Brown',
    finish: 'Warm Tortoiseshell',
    swatchHex: '#5C402C',
    accentHex: '#8E694C',
    priceDelta: 0,
  },
];

export const LENS_OPTIONS = [
  {
    id: 'non-rx' as LensTypeId,
    name: 'Non-Prescription',
    priceDelta: 0,
    description: 'Zero-power optical resin lenses with dual-sided anti-reflective and scratch-resistant coatings.',
  },
  {
    id: 'single-vision' as LensTypeId,
    name: 'Single-Vision Prescription',
    priceDelta: 150,
    description: 'Digitally surfaced MR-series waveguide lenses calibrated from -12.00 to +12.00 diopters.',
  },
];

export const DISCOUNT_RATE = 0.2;
export const HIGH_INDEX_PRICE = 80;
export const CLIP_ON_PRICE = 99;
export const RING_PRICE = 249;
export const GAME_APP_VALUE = 29;

export const CLIP_TINTS: { id: ClipTintId; name: string; swatch: string; transmission: string }[] = [
  { id: 'dark-grey', name: 'Classic Dark Grey', swatch: '#28292B', transmission: '14% VLT · Polarized' },
  { id: 'amber-green', name: 'Deep Olive G15', swatch: '#354236', transmission: '16% VLT · Polarized' },
];

export const RING_FINISHES: { id: RingFinishId; name: string; swatch: string }[] = [
  { id: 'brushed-silver', name: 'Brushed Titanium', swatch: '#B7B8B5' },
  { id: 'matte-black', name: 'Matte Obsidian', swatch: '#232322' },
];

export const RING_SIZES = [
  { us: 6, diameterMm: '16.5', circumferenceMm: '51.9' },
  { us: 7, diameterMm: '17.3', circumferenceMm: '54.4' },
  { us: 8, diameterMm: '18.1', circumferenceMm: '57.0' },
  { us: 9, diameterMm: '18.9', circumferenceMm: '59.5' },
  { us: 10, diameterMm: '19.8', circumferenceMm: '62.1' },
  { us: 11, diameterMm: '20.6', circumferenceMm: '64.6' },
  { us: 12, diameterMm: '21.4', circumferenceMm: '67.2' },
  { us: 13, diameterMm: '22.2', circumferenceMm: '69.7' },
];

export const SPH_VALUES = [
  '-12.00', '-10.00', '-8.00', '-6.00', '-5.00', '-4.50', '-4.00', '-3.50',
  '-3.00', '-2.50', '-2.00', '-1.75', '-1.50', '-1.25', '-1.00', '-0.75',
  '-0.50', '-0.25', '0.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.50',
  '+2.00', '+2.50', '+3.00', '+4.00', '+6.00',
];

export const CYL_VALUES = [
  '-4.00', '-3.50', '-3.00', '-2.50', '-2.00', '-1.75', '-1.50', '-1.25',
  '-1.00', '-0.75', '-0.50', '-0.25', '0.00',
];

export const PD_VALUES = [
  '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '72',
];

export const DEFAULT_CONFIG: ConfigurationState = {
  frameId: 'g2-a',
  colorId: 'grey',
  lensType: 'non-rx',
  prescription: {
    odSph: '-1.25',
    odCyl: '-0.50',
    odAxis: '90',
    osSph: '-1.00',
    osCyl: '-0.25',
    osAxis: '85',
    pd: '63',
    highIndex: false,
  },
  includeClip: false,
  clipTint: 'dark-grey',
  includeRing: false,
  ringFinish: 'brushed-silver',
  ringSize: 9,
  includeGameApp: true,
};

export function calculatePrice(config: ConfigurationState) {
  const frame = FRAMES.find((f) => f.id === config.frameId) ?? FRAMES[0];
  const color = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];
  const lensDelta = config.lensType === 'single-vision' ? 150 : 0;
  const highIndexDelta =
    config.lensType === 'single-vision' && config.prescription.highIndex ? HIGH_INDEX_PRICE : 0;
  const clipDelta = config.includeClip ? CLIP_ON_PRICE : 0;
  const ringDelta = config.includeRing ? RING_PRICE : 0;

  const originalTotal =
    frame.basePrice + color.priceDelta + lensDelta + highIndexDelta + clipDelta + ringDelta;
  const discountedTotal = Math.round(originalTotal * (1 - DISCOUNT_RATE));
  const savingsAmount = originalTotal - discountedTotal;

  return {
    base: frame.basePrice + color.priceDelta,
    discountedBase: Math.round((frame.basePrice + color.priceDelta) * (1 - DISCOUNT_RATE)),
    lens: lensDelta,
    highIndex: highIndexDelta,
    clip: clipDelta,
    ring: ringDelta,
    originalTotal,
    savingsAmount,
    total: discountedTotal,
  };
}

export interface HawkerLeaderEntry {
  id: string;
  explorer: string;
  badgeName: string;
  stallsVisitedWeek: number;
  stallsVisitedAllTime: number;
  visitsWeek: number;
  visitsAllTime: number;
  favoriteCentre: string;
  streakDays: number;
  isCurrentUser?: boolean;
}

export const INITIAL_HAWKER_LEADERBOARD: HawkerLeaderEntry[] = [
  {
    id: 'u1',
    explorer: 'minji.kopi',
    badgeName: 'Borahae Optical',
    stallsVisitedWeek: 18,
    stallsVisitedAllTime: 94,
    visitsWeek: 31,
    visitsAllTime: 248,
    favoriteCentre: 'Maxwell Food Centre',
    streakDays: 29,
  },
  {
    id: 'u2',
    explorer: 'kenji.sg',
    badgeName: 'Hawker Trailblazer',
    stallsVisitedWeek: 15,
    stallsVisitedAllTime: 82,
    visitsWeek: 24,
    visitsAllTime: 196,
    favoriteCentre: 'Tiong Bahru Market',
    streakDays: 21,
  },
  {
    id: 'u3',
    explorer: 'rowene',
    badgeName: 'ARMY Pioneer',
    stallsVisitedWeek: 12,
    stallsVisitedAllTime: 64,
    visitsWeek: 19,
    visitsAllTime: 142,
    favoriteCentre: 'Old Airport Road',
    streakDays: 14,
    isCurrentUser: true,
  },
  {
    id: 'u4',
    explorer: 'wei.teng',
    badgeName: '7-Star Explorer',
    stallsVisitedWeek: 10,
    stallsVisitedAllTime: 53,
    visitsWeek: 16,
    visitsAllTime: 118,
    favoriteCentre: 'Lau Pa Sat',
    streakDays: 12,
  },
  {
    id: 'u5',
    explorer: 'sara.owndays',
    badgeName: 'OWNDAYS Insider',
    stallsVisitedWeek: 8,
    stallsVisitedAllTime: 41,
    visitsWeek: 13,
    visitsAllTime: 97,
    favoriteCentre: 'Chinatown Complex',
    streakDays: 9,
  },
];

export interface ArmyBadge {
  id: string;
  name: string;
  criteria: string;
  unlocked: boolean;
  accent: string;
}

export const ARMY_BADGES: ArmyBadge[] = [
  {
    id: 'army-pioneer',
    name: 'ARMY Pioneer',
    criteria: 'BTS Global Ambassador Edition early frame selector',
    unlocked: true,
    accent: '#6D28D9',
  },
  {
    id: 'borahae-optical',
    name: 'Borahae Optical',
    criteria: 'Complete 7 consecutive Friend Streak HUD check-ins',
    unlocked: true,
    accent: '#7C3AED',
  },
  {
    id: 'hawker-trailblazer',
    name: 'Hawker Trailblazer',
    criteria: 'Visit 50 unique hawker stalls with Even Quest active',
    unlocked: true,
    accent: '#15803D',
  },
  {
    id: 'seven-star',
    name: '7-Star Collector',
    criteria: 'Refer 1 friend via OWNDAYS Bring a Friend & hit 15-day streak',
    unlocked: false,
    accent: '#5A5A56',
  },
];

export interface FriendStreakPeer {
  id: string;
  name: string;
  streakDays: number;
  checkedInToday: boolean;
  lastStall: string;
}

export const INITIAL_FRIENDS_STREAK: FriendStreakPeer[] = [
  {
    id: 'f1',
    name: 'Minji K.',
    streakDays: 29,
    checkedInToday: true,
    lastStall: 'Tian Tian Chicken Rice · Maxwell',
  },
  {
    id: 'f2',
    name: 'Darren L.',
    streakDays: 14,
    checkedInToday: true,
    lastStall: 'Jian Bo Shui Kueh · Tiong Bahru',
  },
  {
    id: 'f3',
    name: 'Hana T.',
    streakDays: 11,
    checkedInToday: false,
    lastStall: 'Nam Sing Hokkien Mee · Old Airport',
  },
];

export const TECHNICAL_SPECS = [
  {
    category: 'Optical Engine',
    title: 'Dual Micro-LED Waveguide',
    detail: 'Monochrome green 640 × 200 px projection per eye at 1,000 nits peak brightness with zero outward light leakage.',
  },
  {
    category: 'Chassis & Hinge',
    title: 'Magnesium-Titanium Alloy',
    detail: 'Sandblasted biocompatible frame front paired with flexible beta-titanium temples and patented screwless hinge.',
  },
  {
    category: 'Power & Case',
    title: '1.5-Day Continuous Runtime',
    detail: 'Dual 80 mAh temple cells supported by a complimentary USB-C magnetic charging case holding 2.5 full recharges.',
  },
  {
    category: 'Acoustics & Control',
    title: 'Dual-Mic Beamforming + Touch',
    detail: 'Capacitive temple touchbars for instant Teleprompt, Translate, and Even Hawker Quest control alongside Even R1 ring gestures.',
  },
];

export const IN_THE_BOX = [
  'Even G2 Smart Glasses in your selected frame & finish',
  'Complimentary wireless magnetic charging case ($79 value)',
  'Braided USB-C to USB-C charging cable',
  'Microfiber optical cleaning cloth & care booklet',
  'Even Hawker Quest AR Game App license & ARMY Pioneer profile badge',
  'Custom protective clip-on pouch (with Clip-On selection)',
];
