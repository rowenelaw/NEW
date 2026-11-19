/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { ConfiguratorPanel } from './components/ConfiguratorPanel';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { RingSizingModal } from './components/RingSizingModal';
import { SpecsAndComparison } from './components/SpecsAndComparison';
import { StageMode, StudioStage } from './components/StudioStage';
import {
  calculatePrice,
  CartItem,
  ConfigurationState,
  DEFAULT_CONFIG,
} from './data/glassesConfig';

export default function App() {
  const [config, setConfig] = useState<ConfigurationState>(DEFAULT_CONFIG);
  const [stageMode, setStageMode] = useState<StageMode>('studio');
  const [bagItems, setBagItems] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isRingGuideOpen, setIsRingGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToBag = () => {
    const pricing = calculatePrice(config);
    const configKey = JSON.stringify(config);

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
          unitPrice: pricing.total,
        },
      ];
    });

    setJustAdded(true);
    setIsBagOpen(true);
    window.setTimeout(() => setJustAdded(false), 1800);
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

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#141413]">
      <Header bagCount={totalBagCount} onOpenBag={() => setIsBagOpen(true)} />

      <main className="flex-1">
        {/* Primary Sticky Studio + Configurator Split */}
        <section
          id="selection"
          className="max-w-[1360px] mx-auto px-6 md:px-10 pt-8 pb-16 md:pt-12 md:pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7">
              <StudioStage
                config={config}
                stageMode={stageMode}
                onChangeStageMode={setStageMode}
              />
            </div>

            <div className="lg:col-span-5">
              <ConfiguratorPanel
                config={config}
                onChange={setConfig}
                onReset={handleReset}
                onAddToBag={handleAddToBag}
                onOpenRingGuide={() => setIsRingGuideOpen(true)}
                onSwitchStageMode={setStageMode}
                justAdded={justAdded}
              />
            </div>
          </div>
        </section>

        {/* Below-the-Fold Geometry & Optical Specs */}
        <SpecsAndComparison
          selectedFrameId={config.frameId}
          onSelectFrame={(frameId) => {
            setConfig((prev) => ({ ...prev, frameId }));
            setStageMode('studio');
          }}
        />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
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
