import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {createPortal} from "react-dom";

import {Toast, type ToastTone} from "./Toast";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  durationMs: number;
};

type ShowToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  durationMs?: number;
};

type ToastContextValue = {
  showToast: (input: ShowToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({children}: {children: ReactNode}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<
    Map<string, ReturnType<typeof globalThis.setTimeout>>
  >(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (input: ShowToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const next: ToastItem = {
        id,
        title: input.title,
        description: input.description,
        tone: input.tone ?? "info",
        durationMs: input.durationMs ?? 4200,
      };
      setToasts((prev) => [...prev, next]);
      const timer = globalThis.setTimeout(() => {
        dismissToast(id);
      }, next.durationMs);
      timersRef.current.set(id, timer);
    },
    [dismissToast]
  );

  const value = useMemo<ToastContextValue>(() => ({showToast}), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {globalThis.document === undefined
        ? null
        : createPortal(
            <div className="pointer-events-none fixed inset-x-0 top-3 z-[95] mx-auto flex w-full max-w-app flex-col gap-2 px-app-3 sm:top-6">
              {toasts.map((item) => (
                <Toast
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  tone={item.tone}
                  onDismiss={() => dismissToast(item.id)}
                />
              ))}
            </div>,
            globalThis.document.body
          )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (ctx === null) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
