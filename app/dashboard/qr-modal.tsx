"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, QrCode as QrIcon } from "lucide-react";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function QrModal({ isOpen, onClose, url }: QrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !url) return;
    setLoading(true);

    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: "#1A1A1A",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, url]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-[16px] bg-white border border-[#E8E5E0] p-6 shadow-xl text-center font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#787774] hover:text-[#1A1A1A] p-1.5 rounded-lg hover:bg-[#F7F5F2] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 text-[#2563EB]">
          <QrIcon className="w-5 h-5" />
        </div>

        <h3 className="font-display text-lg font-bold text-[#1A1A1A] tracking-tight">
          Scan to submit review
        </h3>
        <p className="text-xs text-[#787774] mt-1 leading-relaxed">
          Point phone camera at this QR code to open your testimonial collection form.
        </p>

        <div className="my-5 flex items-center justify-center">
          <div className="p-3 bg-white border border-[#E3E0DB] rounded-xl shadow-2xs">
            {loading ? (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-[#787774]">
                Generating QR code...
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Testimonial Collection Form QR Code"
                className="w-56 h-56 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-[#787774]">
                Unable to generate QR code.
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] font-mono text-[#787774] truncate bg-[#F7F6F3] border border-[#E3E0DB] px-3 py-1.5 rounded-lg mb-4">
          {url}
        </p>

        <div className="flex items-center gap-2.5">
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download="blovi-testimonial-qr.png"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR code</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#E3E0DB] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
