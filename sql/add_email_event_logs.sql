-- Table to log Resend webhook email events
CREATE TABLE IF NOT EXISTS public.email_event_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  resend_id TEXT,
  recipient TEXT,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_event_logs_event_type ON public.email_event_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_email_event_logs_resend_id ON public.email_event_logs(resend_id);
CREATE INDEX IF NOT EXISTS idx_email_event_logs_recipient ON public.email_event_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_event_logs_received_at ON public.email_event_logs(received_at DESC);
