'use client';

/**
 * Ticket Check-In Scanner (admin)
 *
 * Gate staff select the event, then scan ticket QR codes with the device
 * camera (or type the code manually). Each scan:
 *  - validates the ticket (correct event, confirmed + paid, not a duplicate)
 *  - records the check-in on the purchase
 *  - auto-approves the buyer's pending tournament registration (if any)
 *  - pops a toast telling the admin exactly what happened
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const QR_READER_ID = 'kve-qr-reader';

interface TicketConfig {
  $id: string;
  eventId: string;
  eventTitle: string;
  isActive?: boolean;
}

interface EventOption {
  id: string;
  title: string;
}

interface RegistrationSummary {
  state: 'approved_now' | 'already_approved' | 'none' | 'rejected' | 'external' | 'lookup_error';
  registrationId?: string;
  playerName?: string;
  teamName?: string;
  email?: string;
  tournamentId?: string;
  tournamentTitle?: string;
}

interface ScanResponse {
  code: string;
  result: 'valid' | 'already_scanned' | 'invalid' | 'wrong_event' | 'not_paid' | 'error';
  message?: string;
  scannedAt?: string;
  stats?: { scanned: number; total: number };
  purchase?: {
    purchaseId?: string;
    userName?: string;
    userEmail?: string;
    quantity?: number;
    ticketTypeName?: string;
    eventTitle?: string;
    codeIndex?: number;
  };
  registration?: RegistrationSummary;
}

interface HistoryEntry {
  id: string;
  code: string;
  at: string;
  kind: ScanResponse['result'];
  name: string;
  summary: string;
  approved: boolean;
  notRegistered: boolean;
}

interface Toast {
  id: string;
  kind: 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

/**
 * Collect browser/device details so camera failures are diagnosable
 * (shown in the scanner UI when starting the camera fails).
 */
async function buildCameraDiagnostics(): Promise<string> {
  const parts: string[] = [];
  try {
    parts.push(
      `URL: ${window.location.origin} — ${window.isSecureContext ? 'secure ✓' : 'NOT secure ✗ (camera needs HTTPS or localhost)'}`
    );

    if (!navigator.mediaDevices?.getUserMedia) {
      parts.push('this browser/webview does not expose a camera API');
      return parts.join(' · ');
    }

    try {
      const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
      parts.push(`browser permission: ${status.state}`);
    } catch {
      // Permissions API not supported here
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === 'videoinput');
      parts.push(
        `cameras visible to browser: ${cams.length}${cams[0]?.label ? ` (${cams[0].label})` : ''}`
      );
    } catch {
      // enumerateDevices not available
    }
  } catch {
    // diagnostics are best-effort only
  }
  return parts.join(' · ');
}

export default function CheckInPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<EventOption[]>([]);
  const [loadingConfigs, setLoadingConfigs] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scannerDiag, setScannerDiag] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<string | null>(null);
  const [secureContext, setSecureContext] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [lastResult, setLastResult] = useState<ScanResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const qrRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const lastScanRef = useRef<{ code: string; at: number }>({ code: '', at: 0 });
  const busyRef = useRef(false);
  const processCodeRef = useRef<(code: string) => void>(() => {});

  // Show device/camera status as soon as the page opens (before scanning)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const info = await buildCameraDiagnostics();
      if (cancelled) return;
      setDeviceInfo(info);
      setSecureContext(window.isSecureContext);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !profile?.isAdmin)) {
      router.push('/admin');
    }
  }, [user, profile, loading, router]);

  // Load the event list: only events that still exist AND have ticket
  // configurations (stale configs from renamed/recreated events are dropped)
  useEffect(() => {
    if (!user || !profile?.isAdmin) return;

    const loadEvents = async () => {
      try {
        const [configsRes, eventsRes] = await Promise.all([
          fetch('/api/admin/events/tickets', { cache: 'no-store' }),
          fetch('/api/events?limit=100', { cache: 'no-store' }),
        ]);

        const configsJson = await configsRes.json().catch(() => null);
        const configs: TicketConfig[] =
          configsJson?.success && Array.isArray(configsJson.data) ? configsJson.data : [];

        const eventsJson = await eventsRes.json().catch(() => null);
        const eventsApiOk = eventsJson?.success === true && Array.isArray(eventsJson.data);
        const liveEvents: { $id: string; title: string; date?: string }[] = eventsApiOk
          ? eventsJson.data
          : [];

        // Ticket configs only count for events that are still listed
        const configEventIds = new Set(
          configs.filter((c) => c.isActive !== false).map((c) => c.eventId)
        );

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const options = liveEvents
          .filter((e) => configEventIds.has(e.$id))
          .filter((e) => {
            if (!e.date) return true;
            const parsed = Date.parse(e.date);
            return Number.isNaN(parsed) || parsed >= startOfToday.getTime();
          })
          .map((e) => ({ id: e.$id, title: e.title }))
          .sort((a, b) => a.title.localeCompare(b.title));

        if (eventsApiOk) {
          // Trust the live events list even when empty (truly no current events)
          setEvents(options);
        } else {
          // Fallback when the events API is unavailable: use configs as-is
          const fallback = Array.from(
            new Map(configs.map((c) => [c.eventId, c.eventTitle])).entries()
          ).map(([id, title]) => ({ id, title }));
          setEvents(fallback.sort((a, b) => a.title.localeCompare(b.title)));
        }
      } catch (error) {
        console.error('Failed to load events for check-in:', error);
      } finally {
        setLoadingConfigs(false);
      }
    };

    void loadEvents();
  }, [user, profile]);

  // Default to the first event (or a previously used one on this device)
  useEffect(() => {
    if (events.length === 0 || selectedEventId) return;
    let remembered = '';
    try {
      remembered = window.localStorage.getItem('kve-checkin-event') || '';
    } catch {
      remembered = '';
    }
    setSelectedEventId(events.some((e) => e.id === remembered) ? remembered : events[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length, selectedEventId]);

  useEffect(() => {
    if (!selectedEventId) return;
    try {
      window.localStorage.setItem('kve-checkin-event', selectedEventId);
    } catch {
      // ignore storage failures
    }
  }, [selectedEventId]);

  const pushToast = (kind: Toast['kind'], title: string, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, kind, title, message }]);
    const ttl = kind === 'error' ? 8000 : 6000;
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, ttl);
  };

  const playBeep = (kind: 'success' | 'warning' | 'error') => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      const now = ctx.currentTime;
      const freq = kind === 'success' ? 880 : kind === 'warning' ? 523 : 220;
      const dur = kind === 'error' ? 0.4 : 0.18;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.start(now);
      osc.stop(now + dur);
      osc.onended = () => ctx.close();
    } catch {
      // sound is best-effort only
    }
  };

  const applyResult = (data: ScanResponse) => {
    setLastResult(data);

    const name = data.purchase?.userName || data.registration?.playerName || 'Attendee';
    const reg = data.registration;
    const tournament = reg?.tournamentTitle || 'the tournament';
    let toastKind: Toast['kind'] = 'success';
    let title = '';
    let message = '';

    switch (data.result) {
      case 'valid':
        if (reg?.state === 'approved_now') {
          toastKind = 'success';
          title = 'Ticket valid — registration APPROVED';
          message = `${name} checked in and was approved for ${tournament}.`;
        } else if (reg?.state === 'none') {
          toastKind = 'warning';
          title = 'Ticket valid — not registered';
          message = `${name} has NOT registered for ${tournament}. Ask them to register; their ticket is already checked in and will be auto-approved.`;
        } else if (reg?.state === 'rejected') {
          toastKind = 'warning';
          title = 'Ticket valid — registration was rejected';
          message = `${name} checked in, but their ${tournament} registration was rejected.`;
        } else if (reg?.state === 'already_approved') {
          toastKind = 'success';
          title = 'Ticket valid — checked in';
          message = `${name} checked in. Registration already approved for ${tournament}.`;
        } else {
          toastKind = 'success';
          title = 'Ticket valid — checked in';
          message = `${name} checked in for ${data.purchase?.eventTitle || 'the event'}.`;
        }
        break;
      case 'already_scanned':
        toastKind = 'warning';
        title = 'Already scanned';
        message = `${data.message || 'This ticket was already checked in.'} (${name})`;
        if (reg?.state === 'approved_now') {
          message += ` Registration was still pending — approved now.`;
        }
        break;
      case 'wrong_event':
        toastKind = 'error';
        title = 'Wrong event';
        message = data.message || 'This ticket belongs to another event.';
        break;
      case 'not_paid':
        toastKind = 'error';
        title = 'Ticket not valid';
        message = data.message || 'This ticket is not paid / confirmed.';
        break;
      case 'invalid':
        toastKind = 'error';
        title = 'Invalid ticket';
        message = data.message || 'This code is not a valid ticket.';
        break;
      default:
        toastKind = 'error';
        title = 'Check-in error';
        message = data.message || 'Something went wrong. Try again.';
        break;
    }

    pushToast(toastKind, title, message);
    playBeep(toastKind === 'success' ? 'success' : toastKind === 'warning' ? 'warning' : 'error');

    setHistory((prev) =>
      [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          code: data.code,
          at: new Date().toISOString(),
          kind: data.result,
          name,
          summary: message,
          approved: reg?.state === 'approved_now',
          notRegistered: reg?.state === 'none',
        },
        ...prev,
      ].slice(0, 40)
    );
  };

  const processCode = async (codeInput: string) => {
    const code = codeInput.trim();
    if (!code || !selectedEventId) return;
    if (busyRef.current) return;

    // Ignore rapid duplicate frames from the camera for the same code
    const now = Date.now();
    if (lastScanRef.current.code === code && now - lastScanRef.current.at < 4000) return;
    lastScanRef.current = { code, at: now };

    busyRef.current = true;
    setBusy(true);

    try {
      const res = await fetch(`/api/events/${selectedEventId}/tickets/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        applyResult({
          code,
          result: 'error',
          message: json?.message || `Check-in failed (HTTP ${res.status})`,
        });
        return;
      }

      applyResult({ code, ...(json.data as Omit<ScanResponse, 'code'>) });
    } catch (error) {
      console.error('Check-in request failed:', error);
      applyResult({
        code,
        result: 'error',
        message: 'Network error — check the connection and try again.',
      });
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  processCodeRef.current = (code: string) => {
    void processCode(code);
  };

  // Camera lifecycle
  useEffect(() => {
    if (!cameraActive || !selectedEventId) return;
    let disposed = false;

    const start = async () => {
      try {
        setScannerError(null);
        setScannerDiag(null);
        const mod = await import('html5-qrcode');
        if (disposed) return;

        const qr = new mod.Html5Qrcode(QR_READER_ID, { verbose: false });
        qrRef.current = qr as unknown as { stop: () => Promise<void>; clear: () => void };

        await qr.start(
          { facingMode: 'environment' },
          {
            fps: 12,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const size = Math.max(160, Math.round(Math.min(viewfinderWidth, viewfinderHeight, 340) * 0.8));
              return { width: size, height: size };
            },
          },
          (decodedText: string) => {
            processCodeRef.current(decodedText);
          },
          () => {
            // per-frame decode misses are expected; ignore
          }
        );
      } catch (error) {
        console.error('Camera start failed:', error);
        if (!disposed) {
          const errName = (error as { name?: string })?.name || '';
          const errMessage = (error as { message?: string })?.message || String(error);
          const combined = `${errName} ${errMessage}`;

          let hint =
            'Camera unavailable. Allow camera access in your browser, or type the ticket code manually below.';

          if (/NotAllowedError|Permission denied/i.test(combined)) {
            hint =
              'Camera access was denied. Check the diagnostics below — if the URL is not HTTPS or localhost, the browser blocks the camera there (use the HTTPS link on a phone, or http://localhost:3000 on the computer). If the URL is fine, allow the camera prompt: on a laptop click the camera icon in the address bar → Allow → reload; on a phone allow camera access in the browser settings.';
          } else if (/NotFoundError|DevicesNotFoundError/i.test(combined)) {
            hint =
              'No camera found on this device — use a phone to scan, or type the ticket code manually below.';
          } else if (/NotReadableError|TrackStartError/i.test(combined)) {
            hint =
              'The camera is busy in another app or blocked by the system. Close other apps using the camera, then press "Start Camera" again.';
          } else if (/OverconstrainedError/i.test(combined)) {
            hint =
              'The requested camera is not available on this device. Press "Start Camera" again to use the default camera, or type the code manually.';
          }

          setScannerError(hint);
          setScannerDiag(await buildCameraDiagnostics());
          setCameraActive(false);
        }
      }
    };

    void start();

    return () => {
      disposed = true;
      const qr = qrRef.current;
      qrRef.current = null;
      if (qr) {
        qr.stop()
          .then(() => {
            try {
              qr.clear();
            } catch {
              // ignore
            }
          })
          .catch(() => {
            // stop() throws when the scanner never started — safe to ignore
          });
      }
    };
  }, [cameraActive, selectedEventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#961c18] mx-auto mb-4"></div>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user || !profile?.isAdmin) {
    return null; // Will redirect
  }

  const checkedInCount = history.filter((h) => h.kind === 'valid').length;
  const approvedCount = history.filter((h) => h.approved).length;
  const notRegisteredCount = history.filter((h) => h.notRegistered).length;
  const problemCount = history.filter((h) => h.kind !== 'valid' && h.kind !== 'already_scanned').length;

  const resultStyles: Record<ScanResponse['result'], { border: string; badge: string; label: string }> = {
    valid: { border: 'border-green-500/60 bg-green-500/10', badge: 'bg-green-500 text-black', label: 'CHECKED IN' },
    already_scanned: { border: 'border-amber-500/60 bg-amber-500/10', badge: 'bg-amber-500 text-black', label: 'ALREADY SCANNED' },
    invalid: { border: 'border-red-500/60 bg-red-500/10', badge: 'bg-red-500 text-white', label: 'INVALID' },
    wrong_event: { border: 'border-red-500/60 bg-red-500/10', badge: 'bg-red-500 text-white', label: 'WRONG EVENT' },
    not_paid: { border: 'border-red-500/60 bg-red-500/10', badge: 'bg-red-500 text-white', label: 'NOT PAID' },
    error: { border: 'border-red-500/60 bg-red-500/10', badge: 'bg-red-500 text-white', label: 'ERROR' },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${
              t.kind === 'success'
                ? 'border-green-500/60 bg-green-950/90'
                : t.kind === 'warning'
                  ? 'border-amber-500/60 bg-amber-950/90'
                  : 'border-red-500/60 bg-red-950/90'
            }`}
          >
            <p className="font-semibold text-sm">{t.title}</p>
            <p className="text-sm text-gray-200 mt-0.5">{t.message}</p>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Ticket Check-In</h1>
            <p className="text-gray-400 text-sm mt-1">
              Scan a ticket to check the attendee in — pending tournament registrations are approved automatically.
            </p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Back to Admin
          </button>
        </div>

        {/* Event selector + session stats */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
          <label className="text-sm text-gray-300 font-medium">Event:</label>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setCameraActive(false);
              setLastResult(null);
              setSelectedEventId(e.target.value);
            }}
            className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white min-w-[240px]"
            disabled={loadingConfigs}
          >
            {events.length === 0 && <option value="">No ticketed events found</option>}
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2 ml-auto text-xs">
            <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
              Checked in: {checkedInCount}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
              Auto-approved: {approvedCount}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Not registered: {notRegisteredCount}
            </span>
            <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
              Problems: {problemCount}
            </span>
          </div>
        </div>

        {events.length === 0 && !loadingConfigs && (
          <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-4 mb-6 text-amber-300 text-sm">
            No current events have tickets configured. Set up ticketing under Admin → Tickets first.
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: camera + manual entry */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">QR Scanner</h2>
                <button
                  onClick={() => setCameraActive((v) => !v)}
                  disabled={!selectedEventId || secureContext === false}
                  className={`px-4 py-2 rounded font-medium transition-colors disabled:opacity-40 ${
                    cameraActive ? 'bg-gray-600 hover:bg-gray-500' : 'bg-[#961c18] hover:bg-[#b02420]'
                  }`}
                >
                  {cameraActive ? 'Stop Camera' : 'Start Camera'}
                </button>
              </div>

              {deviceInfo && (
                <p
                  className={`mb-3 text-xs break-words ${
                    secureContext === false ? 'text-amber-400' : 'text-gray-500'
                  }`}
                >
                  {deviceInfo}
                </p>
              )}
              {secureContext === false && (
                <p className="mb-3 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/40 rounded p-2">
                  Camera scanning is blocked on this address — browsers only allow the camera on
                  HTTPS or localhost. Open this page at <strong>http://localhost:3000</strong> on
                  this computer, or use the <strong>HTTPS tunnel link</strong> on a phone. Manual
                  code entry still works here.
                </p>
              )}

              <div className="relative rounded-lg overflow-hidden bg-black min-h-[280px] flex items-center justify-center">
                <div id={QR_READER_ID} className="w-full" />
                {!cameraActive && (
                  <p className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm px-6 text-center">
                    Camera is off — press “Start Camera” to scan ticket QR codes.
                  </p>
                )}
                {busy && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-black/70 text-xs text-gray-200">
                    Processing…
                  </div>
                )}
              </div>

              {scannerError && (
                <div className="mt-3 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/40 rounded p-3">
                  <p>{scannerError}</p>
                  {scannerDiag && (
                    <p className="mt-2 text-xs text-amber-200/70 break-words">{scannerDiag}</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="font-semibold mb-3">Manual code entry</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const code = manualCode;
                  setManualCode('');
                  void processCode(code);
                }}
                className="flex gap-2"
              >
                <input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. IND-EVT-…-001"
                  className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  disabled={busy || !manualCode.trim() || !selectedEventId}
                  className="px-4 py-2 bg-[#961c18] hover:bg-[#b02420] rounded font-medium disabled:opacity-40"
                >
                  Check In
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                USB barcode scanners work too — focus the field and scan.
              </p>
            </div>
          </div>

          {/* Right: last result + history */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 min-h-[220px]">
              <h2 className="font-semibold mb-3">Last scan</h2>
              {!lastResult ? (
                <p className="text-gray-500 text-sm">No scans yet. The result of the next scan will appear here.</p>
              ) : (
                <div className={`rounded-lg border p-4 ${resultStyles[lastResult.result].border}`}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold ${resultStyles[lastResult.result].badge}`}
                    >
                      {resultStyles[lastResult.result].label}
                    </span>
                    {lastResult.scannedAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(lastResult.scannedAt).toLocaleTimeString()}
                        {lastResult.stats ? ` · ${lastResult.stats.scanned}/${lastResult.stats.total} tickets` : ''}
                      </span>
                    )}
                  </div>

                  {lastResult.purchase?.userName && (
                    <p className="text-lg font-semibold">{lastResult.purchase.userName}</p>
                  )}
                  {lastResult.purchase?.userEmail && (
                    <p className="text-sm text-gray-400">{lastResult.purchase.userEmail}</p>
                  )}
                  <p className="text-sm text-gray-300 mt-1">
                    {lastResult.purchase?.ticketTypeName}
                    {lastResult.purchase?.codeIndex ? ` · ticket ${lastResult.purchase.codeIndex}` : ''}
                  </p>
                  <p className="text-xs font-mono text-gray-500 mt-1 break-all">{lastResult.code}</p>
                  {lastResult.message && <p className="text-sm mt-2 text-gray-200">{lastResult.message}</p>}

                  {lastResult.registration && (
                    <div className="mt-3 pt-3 border-t border-white/10 text-sm">
                      {lastResult.registration.state === 'approved_now' && (
                        <p className="text-green-400 font-medium">
                          ✅ Registration approved — {lastResult.registration.playerName}
                          {lastResult.registration.teamName ? ` (${lastResult.registration.teamName})` : ''} ·{' '}
                          {lastResult.registration.tournamentTitle}
                        </p>
                      )}
                      {lastResult.registration.state === 'already_approved' && (
                        <p className="text-green-400">
                          ✅ Registration already approved — {lastResult.registration.playerName}
                        </p>
                      )}
                      {lastResult.registration.state === 'none' && (
                        <p className="text-amber-400 font-medium">
                          ⚠️ Not registered for {lastResult.registration.tournamentTitle} — once they register, the
                          ticket will auto-approve them.
                        </p>
                      )}
                      {lastResult.registration.state === 'rejected' && (
                        <p className="text-amber-400">
                          ⚠️ Registration was rejected for {lastResult.registration.tournamentTitle}
                        </p>
                      )}
                      {lastResult.registration.state === 'external' && (
                        <p className="text-gray-400">External event — no tournament registration to approve.</p>
                      )}
                      {lastResult.registration.state === 'lookup_error' && (
                        <p className="text-gray-400">Registration check unavailable — verify manually if needed.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="font-semibold mb-3">Recent scans</h2>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">Scans from this session will be listed here.</p>
              ) : (
                <ul className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-start gap-3 text-sm">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                          h.kind === 'valid'
                            ? 'bg-green-500'
                            : h.kind === 'already_scanned'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-gray-200">
                          {new Date(h.at).toLocaleTimeString()} · <span className="font-medium">{h.name}</span>
                          {h.approved && <span className="ml-2 text-green-400">approved</span>}
                          {h.notRegistered && <span className="ml-2 text-amber-400">not registered</span>}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{h.summary}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
