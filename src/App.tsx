/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { ConfiguratorPanel } from './components/ConfiguratorPanel';
import { EcosystemHub } from './components/EcosystemHub';
import { Footer } from './components/Footer';
import { Header, PAGE_TABS, PageTab } from './components/Header';
import { RingSizingModal } from './components/RingSizingModal';
import { SpecsAndComparison } from './components/SpecsAndComparison';
import { StageMode, StudioStage } from './components/StudioStage';
import {
  calculatePrice,
  CartItem,
  COLORS,
  ConfigurationState,
  DEFAULT_CONFIG,
  FRAMES,
} from './data/glassesConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('selection');
  const [config, setConfig] = useState<ConfigurationState>(DEFAULT_CONFIG);
  const [stageMode, setStageMode] = useState<StageMode>('studio');
  const [bagItems, setBagItems] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isRingGuideOpen, setIsRingGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [oneClickOrderSummary, setOneClickOrderSummary] = useState<{
    orderId: string;
    frameLabel: string;
    originalPrice: number;
    finalPrice: number;
    includeGameApp: boolean;
  } | null>(null);

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectTab = (tab: PageTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToBag = () => {
    const pricing = calculatePrice(config);
    const configKey = JSON.stringify(config);

    setOneClickOrderSummary(null);
    setBagItems((prev) => {
      const existing = prev.find((item) => item.uid === configKey);
      if (existing) {
        return prev.map((item) =>
          item.uid === configKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          uid: configKey,
          config: structuredClone(config),
          quantity: 1,
          originalUnitPrice: pricing.originalTotal,
          unitPrice: pricing.total,
        },
      ];
    });

    setJustAdded(true);
    setIsBagOpen(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const handleOneClickBuy = () => {
    const pricing = calculatePrice(config);
    const frame = FRAMES.find((f) => f.id === config.frameId) ?? FRAMES[0];
    const color = COLORS.find((c) => c.id === config.colorId) ?? COLORS[0];
    const randomId = `ER-${Math.floor(1000 + Math.random() * 9000)}`;

    setOneClickOrderSummary({
      orderId: randomId,
      frameLabel: `${frame.name} · ${color.name}`,
      originalPrice: pricing.originalTotal,
      finalPrice: pricing.total,
      includeGameApp: config.includeGameApp,
    });
    setIsBagOpen(true);
  };

  const handleUpdateQuantity = (uid: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.uid === uid ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (uid: string) => {
    setBagItems((prev) => prev.filter((item) => item.uid !== uid));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setStageMode('studio');
  };

  const handleSelectBtsEdition = () => {
    setConfig((prev) => ({
      ...prev,
      frameId: 'g2-a',
      colorId: 'grey',
      includeGameApp: true,
    }));
    setStageMode('studio');
    handleSelectTab('selection');
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#141413]">
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        bagCount={totalBagCount}
        onOpenBag={() => {
          setOneClickOrderSummary(null);
          setIsBagOpen(true);
        }}
      />

      <main className="flex-1">
        {/* Clean Segmented Tab Bar (Mobile + Quick Switcher) */}
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 pt-5">
          <div
            role="tablist"
            aria-label="Page sections"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EAEAE6] rounded-xl border border-black/[0.06]"
          >
            {PAGE_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#141413] shadow-xs font-semibold'
                      : 'text-[#5A5A56] hover:text-[#141413]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Even G2 Studio + Configurator */}
        {activeTab === 'selection' && (
          <section
            id="selection"
            role="tabpanel"
            aria-label="Even G2 Configurator"
            className="max-w-[1360px] mx-auto px-6 md:px-10 pt-6 pb-16 md:pt-8 md:pb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              <div className="lg:col-span-7">
                <StudioStage
                  config={config}
                  stageMode={stageMode}
                  onChangeStageMode={setStageMode}
                  totalPrice={calculatePrice(config).total}
                  onOneClickBuy={handleOneClickBuy}
                />
              </div>

              <div className="lg:col-span-5">
                <ConfiguratorPanel
                  config={config}
                  onChange={setConfig}
                  onReset={handleReset}
                  onAddToBag={handleAddToBag}
                  onOneClickBuy={handleOneClickBuy}
                  onOpenRingGuide={() => setIsRingGuideOpen(true)}
                  onSwitchStageMode={setStageMode}
                  justAdded={justAdded}
                />
              </div>
            </div>
          </section>
        )}

        {/* Tab 2 & Tab 3: Ambassador Showcase & Community Ecosystem (mounted to preserve state) */}
        <EcosystemHub
          activeView={
            activeTab === 'ambassador'
              ? 'ambassador'
              : activeTab === 'community'
              ? 'community'
              : null
          }
          onSelectBtsEdition={handleSelectBtsEdition}
        />

        {/* Tab 4: Optics, Frame Geometry & Included Kit */}
        {activeTab === 'specs' && (
          <div role="tabpanel" aria-label="Optics and Fit">
            <SpecsAndComparison
              selectedFrameId={config.frameId}
              onSelectFrame={(frameId) => {
                setConfig((prev) => ({ ...prev, frameId }));
                setStageMode('studio');
                handleSelectTab('selection');
              }}
            />
          </div>
        )}
      </main>

      <Footer onSelectTab={handleSelectTab} />

      <CartDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        oneClickOrderSummary={oneClickOrderSummary}
        onDismissOneClick={() => setOneClickOrderSummary(null)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setBagItems([])}
      />

      <RingSizingModal
        isOpen={isRingGuideOpen}
        selectedSize={config.ringSize}
        onSelectSize={(ringSize) =>
          setConfig((prev) => ({ ...prev, includeRing: true, ringSize }))
        }
        onClose={() => setIsRingGuideOpen(false)}
      />
    </div>
  );
}
