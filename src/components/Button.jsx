import React from 'react';

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-hidden disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
