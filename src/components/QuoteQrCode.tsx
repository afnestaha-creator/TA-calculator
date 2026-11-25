import React, { useMemo } from 'react';
import QRCode from 'qrcode';

interface QuoteQrCodeProps {
  value: string;
  size?: number;
  label?: string;
}

export function normalizeQrUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function buildWhatsAppContactUrl(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  if (!digits) return 'https://wa.me/';
  return `https://wa.me/${digits}`;
}

export const QuoteQrCode: React.FC<QuoteQrCodeProps> = ({
  value,
  size = 84,
  label = 'QR Code',
}) => {
  const qrData = useMemo(() => {
    const target = normalizeQrUrl(value);
    if (!target) return null;
    try {
      const generated = QRCode.create(target, { errorCorrectionLevel: 'M' });
      const count = generated.modules.size;
      const paths: string[] = [];
      for (let r = 0; r < count; r += 1) {
        for (let c = 0; c < count; c += 1) {
          if (generated.modules.get(r, c)) {
            paths.push(`M${c + 1},${r + 1}h1v1h-1z`);
          }
        }
      }
      return {
        viewBoxSize: count + 2,
        pathData: paths.join(''),
      };
    } catch {
      return null;
    }
  }, [value]);

  if (!qrData) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${qrData.viewBoxSize} ${qrData.viewBoxSize}`}
      role="img"
      aria-label={label}
      data-testid="quote-qr-svg"
      shapeRendering="crispEdges"
      className="block shrink-0 rounded-lg border border-slate-200 bg-white p-1"
    >
      <rect
        x="0"
        y="0"
        width={qrData.viewBoxSize}
        height={qrData.viewBoxSize}
        fill="#FFFFFF"
      />
      <path d={qrData.pathData} fill="#0B1D39" />
    </svg>
  );
};
