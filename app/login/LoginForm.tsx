"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Eye, EyeOff, LogIn, Mail, KeyRound } from "lucide-react";
import { signIn } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useFormState(signIn, null);
  const [showPwd, setShowPwd] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <Field
        icon={<Mail size={14} />}
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <PasswordField
        label="Password"
        name="password"
        visible={showPwd}
        onToggle={() => setShowPwd((v) => !v)}
        autoComplete="current-password"
        placeholder="••••••••"
        required
      />

      {state && !state.ok && (
        <div
          role="alert"
          className="text-xs font-medium px-3 py-2 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full justify-center"
    >
      <LogIn size={15} strokeWidth={1.75} />
      {pending ? "Signing in…" : "Sign in"}
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
  visible,
  onToggle,
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  visible: boolean;
  onToggle: () => void;
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
          <KeyRound size={14} />
        </span>
        <input
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="input-base pl-9 pr-10"
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
    </label>
  );
}
