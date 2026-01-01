import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  readonly onClose?: () => void;
  readonly onScanned?: (value: string) => void; // optional callback
  readonly autoNavigate?: boolean; // default true
}

type CameraDevice = { id: string; label: string };

export function QRScanner({
  onClose,
  onScanned,
  autoNavigate = true,
}: QRScannerProps) {
  const qrRef = useRef<Html5Qrcode | null>(null);

  // Serialize start/stop/reset to avoid race conditions
  const opLock = useRef<Promise<unknown>>(Promise.resolve());

  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  const runLocked = <T,>(fn: () => Promise<T>) => {
    opLock.current = opLock.current.then(fn, fn);
    return opLock.current as Promise<T>;
  };

  const safeStopTracks = async () => {
    // Fallback: force release camera if browser keeps it locked
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      // ignore
    }
  };

  const initInstance = async () => {
    // Ensure reader element exists and clean old DOM
    const el = document.getElementById("reader");
    if (!el) throw new Error("QR reader element not found.");
    el.innerHTML = "";

    qrRef.current = new Html5Qrcode("reader");
  };

  const loadCameras = async () => {
    try {
      setErrMsg("");

      const cams = await Html5Qrcode.getCameras();
      const mapped = (cams ?? []).map((c) => ({
        id: c.id,
        label: c.label || c.id,
      }));

      setDevices(mapped);

      // Keep selected device if still exists, else pick first
      setDeviceId((prev) => {
        if (prev && mapped.some((d) => d.id === prev)) return prev;
        return mapped[0]?.id ?? "";
      });

      if (!mapped.length) {
        setErrMsg("No camera device found.");
      }
    } catch (e: any) {
      console.error("getCameras failed:", e);
      setErrMsg(
        e?.message ||
        "Cannot access cameras. Check HTTPS/permissions and reload."
      );
    }
  };

  const start = async () => {
    await runLocked(async () => {
      setErrMsg("");
      setScanResult(null);

      if (!qrRef.current) {
        await initInstance();
      }

      if (!qrRef.current) throw new Error("Scanner not initialized.");
      if (!deviceId) throw new Error("No camera selected.");
      if (qrRef.current.isScanning) return;

      try {
        await qrRef.current.start(
          deviceId, // Use explicit deviceId (more reliable than facingMode)
          { fps: 10, qrbox: { width: 300, height: 300 } },
          async (decodedText) => {
            // On success: stop safely then handle result
            setScanResult(decodedText);
            onScanned?.(decodedText);

            if (autoNavigate) {
              // Stop first to release camera before navigation
              await runLocked(async () => {
                try {
                  if (qrRef.current?.isScanning) {
                    await qrRef.current.stop();
                  }
                  await qrRef.current?.clear();
                } catch { }
                setRunning(false);
              });

              window.location.href = decodedText;
            }
          },
          () => {
            // per-frame decode error: ignore
          }
        );

        setRunning(true);
      } catch (e: any) {
        console.error("start failed:", e);

        // Common causes: NotAllowedError, NotReadableError, OverconstrainedError
        setErrMsg(e?.message || String(e));

        // If camera got stuck, try force-release once
        await safeStopTracks();

        // Keep state consistent
        setRunning(false);
      }
    });
  };

  const stop = async () => {
    await runLocked(async () => {
      setErrMsg("");

      if (!qrRef.current) {
        setRunning(false);
        return;
      }

      try {
        if (qrRef.current.isScanning) {
          await qrRef.current.stop();
        }
        // Clear removes UI and releases resources for html5-qrcode
        await qrRef.current.clear();
      } catch (e: any) {
        console.warn("stop/clear failed:", e);
        await safeStopTracks();
      } finally {
        setRunning(false);
      }
    });
  };

  const reset = async () => {
    await runLocked(async () => {
      setErrMsg("");
      setScanResult(null);

      try {
        if (qrRef.current?.isScanning) {
          await qrRef.current.stop();
        }
        await qrRef.current?.clear();
      } catch { }

      qrRef.current = null;

      // Re-init instance + reload cameras
      try {
        await initInstance();
        await loadCameras();
      } catch (e: any) {
        console.error("reset failed:", e);
        setErrMsg(e?.message || String(e));
      } finally {
        setRunning(false);
      }
    });
  };

  useEffect(() => {
    // Init once
    runLocked(async () => {
      await initInstance();
      await loadCameras();
    });

    // Stop when tab becomes hidden to avoid stuck camera
    const onVis = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);

      // Cleanup on unmount
      runLocked(async () => {
        try {
          if (qrRef.current?.isScanning) {
            await qrRef.current.stop();
          }
          await qrRef.current?.clear();
        } catch {
          await safeStopTracks();
        } finally {
          qrRef.current = null;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 grid grid-cols-3 items-center">
        <div />
        <h1 className="text-center text-lg font-bold text-slate-900">
          QR Scanner
        </h1>
        {onClose ? (
          <button
            onClick={async () => {
              await stop();
              onClose();
            }}
            className="inline-flex h-9 w-9 items-center justify-center justify-self-end rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]"
            aria-label="Close"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Reader */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        {/* IMPORTANT: id must match Html5Qrcode("reader") */}
        <div id="reader" className="w-full" />
      </div>

      {/* Controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          className="h-10 max-w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          disabled={running}
        >
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={start}
          disabled={running || !deviceId}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Start
        </button>

        <button
          onClick={stop}
          disabled={!running}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Stop
        </button>

        <button
          onClick={reset}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      {/* Error */}
      {errMsg ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errMsg}
        </div>
      ) : null}

      {/* Result */}
      {scanResult ? (
        <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="text-xs font-medium text-slate-500">Scan result</div>
          <div className="mt-2 break-all text-sm font-semibold text-slate-900">
            {scanResult}
          </div>
        </div>
      ) : null}
    </div>
  );
}
