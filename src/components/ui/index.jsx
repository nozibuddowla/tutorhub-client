import React, { useState, useRef, useEffect } from "react";

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  iconRight,
  full = false,
  children,
  className = "",
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]";

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-teal-500 text-white shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 focus:ring-purple-500",
    secondary:
      "bg-transparent border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:scale-95 focus:ring-purple-500",
    ghost:
      "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] active:scale-95 focus:ring-[var(--bg-border-strong)]",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 focus:ring-red-500",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
      {!loading && iconRight}
    </button>
  );
};

export const Input = ({
  label,
  error,
  hint,
  icon,
  iconRight,
  size = "md",
  full = true,
  className = "",
  id,
  ...rest
}) => {
  const inputId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-4 py-3.5 text-base",
  };

  return (
    <div className={full ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            rounded-xl bg-[var(--bg-muted)] border
            ${error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : "border-[var(--bg-border-strong)] focus:ring-purple-500/50 focus:border-purple-500"}
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            focus:outline-none focus:ring-2 transition-all
            ${sizes[size]}
            ${icon ? "pl-9" : ""}
            ${iconRight ? "pr-9" : ""}
            ${full ? "w-full" : ""}
            ${className}
          `}
          {...rest}
        />
        {iconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  );
};

export const Card = ({
  variant = "default",
  padding = "md",
  hover = false,
  className = "",
  children,
  ...rest
}) => {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const variants = {
    default:
      "bg-[var(--bg-elevated)] border border-[var(--bg-border)] shadow-sm",
    bordered:
      "bg-[var(--bg-elevated)] border-2 border-[var(--bg-border-strong)]",
    flat: "bg-[var(--bg-surface)]",
    gradient:
      "bg-gradient-to-br from-purple-600 to-teal-500 text-white border-0",
  };

  return (
    <div
      className={`
        rounded-2xl transition-all duration-200
        ${variants[variant]}
        ${paddings[padding]}
        ${hover ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : ""}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
};

// Card sub-components for structured layout
Card.Header = ({ children, className = "", divided = false }) => (
  <div
    className={`${divided ? "pb-4 mb-4 border-b border-[var(--bg-border)]" : "mb-4"} ${className}`}
  >
    {children}
  </div>
);

Card.Title = ({ children, className = "" }) => (
  <h3 className={`text-xl font-bold text-[var(--text-primary)] ${className}`}>
    {children}
  </h3>
);

Card.Body = ({ children, className = "" }) => (
  <div className={`text-[var(--text-secondary)] ${className}`}>{children}</div>
);

Card.Footer = ({ children, className = "", divided = false }) => (
  <div
    className={`${divided ? "pt-4 mt-4 border-t border-[var(--bg-border)]" : "mt-4"} ${className}`}
  >
    {children}
  </div>
);

export const Badge = ({
  variant = "purple",
  size = "md",
  dot = false,
  pulse = false,
  children,
  className = "",
}) => {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  const variants = {
    purple:
      "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    teal: "bg-teal-600   dark:bg-teal-900/40   text-white   dark:text-teal-300",
    green:
      "bg-green-100  dark:bg-green-900/40  text-green-700  dark:text-green-300",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
    red: "bg-red-100    dark:bg-red-900/40    text-red-700    dark:text-red-300",
    blue: "bg-blue-100   dark:bg-blue-900/40   text-blue-700   dark:text-blue-300",
    gray: "bg-[var(--bg-muted)] text-[var(--text-secondary)]",
  };

  const dotColors = {
    purple: "bg-purple-500",
    teal: "bg-teal-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-6000",
    blue: "bg-blue-6000",
    gray: "bg-[var(--text-muted)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
};

export const Modal = ({
  open,
  onClose,
  title,
  size = "md",
  children,
  footer,
}) => {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative w-full ${sizes[size]} bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bg-border)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--bg-border)] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Table = ({
  columns = [],
  data = [],
  loading = false,
  empty = "No data found",
  striped = false,
  hoverable = true,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[var(--bg-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--bg-surface)] border-b border-[var(--bg-border)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`px-5 py-3.5 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--bg-border)]">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center">
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-12 text-center text-[var(--text-muted)]"
              >
                {empty}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row._id || row.id || i}
                className={`
                  ${hoverable ? "hover:bg-[var(--bg-surface)] transition-colors" : ""}
                  ${striped && i % 2 === 1 ? "bg-[var(--bg-surface)]/50" : "bg-[var(--bg-elevated)]"}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-3.5 text-[var(--text-secondary)] ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export const Dropdown = ({
  trigger,
  items = [],
  align = "left",
  width = "w-52",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger */}
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {/* Menu */}
      {open && (
        <div
          className={`
            absolute z-50 mt-2 ${width} py-1.5
            bg-[var(--bg-elevated)] border border-[var(--bg-border)]
            rounded-2xl shadow-xl
            ${align === "right" ? "right-0" : "left-0"}
          `}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return (
                <div
                  key={i}
                  className="my-1.5 border-t border-[var(--bg-border)]"
                />
              );
            }
            const cls = `
              w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
              ${
                item.danger
                  ? "text-white dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-900/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
              }
            `;
            return item.href ? (
              <a
                key={i}
                href={item.href}
                className={cls}
                onClick={() => setOpen(false)}
              >
                {item.icon && (
                  <span className="text-base shrink-0">{item.icon}</span>
                )}
                {item.label}
              </a>
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cls}
              >
                {item.icon && (
                  <span className="text-base shrink-0">{item.icon}</span>
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
