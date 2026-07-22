import { ChangeEvent, InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Labeled text input styled to match the auth forms. `name` is required and
 * doubles as the field's `id`, so every input gets a proper `<label for>`
 * pairing for free (the original markup had none).
 */
export function AuthInput({ label, name, ...inputProps }: AuthInputProps) {
  const id = `auth-${name}`;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-bold text-foreground uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        name={name}
        className="w-full h-11 px-4 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
        {...inputProps}
      />
    </div>
  );
}
