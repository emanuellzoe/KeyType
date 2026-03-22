interface HeaderProps {
  statusText: string;
  onOpenLeaderboard: () => void;
  onOpenSettings?: () => void;
}

export function Header({ statusText, onOpenLeaderboard, onOpenSettings }: HeaderProps) {
  return (
    <header className="w-full max-w-5xl animate-fade-in-up">
      <div className="top-nav glass-panel">
        <div className="brand-cluster">
          <div className="brand-mark">K</div>
          <div>
            <h1 className="brand-title">KeyType</h1>
            <p className="brand-subtitle">Speed, rhythm, precision.</p>
          </div>
        </div>

        <nav className="nav-actions">
          <span className="status-pill">{statusText}</span>
          {onOpenSettings && (
            <button className="btn-icon" title="Settings" aria-label="Settings" onClick={onOpenSettings}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
          <button className="btn-icon" title="Leaderboard / Profile" aria-label="Leaderboard" onClick={onOpenLeaderboard}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
