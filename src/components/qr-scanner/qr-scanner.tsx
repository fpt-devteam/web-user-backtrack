import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react';
interface QRScannerProps {
  readonly onClose?: () => void
}

export function QRScanner({ onClose }: QRScannerProps) {
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 300,
        height: 300
      },
      fps: 10,
    }, false);

    scanner.render(success, error);

    async function success(result: string) {
      try {
        await scanner.clear();
      } catch (e) {
        console.warn('Failed to clear scanner:', e);
      }
      setScanResult(result);
      // navigate to the scanned URL 
      window.location.href = result;
    }

    function error(err: any) {
      // Handle scan error if needed
      console.warn('QR Scan Error:', err);
    }

    return () => {
      scanner.clear().catch(() => { });
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">QR Scanner</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Chọn camera rồi bấm Start để quét
          </p>
        </div>

        {onClose ? (
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]"
            aria-label="Close"
          >
            ✕
          </button>
        ) : null}
      </div>

      {scanResult ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="text-xs font-medium text-slate-500">Scan result</div>
          <div className="mt-2 break-all text-sm font-semibold text-slate-900">
            {scanResult}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div id="reader" className="w-full" />
        </div>
      )}
    </div>
  );

}
