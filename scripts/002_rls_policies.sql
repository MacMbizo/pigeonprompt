-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- AI Integrations policies
CREATE POLICY "Users can manage own integrations" ON public.ai_integrations
  FOR ALL USING (auth.uid() = user_id);

-- Prompts policies
CREATE POLICY "Users can manage own prompts" ON public.prompts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public prompts" ON public.prompts
  FOR SELECT USING (is_public = true);

-- Templates policies
CREATE POLICY "Users can manage own templates" ON public.templates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public templates" ON public.templates
  FOR SELECT USING (is_public = true);

-- Workflows policies
CREATE POLICY "Users can manage own workflows" ON public.workflows
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public workflows" ON public.workflows
  FOR SELECT USING (is_public = true);

-- Workflow Executions policies
CREATE POLICY "Users can manage own executions" ON public.workflow_executions
  FOR ALL USING (auth.uid() = user_id);

-- Marketplace Listings policies
CREATE POLICY "Users can manage own listings" ON public.marketplace_listings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view marketplace listings" ON public.marketplace_listings
  FOR SELECT USING (true);

-- User Activities policies
CREATE POLICY "Users can view own activities" ON public.user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert activities" ON public.user_activities
  FOR INSERT WITH CHECK (true);

-- Collaborations policies
CREATE POLICY "Users can view collaborations they're part of" ON public.collaborations
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = collaborator_id);

CREATE POLICY "Owners can manage collaborations" ON public.collaborations
  FOR ALL USING (auth.uid() = owner_id);

-- API Keys policies
CREATE POLICY "Users can manage own API keys" ON public.api_keys
  FOR ALL USING (auth.uid() = user_id);
