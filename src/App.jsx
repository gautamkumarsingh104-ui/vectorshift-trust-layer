import { useState, useCallback } from 'react';
import {
  PIPELINE_NAME,
  PIPELINE_STATUS,
  CURRENT_USER,
  summarySegments,
  citations,
  pipelineNodes,
  guardedActions,
  autoCompletedSteps,
} from './mockData';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatAuditTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Trust Layer Toggle
// ---------------------------------------------------------------------------
function TrustLayerToggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-panel border transition-all duration-200 ${
        enabled
          ? 'bg-accent-dim/30 border-accent-dim text-accent'
          : 'bg-panel-2 border-line text-muted hover:text-text'
      }`}
    >
      <span className="text-[11px] font-heading font-medium tracking-wide uppercase">
        Trust Layer
      </span>
      <div
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-accent' : 'bg-line'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-text transition-transform duration-200 ${
            enabled ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </div>
      <span className="text-[11px] font-mono">{enabled ? 'ON' : 'OFF'}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Citation Panel
// ---------------------------------------------------------------------------
function CitationPanel({ citationId, onClose }) {
  const citation = citations[citationId];
  if (!citation) return null;

  return (
    <div className="animate-slide-in border-l border-line bg-panel-2 w-80 flex-shrink-0 overflow-y-auto">
      <div className="px-5 py-4 border-b border-line flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-source mb-1">
            Source Evidence
          </p>
          <h3 className="text-sm font-heading font-semibold text-text">{citation.nodeName}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-text transition-colors p-1"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">Node Type</p>
          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono bg-panel border border-line text-text">
            {citation.nodeType}
          </span>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">Field / Source</p>
          <p className="text-xs font-mono text-text break-all">{citation.field}</p>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">Value</p>
          <p className="text-sm font-body text-text leading-relaxed">{citation.value}</p>
        </div>

        {citation.query && (
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">Query</p>
            <pre className="text-[11px] font-mono text-muted bg-bg rounded-panel p-4 overflow-x-auto leading-relaxed border border-line">
              {citation.query}
            </pre>
          </div>
        )}

        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">Pulled At</p>
          <p className="text-xs font-mono text-muted">{formatTimestamp(citation.timestamp)}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary Output
// ---------------------------------------------------------------------------
function SummaryOutput({ trustLayerEnabled, activeCitation, onCitationClick }) {
  return (
    <div className="bg-panel border border-line rounded-panel px-6 py-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-subtle" />
        <h2 className="text-sm font-heading font-semibold text-text">Agent Output</h2>
        <span className="text-[10px] font-mono text-muted ml-auto">Risk Summary Generator</span>
      </div>

      <p className="text-[15px] font-body leading-relaxed text-text/90">
        {summarySegments.map((seg, i) => {
          if (seg.type === 'text') {
            return <span key={i}>{seg.content}</span>;
          }
          if (trustLayerEnabled) {
            return (
              <span
                key={i}
                className={`citation-span ${activeCitation === seg.id ? 'active' : ''}`}
                onClick={() => onCitationClick(seg.id)}
              >
                {seg.content}
              </span>
            );
          }
          return <span key={i}>{seg.content}</span>;
        })}
      </p>

      {trustLayerEnabled && (
        <p className="text-[11px] text-muted mt-4 font-mono">
          Click underlined text to view source evidence
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auto-completed steps banner
// ---------------------------------------------------------------------------
function AutoStepsBanner({ trustLayerEnabled }) {
  return (
    <div className="flex items-start gap-3.5 px-5 py-4 rounded-panel bg-panel-2 border border-line">
      <div className="mt-0.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-ok">
          <path
            d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M5.5 8l2 2 3.5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className="text-[13px] font-body leading-relaxed text-muted">
          <span className="text-text font-medium">Read & compute steps ran automatically</span>
          {' — '}
          {autoCompletedSteps.length} steps completed without pausing.
          {trustLayerEnabled && (
            <span className="text-warn font-medium">
              {' '}Only irreversible write actions require approval below.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Guarded Action Card
// ---------------------------------------------------------------------------
function GuardedActionCard({ action, status, trustLayerEnabled, onApprove, onDeny }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(action.value);
  const [showDenyReason, setShowDenyReason] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  const handleApprove = () => {
    onApprove(action.id, isEditing ? editValue : action.value);
    setIsEditing(false);
  };

  const handleDeny = () => {
    if (!denyReason.trim()) return;
    onDeny(action.id, denyReason);
    setShowDenyReason(false);
  };

  if (!trustLayerEnabled && status === 'pending') {
    return (
      <div className="border border-line rounded-panel px-5 py-4 bg-panel animate-fade-in opacity-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Write Action</span>
          <span className="text-[10px] font-mono text-muted/60 ml-auto">auto-executed</span>
        </div>
        <p className="text-sm font-body text-muted">
          <span className="font-mono">{action.integration}</span>
          {' → '}
          <span className="font-mono">{action.field}: </span>
          <span className="text-text">{action.value}</span>
        </p>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="border border-ok/30 rounded-panel px-5 py-4 bg-ok/[0.06] animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-ok">
            <path d="M5.5 8l2 2 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-wider text-ok">Completed</span>
        </div>
        <p className="text-sm font-body text-text">
          <span className="font-mono text-muted">{action.integration}</span>
          {' → '}
          <span className="font-mono">{action.field}: </span>
          {action.value}
        </p>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="border border-line rounded-panel px-5 py-4 bg-panel opacity-45 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-muted">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Skipped</span>
        </div>
        <p className="text-sm font-body text-muted line-through">
          <span className="font-mono">{action.integration}</span>
          {' → '}
          <span className="font-mono">{action.field}: </span>
          {action.value}
        </p>
      </div>
    );
  }

  // Pending — warn treatment only
  return (
    <div className="border border-warn/35 rounded-panel px-5 py-5 bg-warn-bg animate-fade-in">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-2 h-2 rounded-full bg-warn animate-pulse-subtle" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-warn font-medium">
          Guarded Action — Awaiting Approval
        </span>
      </div>

      <p className="text-xs font-body text-muted mb-4">{action.description}</p>

      <div className="bg-panel rounded-panel px-4 py-3.5 border border-line mb-5">
        <p className="text-sm font-body text-text">
          <span className="font-mono text-accent">{action.integration}</span>
          <span className="text-muted mx-1.5">→</span>
          <span className="font-mono text-muted">{action.action}</span>
        </p>
        <p className="text-sm mt-2">
          <span className="font-mono text-muted">{action.field}: </span>
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="bg-bg border border-accent-dim rounded-md px-2.5 py-1 text-sm font-mono text-text outline-none focus:border-accent w-full max-w-sm"
              autoFocus
            />
          ) : (
            <span className="font-mono text-warn font-medium">{action.value}</span>
          )}
        </p>
      </div>

      {showDenyReason ? (
        <div className="space-y-3 animate-fade-in">
          <input
            type="text"
            placeholder="Reason for denial (required)"
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
            className="w-full bg-bg border border-line rounded-panel px-4 py-2.5 text-sm font-body text-text outline-none focus:border-danger/50 placeholder:text-muted/50"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleDeny}
              disabled={!denyReason.trim()}
              className="px-4 py-2 text-xs font-heading font-medium rounded-panel bg-danger/15 border border-danger/40 text-danger hover:bg-danger/25 transition-colors duration-150 disabled:opacity-40"
            >
              Confirm Deny
            </button>
            <button
              onClick={() => setShowDenyReason(false)}
              className="px-4 py-2 text-xs font-body text-muted hover:text-text transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            className="px-4 py-2 text-xs font-heading font-medium rounded-panel bg-accent text-bg hover:brightness-110 transition-all duration-150"
          >
            Approve
          </button>
          <button
            onClick={() => {
              if (isEditing) {
                handleApprove();
              } else {
                setIsEditing(true);
              }
            }}
            className="px-4 py-2 text-xs font-heading font-medium rounded-panel bg-panel border border-line text-text hover:border-accent-dim transition-colors duration-150"
          >
            {isEditing ? 'Save & Approve' : 'Edit value'}
          </button>
          <button
            onClick={() => setShowDenyReason(true)}
            className="px-4 py-2 text-xs font-body text-muted hover:text-text transition-colors duration-150"
          >
            Deny
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Audit Trail
// ---------------------------------------------------------------------------
function AuditTrailPanel({ entries, expanded, onToggle }) {
  return (
    <div className="border border-line rounded-panel bg-panel overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-panel-2 transition-colors duration-150"
      >
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className={`text-muted transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          >
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs font-heading font-medium text-muted">Audit Trail</span>
          {entries.length > 0 && (
            <span className="text-[10px] font-mono bg-panel-2 border border-line rounded px-1.5 py-0.5 text-muted">
              {entries.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-muted/60">Compliance log</span>
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-line animate-fade-in">
          {entries.length === 0 ? (
            <p className="text-xs text-muted font-mono py-3">No guarded actions recorded yet.</p>
          ) : (
            <div className="space-y-1">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 py-2.5 border-b border-line last:border-0"
                >
                  <div className="mt-1.5">
                    {entry.action === 'approved' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-ok" />
                    )}
                    {entry.action === 'edited' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                    {entry.action === 'denied' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body text-text">
                      <span className="font-mono text-muted">{entry.integration}</span>
                      {' → '}
                      {entry.field}:{' '}
                      <span className={entry.action === 'denied' ? 'line-through text-muted' : ''}>
                        {entry.value}
                      </span>
                    </p>
                    <p className="text-[10px] font-mono text-muted mt-0.5">
                      {entry.action === 'approved' && 'Approved'}
                      {entry.action === 'edited' && 'Edited & approved'}
                      {entry.action === 'denied' && `Denied — ${entry.reason}`}
                      {' by '}
                      {entry.user} · {formatAuditTime(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pipeline Sidebar
// ---------------------------------------------------------------------------
function PipelineSidebar() {
  return (
    <div className="w-56 flex-shrink-0 border-r border-line bg-panel px-4 py-5 overflow-y-auto">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-4">Pipeline Nodes</p>
      <div className="space-y-1.5">
        {pipelineNodes.map((node) => (
          <div
            key={node.id}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-panel text-xs ${
              node.status === 'pending'
                ? 'bg-warn-bg border border-warn/20'
                : 'bg-panel-2 border border-transparent'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                node.status === 'completed'
                  ? 'bg-ok/80'
                  : node.status === 'pending'
                  ? 'bg-warn animate-pulse-subtle'
                  : 'bg-line'
              }`}
            />
            <div className="min-w-0">
              <p className="font-mono text-text truncate text-[11px]">{node.name}</p>
              <p className="text-[10px] text-muted">{node.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------
export default function App() {
  const [trustLayerEnabled, setTrustLayerEnabled] = useState(true);
  const [activeCitation, setActiveCitation] = useState(null);
  const [actionStatuses, setActionStatuses] = useState(() =>
    Object.fromEntries(guardedActions.map((a) => [a.id, 'pending']))
  );
  const [auditEntries, setAuditEntries] = useState([]);
  const [auditExpanded, setAuditExpanded] = useState(false);
  const [editedValues, setEditedValues] = useState({});

  const handleCitationClick = useCallback(
    (id) => {
      if (!trustLayerEnabled) return;
      setActiveCitation((prev) => (prev === id ? null : id));
    },
    [trustLayerEnabled]
  );

  const addAuditEntry = useCallback((action, type, value, reason) => {
    const entry = {
      id: `${action.id}-${Date.now()}`,
      integration: action.integration,
      field: action.field,
      value,
      action: type,
      user: CURRENT_USER,
      timestamp: new Date().toISOString(),
      reason,
    };
    setAuditEntries((prev) => [entry, ...prev]);
    setAuditExpanded(true);
  }, []);

  const handleApprove = useCallback(
    (actionId, finalValue) => {
      const action = guardedActions.find((a) => a.id === actionId);
      if (!action) return;

      const wasEdited = finalValue !== action.value;
      setActionStatuses((prev) => ({ ...prev, [actionId]: 'approved' }));
      if (wasEdited) {
        setEditedValues((prev) => ({ ...prev, [actionId]: finalValue }));
      }
      addAuditEntry(action, wasEdited ? 'edited' : 'approved', finalValue);
    },
    [addAuditEntry]
  );

  const handleDeny = useCallback(
    (actionId, reason) => {
      const action = guardedActions.find((a) => a.id === actionId);
      if (!action) return;

      setActionStatuses((prev) => ({ ...prev, [actionId]: 'denied' }));
      addAuditEntry(action, 'denied', action.value, reason);
    },
    [addAuditEntry]
  );

  const handleTrustLayerToggle = useCallback((enabled) => {
    setTrustLayerEnabled(enabled);
    if (!enabled) {
      setActiveCitation(null);
      setActionStatuses((prev) => {
        const updated = { ...prev };
        guardedActions.forEach((a) => {
          if (updated[a.id] === 'pending') {
            updated[a.id] = 'auto';
          }
        });
        return updated;
      });
    } else {
      setActionStatuses((prev) => {
        const updated = { ...prev };
        guardedActions.forEach((a) => {
          if (updated[a.id] === 'auto') {
            updated[a.id] = 'pending';
          }
        });
        return updated;
      });
    }
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-line bg-panel z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-panel bg-accent flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3v10" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-heading font-semibold text-text">VectorShift</span>
          </div>
          <div className="h-4 w-px bg-line" />
          <div>
            <p className="text-sm font-heading font-medium text-text">{PIPELINE_NAME}</p>
            <p className="text-[10px] font-mono text-muted">
              Status: {PIPELINE_STATUS} · Run #1847
            </p>
          </div>
        </div>

        <TrustLayerToggle enabled={trustLayerEnabled} onChange={handleTrustLayerToggle} />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <PipelineSidebar />

        <div className="flex-1 flex overflow-hidden dot-grid">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <AutoStepsBanner trustLayerEnabled={trustLayerEnabled} />

            <SummaryOutput
              trustLayerEnabled={trustLayerEnabled}
              activeCitation={activeCitation}
              onCitationClick={handleCitationClick}
            />

            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <h2 className="text-sm font-heading font-semibold text-text">
                  {trustLayerEnabled ? 'Guarded Write Actions' : 'Write Actions'}
                </h2>
                {trustLayerEnabled && (
                  <span className="text-[10px] font-mono text-warn bg-warn-bg border border-warn/25 px-2 py-0.5 rounded-md">
                    PAUSED
                  </span>
                )}
                {!trustLayerEnabled && (
                  <span className="text-[10px] font-mono text-muted bg-panel-2 border border-line px-2 py-0.5 rounded-md">
                    AUTO-EXECUTED
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {guardedActions.map((action) => (
                  <GuardedActionCard
                    key={action.id}
                    action={{
                      ...action,
                      value: editedValues[action.id] || action.value,
                    }}
                    status={actionStatuses[action.id]}
                    trustLayerEnabled={trustLayerEnabled}
                    onApprove={handleApprove}
                    onDeny={handleDeny}
                  />
                ))}
              </div>
            </div>

            <AuditTrailPanel
              entries={auditEntries}
              expanded={auditExpanded}
              onToggle={() => setAuditExpanded((p) => !p)}
            />
          </div>

          {trustLayerEnabled && activeCitation && (
            <CitationPanel
              citationId={activeCitation}
              onClose={() => setActiveCitation(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
