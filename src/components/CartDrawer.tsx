import React, { useEffect, useState } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import {
  CartItem,
  CLIP_TINTS,
  COLORS,
  FRAMES,
  getStudioImageForConfig,
  RING_FINISHES,
} from '../data/glassesConfig';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (uid: string, delta: number) => void;
  onRemoveItem: (uid: string) => void;
  onClearBag: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [cityPostal, setCityPostal] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length > 0 && step === 'confirmed') {
      setStep('bag');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim() || !cityPostal.trim()) {
      setFormError('Please complete all required shipping fields.');
      return;
    }
    setFormError('');
    const randomId = `ER-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderNumber(randomId);
    setStep('confirmed');
    onClearBag();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md bg-[#F7F7F5] h-full flex flex-col border-l border-black/10 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-black/[0.08] flex items-center justify-between gap-4">
          <h2 className="font-display text-[17px] font-semibold text-[#141413]">
            {step === 'bag' && 'Your Bag'}
            {step === 'checkout' && 'Express Checkout'}
            {step === 'confirmed' && 'Order Confirmed'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#5A5A56] hover:text-[#141413] hover:bg-[#EAEAE6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 'confirmed' ? (
            <div className="py-8 space-y-5">
              <div className="w-11 h-11 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-[22px] font-semibold text-[#141413]">
                  Order #{orderNumber} Confirmed
                </h3>
                <p className="text-[14px] text-[#5A5A56] mt-2 leading-relaxed">
                  Thank you, {customerName}. Your custom Even G2 configuration is queued for optical verification and dispatch to {shippingAddress}, {cityPostal}.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-black/[0.08] text-[13px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#6B6B68]">Confirmation Sent</span>
                  <span className="text-[#141413] font-medium">{customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B68]">Estimated Dispatch</span>
                  <span className="text-[#141413] font-medium">2–3 Weeks · Express</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('bag');
                  onClose();
                }}
                className="w-full h-11 rounded-xl bg-[#141413] text-[#F7F7F5] text-[13px] font-semibold hover:bg-[#2C2C2A] transition-colors cursor-pointer"
              >
                Continue Configuring
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-display text-[16px] font-medium text-[#141413]">
                Your bag is empty
              </p>
              <p className="text-[13px] text-[#6B6B68] max-w-xs mx-auto">
                Configure your Even G2 frame, lenses, and companion accessories on the studio page.
              </p>
            </div>
          ) : step === 'bag' ? (
            <div className="space-y-5">
              {items.map((item) => {
                const frame = FRAMES.find((f) => f.id === item.config.frameId) ?? FRAMES[0];
                const color = COLORS.find((c) => c.id === item.config.colorId) ?? COLORS[0];
                const clipTint = CLIP_TINTS.find((t) => t.id === item.config.clipTint);
                const ringFinish = RING_FINISHES.find((r) => r.id === item.config.ringFinish);
                const imgSrc = getStudioImageForConfig(item.config.frameId, item.config.colorId);

                return (
                  <div
                    key={item.uid}
                    className="p-4 rounded-xl bg-white border border-black/[0.07] space-y-3"
                  >
                    <div className="flex gap-3.5">
                      <img
                        src={imgSrc}
                        alt={`${frame.name} in ${color.name}`}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 rounded-lg object-cover bg-[#EAEAE6] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-[14px] font-semibold text-[#141413]">
                            {frame.name} · {color.name}
                          </h3>
                          <span className="font-mono-tech text-[13px] font-medium text-[#141413] shrink-0">
                            ${item.unitPrice * item.quantity}
                          </span>
                        </div>
                        <ul className="text-[12px] text-[#5A5A56] mt-1 space-y-0.5">
                          <li>
                            {item.config.lensType === 'single-vision'
                              ? `Single-Vision Rx (OD ${item.config.prescription.odSph} / OS ${item.config.prescription.osSph}, PD ${item.config.prescription.pd} mm)`
                              : 'Non-Prescription Clear Waveguide'}
                          </li>
                          {item.config.lensType === 'single-vision' && item.config.prescription.highIndex && (
                            <li>1.74 Ultra-Thin High-Index</li>
                          )}
                          {item.config.includeClip && (
                            <li>Sun Clip-On ({clipTint?.name})</li>
                          )}
                          {item.config.includeRing && (
                            <li>
                              Even R1 Ring ({ringFinish?.name} · US {item.config.ringSize})
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-black/[0.06] flex items-center justify-between">
                      <div className="inline-flex items-center border border-black/12 rounded-lg bg-[#F7F7F5]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => onUpdateQuantity(item.uid, -1)}
                          className="w-8 h-8 flex items-center justify-center text-[#141413] hover:bg-[#EAEAE6] rounded-l-lg cursor-pointer"
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span className="px-2.5 font-mono-tech text-[12px] text-[#141413]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => onUpdateQuantity(item.uid, 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#141413] hover:bg-[#EAEAE6] rounded-r-lg cursor-pointer"
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.uid)}
                        className="inline-flex items-center gap-1 text-[12px] text-[#6B6B68] hover:text-[#141413] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-800">
                  {formError}
                </div>
              )}
              <label className="block">
                <span className="block text-[12px] font-medium text-[#141413] mb-1">Full Name</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full h-10 px-3 rounded-lg border border-black/15 bg-white text-[13px] text-[#141413] focus:outline-none focus:border-[#141413]"
                />
              </label>
              <label className="block">
                <span className="block text-[12px] font-medium text-[#141413] mb-1">Email Address</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full h-10 px-3 rounded-lg border border-black/15 bg-white text-[13px] text-[#141413] focus:outline-none focus:border-[#141413]"
                />
              </label>
              <label className="block">
                <span className="block text-[12px] font-medium text-[#141413] mb-1">Street Address</span>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="142 Mercer Street, Apt 4B"
                  className="w-full h-10 px-3 rounded-lg border border-black/15 bg-white text-[13px] text-[#141413] focus:outline-none focus:border-[#141413]"
                />
              </label>
              <label className="block">
                <span className="block text-[12px] font-medium text-[#141413] mb-1">City &amp; Postal Code</span>
                <input
                  type="text"
                  value={cityPostal}
                  onChange={(e) => setCityPostal(e.target.value)}
                  placeholder="New York, NY 10012"
                  className="w-full h-10 px-3 rounded-lg border border-black/15 bg-white text-[13px] text-[#141413] focus:outline-none focus:border-[#141413]"
                />
              </label>
            </form>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="px-6 py-5 border-t border-black/[0.08] bg-white space-y-4">
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between text-[#5A5A56]">
                <span>Express Shipping</span>
                <span className="text-[#2D6A4F] font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-display font-semibold text-[#141413]">Subtotal</span>
                <span className="font-display text-[18px] font-semibold text-[#141413] tabular-nums">
                  ${subtotal}
                </span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full h-11 rounded-xl bg-[#141413] hover:bg-[#2C2C2A] text-[#F7F7F5] font-display text-[14px] font-semibold transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="h-11 px-4 rounded-xl border border-black/15 text-[13px] font-medium text-[#141413] hover:bg-[#EAEAE6] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 h-11 rounded-xl bg-[#141413] hover:bg-[#2C2C2A] text-[#F7F7F5] font-display text-[14px] font-semibold transition-colors cursor-pointer"
                >
                  Place Order — ${subtotal}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
