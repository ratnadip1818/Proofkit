"use client";

import React from "react";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

// DESIGN TOKENS
export const TOKENS = {
  spacing: {
    xs: "space-y-2",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
  },
  radius: {
    sharp: "rounded-md",
    rounded: "rounded-2xl",
    pill: "rounded-full",
  },
  shadow: {
    none: "shadow-none",
    subtle: "shadow-sm border border-hairline",
    soft: "shadow-md border border-hairline",
    bold: "shadow-xl border border-hairline",
  },
  colors: {
    accent: "var(--color-accent)",
    success: "var(--color-proof)",
    warning: "#D97706",
    danger: "#DC2626",
    muted: "var(--color-ink-secondary)",
    bg: "var(--color-canvas)",
    border: "var(--color-hairline)",
  }
};

// 1. PAGE CONTAINER
interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
  rightHeaderElement?: React.ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  children,
  maxWidth = "",
  rightHeaderElement,
}: PageContainerProps) {
  return (
    <div className="w-full bg-canvas min-h-screen">
      <div className={`w-full ${maxWidth ? `mx-auto ${maxWidth}` : ""} px-5 md:px-10 py-10`}>
        {/* Unified Page Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-extrabold tracking-tight text-ink font-display"
            >
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>}
          </div>
          {rightHeaderElement && <div className="flex items-center gap-2">{rightHeaderElement}</div>}
        </div>

        {/* Content body */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

// 2. SECTION CARD
interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SectionCard({ children, className = "", onClick }: SectionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-hairline bg-surface p-6 shadow-sm transition-product duration-card ease-product ${
        onClick ? "cursor-pointer hover:translate-y-[-2px] hover:shadow-md hover:border-accent/30" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// 3. SECTION HEADER
interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  description?: string;
}

export function SectionHeader({ title, icon, description }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-2">
        {icon && <span className="text-accent shrink-0">{icon}</span>}
        {title}
      </h3>
      {description && <p className="text-[11px] text-ink-secondary mt-0.5">{description}</p>}
    </div>
  );
}

// 4. STATUS BADGE
interface StatusBadgeProps {
  status: "verified" | "connected" | "pending" | "failed" | "archived" | "approved" | "hidden";
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case "verified":
      case "approved":
      case "connected":
        return { cls: "bg-green-50/50 text-proof border-green-200/30", text: label || "Verified" };
      case "pending":
        return { cls: "bg-amber-50 text-amber-600 border-amber-200/30", text: label || "Pending" };
      case "failed":
        return { cls: "bg-red-50 text-red-600 border-red-200/30", text: label || "Needs Attention" };
      case "hidden":
        return { cls: "bg-gray-50 text-ink-secondary border-gray-200/30", text: label || "Archived" };
      case "archived":
      default:
        return { cls: "bg-gray-50 text-ink-secondary border-gray-200/30", text: label || "Archived" };
    }
  };

  const style = getBadgeStyle();

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider select-none ${style.cls}`}>
      <span className={`h-1 w-1 rounded-full ${
        status === "connected" || status === "verified" || status === "approved" 
          ? "bg-proof" 
          : status === "pending" 
            ? "bg-amber-500" 
            : status === "failed" 
              ? "bg-red-500" 
              : "bg-gray-400"
      }`}></span>
      {style.text}
    </span>
  );
}

// 5. BUTTON
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    "rounded-xl px-4 py-2.5 text-xs font-bold transition-product duration-button ease-product flex items-center justify-center gap-1.5 hover:translate-y-[-1px] active:translate-y-[0px] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:translate-y-0 select-none shadow-xs";
  
  const variants = {
    primary: "bg-accent text-surface hover:bg-accent-hover",
    secondary: "border border-hairline bg-surface text-ink hover:bg-canvas",
    danger: "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-ink-secondary hover:bg-ink/5 hover:text-ink border border-transparent shadow-none",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}

// 6. INPUT FIELD
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wide text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-xs text-ink placeholder-[#9CA3AF] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-product duration-hover ease-product ${
          error ? "border-red-500 focus:ring-red-500/10" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

// 7. TEXTAREA FIELD
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | null;
}

export function Textarea({ label, error, className = "", id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wide text-ink">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={4}
        className={`w-full rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-xs text-ink placeholder-[#9CA3AF] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 transition-product duration-hover ease-product ${
          error ? "border-red-500 focus:ring-red-500/10" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

// 8. SELECT DROPDOWN
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wide text-ink">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-xl border border-hairline bg-surface px-3 py-2 text-xs text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-product duration-hover ease-product ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// 9. SWITCH TOGGLE
interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export function Switch({ label, description, checked, onChange, disabled = false }: SwitchProps) {
  return (
    <label className={`flex items-center justify-between cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <div>
        <span className="text-xs font-semibold text-ink block">{label}</span>
        {description && <span className="text-[10px] text-ink-secondary block">{description}</span>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="relative w-9 h-5 bg-hairline peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 transition-product duration-hover ease-product peer-checked:bg-accent"></div>
    </label>
  );
}

// 10. EMPTY STATE
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  primaryCta?: { label: string; href: string; icon?: React.ReactNode };
  secondaryCta?: { label: string; href: string; icon?: React.ReactNode };
}

export function EmptyState({
  title,
  description,
  icon,
  primaryCta,
  secondaryCta,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-hairline bg-surface px-6 py-16 text-center shadow-sm max-w-lg mx-auto select-none">
      {icon && <div className="text-hairline mx-auto mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <p className="text-xs text-ink-secondary mt-1 max-w-sm mx-auto leading-relaxed">{description}</p>
      
      {(primaryCta || secondaryCta) && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {primaryCta && (
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-surface shadow-sm transition-product duration-button ease-product hover:translate-y-[-1px] active:translate-y-[0px] hover:shadow-md"
            >
              {primaryCta.label}
              {primaryCta.icon}
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-xs font-bold text-ink transition-product duration-button ease-product hover:translate-y-[-1px] active:translate-y-[0px] hover:shadow-md"
            >
              {secondaryCta.icon}
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// 11. LOADING SKELETON
interface LoadingSkeletonProps {
  type?: "card" | "table" | "list";
}

export function LoadingSkeleton({ type = "card" }: LoadingSkeletonProps) {
  if (type === "table") {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 animate-shimmer rounded-lg w-full"></div>
        <div className="h-12 animate-shimmer rounded-lg w-full"></div>
        <div className="h-12 animate-shimmer rounded-lg w-full"></div>
        <div className="h-12 animate-shimmer rounded-lg w-full"></div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3">
        <div className="h-4 animate-shimmer rounded-md w-1/3"></div>
        <div className="h-3 animate-shimmer rounded-md w-1/2"></div>
        <div className="h-3 animate-shimmer rounded-md w-1/4"></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5 space-y-4 shadow-sm w-full">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full animate-shimmer"></div>
        <div className="space-y-1.5 flex-1">
          <div className="h-3 animate-shimmer rounded-md w-1/3"></div>
          <div className="h-2 animate-shimmer rounded-md w-1/4"></div>
        </div>
      </div>
      <div className="h-3 animate-shimmer rounded-md w-full"></div>
      <div className="h-3 animate-shimmer rounded-md w-5/6"></div>
    </div>
  );
}
