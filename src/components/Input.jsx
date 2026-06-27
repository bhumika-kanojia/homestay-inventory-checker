import React from 'react';

export default function Input({ label, className = '', id, ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        className="px-3.5 py-2 border border-border rounded-lg bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
        {...props}
      />
    </div>
  );
}
