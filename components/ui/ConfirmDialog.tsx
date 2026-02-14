'use client';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-[90%] max-w-100 border-[3px] border-black bg-white p-8 shadow-[5px_5px_0px_black]"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="mb-3 font-mono text-sm font-bold uppercase">
            {title}
          </h3>
        )}
        <p className="mb-6 text-sm leading-relaxed text-gray-600">{message}</p>
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="cursor-pointer border-2 border-gray-300 bg-transparent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gray-500 transition-colors hover:border-black hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer border-2 border-danger bg-danger px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white transition-transform hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
