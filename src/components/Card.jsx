import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-border rounded-xl p-6 shadow-xs ${className}`}>
      {children}
    </div>
  );
}
