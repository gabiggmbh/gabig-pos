import { useEffect, useMemo, useRef } from 'react';
import type { BarcodeCaptureListener, BarcodeCaptureSession } from '@scandit/web-datacapture-barcode';
import type { BarcodeCapture } from '@scandit/web-datacapture-barcode';
import { useSDK } from '../sdk';

export default function CameraView({
  onDetect,
  lastScannedName,
}: {
  onDetect: (barcode: string) => void;
  lastScannedName?: string | null;
}) {
  const host = useRef<HTMLDivElement>(null);
  const { loaded, sdk } = useSDK();

  const listener = useMemo<BarcodeCaptureListener>(() => ({
    didScan: async (_: BarcodeCapture, session: BarcodeCaptureSession) => {
      const bc = session.newlyRecognizedBarcode;
      if (bc?.data) onDetect(bc.data);
    },
  }), [onDetect]);

  useEffect(() => {
    if (!loaded || !host.current) return;
    sdk.connectToElement(host.current);
    void sdk.enableCamera(true);
    void sdk.enableScanning(true);
    sdk.addBarcodeCaptureListener(listener);
    return () => {
      sdk.removeBarcodeCaptureListener(listener);
      sdk.detachFromElement();
      void sdk.enableCamera(false);
    };
  }, [loaded, sdk, listener]);

  return (
    <div className="pos-camera">
      <div className="scene" />
      <div className="brackets"><span /><span /></div>
      <div className="scan-line" />
      <div className="cam-meta">
        <span className="rec" />
        <span className="lbl">LIVE · Kamera</span>
      </div>
      <div className="cam-fps">Scandit SDK</div>
      <div ref={host} style={{ position: 'absolute', inset: 0 }} />
      {lastScannedName ? (
        <div className="last-scan">
          <div className="chk">✓</div>
          <div className="info">
            <div className="n">{lastScannedName}</div>
            <div className="s">Zur Bestellung hinzugefügt</div>
          </div>
        </div>
      ) : (
        <div className="hint"><span className="d" />Bereit · Artikel vor die Kamera halten</div>
      )}
    </div>
  );
}
