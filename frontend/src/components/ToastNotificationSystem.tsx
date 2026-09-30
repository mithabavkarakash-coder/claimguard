import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'zk-proof' | 'fraud-alert';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // ms, 0 = persistent
  timestamp: Date;
  txHash?: string;
  commitment?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id' | 'timestamp'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: Toast = { ...toast, id, timestamp: new Date() };
    setToasts(prev => [newToast, ...prev].slice(0, 6)); // max 6 visible
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => setToasts([]), []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} onClearAll={clearAll} />
    </ToastContext.Provider>
  );
};

// ─── Config per type ─────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, {
  icon: string;
  barColor: string;
  bgClass: string;
  borderClass: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
}> = {
  success: {
    icon: 'check_circle',
    barColor: '#10b981',
    bgClass: 'rgba(240,253,244,0.97)',
    borderClass: '#bbf7d0',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    titleColor: '#065f46',
  },
  error: {
    icon: 'cancel',
    barColor: '#ef4444',
    bgClass: 'rgba(255,241,242,0.97)',
    borderClass: '#fecdd3',
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    titleColor: '#7f1d1d',
  },
  warning: {
    icon: 'warning',
    barColor: '#f59e0b',
    bgClass: 'rgba(255,251,235,0.97)',
    borderClass: '#fde68a',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    titleColor: '#78350f',
  },
  info: {
    icon: 'info',
    barColor: '#3b82f6',
    bgClass: 'rgba(239,246,255,0.97)',
    borderClass: '#bfdbfe',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    titleColor: '#1e3a8a',
  },
  'zk-proof': {
    icon: 'enhanced_encryption',
    barColor: '#7c3aed',
    bgClass: 'rgba(245,243,255,0.97)',
    borderClass: '#ddd6fe',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    titleColor: '#4c1d95',
  },
  'fraud-alert': {
    icon: 'gpp_bad',
    barColor: '#dc2626',
    bgClass: 'rgba(255,237,237,0.97)',
    borderClass: '#fca5a5',
    iconBg: '#fee2e2',
    iconColor: '#b91c1c',
    titleColor: '#7f1d1d',
  },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  const cfg = TOAST_CONFIG[toast.type];
  const duration = toast.duration ?? 5000;

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss with progress bar
  useEffect(() => {
    if (duration === 0) return;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(tick);
        handleDismiss();
      }
    }, 50);
    return () => clearInterval(tick);
  }, [duration]);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 320);
  };

  return (
    <div
      style={{
        transform: visible && !leaving ? 'translateX(0)' : 'translateX(110%)',
        opacity: visible && !leaving ? 1 : 0,
        transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.32s ease',
        marginBottom: '10px',
        position: 'relative',
        background: cfg.bgClass,
        border: `1px solid ${cfg.borderClass}`,
        borderRadius: '14px',
        boxShadow: '0 4px 24px -4px rgba(15,23,42,0.14), 0 1px 6px -1px rgba(15,23,42,0.08)',
        overflow: 'hidden',
        width: '360px',
        maxWidth: 'calc(100vw - 32px)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Colored top accent bar */}
      <div style={{ height: '3px', background: cfg.barColor, borderRadius: '14px 14px 0 0' }} />

      {/* Progress bar (drains over duration) */}
      {duration > 0 && (
        <div style={{ height: '2px', background: `${cfg.barColor}22` }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: cfg.barColor,
              opacity: 0.5,
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '12px 14px', gap: '12px' }}>
        {/* Icon */}
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: cfg.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '1px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: cfg.iconColor }}>
            {cfg.icon}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: cfg.titleColor, marginBottom: '2px', lineHeight: 1.3 }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
            {toast.message}
          </div>

          {/* Optional tx/commitment line */}
          {(toast.txHash || toast.commitment) && (
            <div style={{ marginTop: '6px', fontSize: '10px', fontFamily: 'monospace', color: '#6366f1', wordBreak: 'break-all' }}>
              {toast.txHash && (
                <span title={toast.txHash}>
                  TX: {toast.txHash.slice(0, 18)}&hellip;{toast.txHash.slice(-6)}
                </span>
              )}
              {toast.commitment && (
                <span title={toast.commitment} style={{ marginLeft: toast.txHash ? '8px' : 0 }}>
                  NUL: {toast.commitment.slice(0, 14)}&hellip;
                </span>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div style={{ marginTop: '4px', fontSize: '10px', color: '#94a3b8' }}>
            {toast.timestamp.toLocaleTimeString()}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            padding: '2px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#475569')}
          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
          aria-label="Dismiss notification"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
        </button>
      </div>
    </div>
  );
};

// ─── Container ────────────────────────────────────────────────────────────────

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void; onClearAll: () => void }> = ({
  toasts,
  onRemove,
  onClearAll,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {/* Clear All button */}
      {toasts.length > 1 && (
        <button
          onClick={onClearAll}
          style={{
            pointerEvents: 'all',
            marginBottom: '6px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748b',
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '4px 10px',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}
        >
          Clear all ({toasts.length})
        </button>
      )}

      {/* Toast list */}
      <div style={{ pointerEvents: 'all' }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};
