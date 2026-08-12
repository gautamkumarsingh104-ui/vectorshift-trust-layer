/**
 * ============================================================================
 * MOCK DATA — Edit this file to customize demo content before recording
 * ============================================================================
 *
 * To change the agent summary text: edit `summarySegments` below
 * To change guarded actions: edit `guardedActions` below
 * To change pipeline/citation sources: edit `citations` below
 */

export const PIPELINE_NAME = 'Renewal Risk Agent';
export const PIPELINE_STATUS = 'Completed';
export const CURRENT_USER = 'Alex Chen';

// ---------------------------------------------------------------------------
// Summary output with citation markers
// Each segment is either plain text or a citation reference (id matches citations)
// ---------------------------------------------------------------------------
export const summarySegments = [
  { type: 'text', content: 'Acme Corp (Enterprise, ' },
  { type: 'citation', id: 'crm-account', content: 'ARR $480K' },
  { type: 'text', content: ') shows elevated renewal risk. Product usage dropped ' },
  { type: 'citation', id: 'postgres-usage', content: '34% over 60 days' },
  { type: 'text', content: ', with only ' },
  { type: 'citation', id: 'postgres-seats', content: '12 of 50 seats active' },
  { type: 'text', content: '. Support volume spiked to ' },
  { type: 'citation', id: 'zendesk-tickets', content: '7 open tickets' },
  { type: 'text', content: ' in the last 30 days, including billing disputes referenced in the ' },
  { type: 'citation', id: 'rag-contract', content: 'Q3 contract review call' },
  { type: 'text', content: '. Recommend proactive outreach before the March 15 renewal date.' },
];

// ---------------------------------------------------------------------------
// Citation source details — shown when user clicks a citation span
// ---------------------------------------------------------------------------
export const citations = {
  'crm-account': {
    nodeName: 'Salesforce — Account Record',
    nodeType: 'CRM Integration',
    field: 'Account.ARR__c',
    value: '$480,000',
    timestamp: '2026-03-10T09:14:22Z',
    query: null,
  },
  'postgres-usage': {
    nodeName: 'Usage Analytics',
    nodeType: 'Postgres Query',
    field: 'usage_metrics.daily_active_users',
    value: '34% decline (60-day rolling)',
    timestamp: '2026-03-10T09:14:18Z',
    query: `SELECT
  (current_dau - dau_60d_ago) / dau_60d_ago * 100 AS pct_change
FROM usage_metrics
WHERE account_id = 'acme-corp'
  AND date = CURRENT_DATE;`,
  },
  'postgres-seats': {
    nodeName: 'Usage Analytics',
    nodeType: 'Postgres Query',
    field: 'licenses.active_seats / licenses.total_seats',
    value: '12 / 50 (24%)',
    timestamp: '2026-03-10T09:14:18Z',
    query: `SELECT active_seats, total_seats
FROM licenses
WHERE account_id = 'acme-corp';`,
  },
  'zendesk-tickets': {
    nodeName: 'Support Tickets',
    nodeType: 'Zendesk API',
    field: 'tickets.status=open, created_at > 30d',
    value: '7 open tickets',
    timestamp: '2026-03-10T09:14:25Z',
    query: null,
  },
  'rag-contract': {
    nodeName: 'Contract Knowledge Base',
    nodeType: 'RAG Document Chunk',
    field: 'doc: Q3_Contract_Review_Transcript.pdf, p. 4',
    value: '"We need to revisit pricing before renewal — the team isn\'t getting value from the analytics module."',
    timestamp: '2026-03-10T09:14:30Z',
    query: null,
  },
};

// ---------------------------------------------------------------------------
// Pipeline nodes (shown in sidebar for context)
// ---------------------------------------------------------------------------
export const pipelineNodes = [
  { id: 'trigger', name: 'Schedule Trigger', type: 'Trigger', status: 'completed' },
  { id: 'crm', name: 'Salesforce — Account Record', type: 'CRM Integration', status: 'completed' },
  { id: 'postgres', name: 'Usage Analytics', type: 'Postgres Query', status: 'completed' },
  { id: 'zendesk', name: 'Support Tickets', type: 'Zendesk API', status: 'completed' },
  { id: 'rag', name: 'Contract Knowledge Base', type: 'RAG Retrieval', status: 'completed' },
  { id: 'llm', name: 'Risk Summary Generator', type: 'LLM', status: 'completed' },
  { id: 'guard', name: 'Update CRM Risk Score', type: 'Guarded Action', status: 'pending' },
];

// ---------------------------------------------------------------------------
// Guarded write actions — the agent's planned irreversible steps
// ---------------------------------------------------------------------------
export const guardedActions = [
  {
    id: 'action-1',
    integration: 'Salesforce',
    action: 'Update Account Field',
    field: 'Risk_Score__c',
    value: 'High',
    description: 'Set renewal risk score based on usage decline and support volume',
  },
  {
    id: 'action-2',
    integration: 'HubSpot',
    action: 'Create Task',
    field: 'Subject',
    value: 'Proactive renewal outreach — Acme Corp',
    description: 'Assign follow-up task to account executive',
  },
  {
    id: 'action-3',
    integration: 'Slack',
    action: 'Send Channel Message',
    field: '#customer-success',
    value: '⚠️ Acme Corp flagged as high renewal risk — review recommended',
    description: 'Notify CS team of elevated risk flag',
  },
];

// ---------------------------------------------------------------------------
// Read/compute steps that ran automatically (for UI context banner)
// ---------------------------------------------------------------------------
export const autoCompletedSteps = [
  'Fetched Salesforce account record',
  'Queried usage analytics (Postgres)',
  'Retrieved 7 support tickets (Zendesk)',
  'Retrieved contract transcript chunk (RAG)',
  'Generated risk summary (GPT-4o)',
];
