import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-white p-6 min-h-screen">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
        <nav className="flex flex-col space-y-1">
          <span className="text-sm text-slate-600 font-medium">Dashboard</span>
        </nav>
      </div>
    </aside>
  );
}
