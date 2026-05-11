"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Eye, EyeOff, Sparkles, Mail, KeyRound } from "lucide-react";
import { setupAdmin } from "./actions";

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Contains a number", test: (v: string) => /\d/.test(v) },
  { label: "Contains an uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Contains a symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function SetupForm() {
  const [state, formAction] = useFormState(setupAdmin, null);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const rulesPassed = RULES.map((r) => r.test(pwd));
  const allPassed = rulesPassed.every(Boolean);
  const matches = pwd.length > 0 && pwd === confirm;

  return (
    <form action={formAction} className="space-y-4">
      <Field
        icon={<Mail size={14} />}
        label="Admin email"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <PasswordField
        label="Password"
        name="password"
        value={pwd}
        onChange={setPwd}
        visible={showPwd}
        onToggle={() => setShowPwd((v) => !v)}
        autoComplete="new-password"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {RULES.map((rule, i) => (
          <RuleRow key={rule.label} label={rule.label} passed={rulesPassed[i]} />
        ))}
      </div>

      <PasswordField
        label="Confirm password"
        name="confirm"
        value={confirm}
        onChange={setConfirm}
        visible={showPwd}
        onToggle={() => setShowPwd((v) => !v)}
        autoComplete="new-password"
        required
        hint={
          confirm.length > 0
            ? matches
              ? "Passwords match"
              : "Passwords do not match"
            : undefined
        }
        hintTone={confirm.length > 0 ? (matches ? "ok" : "error") : "muted"}
      />

      {state && !state.ok && (
        <div
          role="alert"
          className="text-xs font-medium px-3 py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          {state.error}
        </div>
      )}

      <SubmitButton disabled={!allPassed || !matches} />
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="btn-primary w-full justify-center"
    >
      <Sparkles size={15} strokeWidth={1.75} />
      {pending ? "Creating admin…" : "Create admin & sign in"}
    </button>
  );
}

function Field({
  icon,
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
}: {
  icon?: React.ReactNode;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`input-base ${icon ? "pl-9" : ""}`}
        />
      </div>
    </label>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
  required,
  hint,
  hintTone = "muted",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
  hintTone?: "ok" | "error" | "muted";
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
          <KeyRound size={14} />
        </span>
        <input
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          className="input-base pl-9 pr-10"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {hint && (
        <span
          className={
            hintTone === "ok"
              ? "text-[11px] text-green-600 dark:text-green-400"
              : hintTone === "error"
              ? "text-[11px] text-red-600 dark:text-red-400"
              : "text-[11px] text-[var(--text-muted)]"
          }
        >
          {hint}
        </span>
      )}
    </label>
  );
}

function RuleRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span
        className={
          passed
            ? "w-3.5 h-3.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] font-bold"
            : "w-3.5 h-3.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] flex items-center justify-center text-[10px] font-bold border border-[var(--border)]"
        }
        aria-hidden
      >
        {passed ? "✓" : ""}
      </span>
      <span
        className={
          passed
            ? "text-[var(--text-secondary)]"
            : "text-[var(--text-muted)]"
        }
      >
        {label}
      </span>
    </div>
  );
}
