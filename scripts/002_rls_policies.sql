-- Row Level Security Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- User profiles policies
CREATE POLICY "Users can view their own profile details" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile details" ON public.user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Prompts policies
CREATE POLICY "Users can view public prompts" ON public.prompts
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own prompts" ON public.prompts
  FOR ALL USING (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Users can view public templates" ON public.templates
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own templates" ON public.templates
  FOR ALL USING (auth.uid() = user_id);

-- AI Integrations policies
CREATE POLICY "Users can manage their own integrations" ON public.ai_integrations
  FOR ALL USING (auth.uid() = user_id);

-- Workflows policies
CREATE POLICY "Users can view public workflows" ON public.workflows
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own workflows" ON public.workflows
  FOR ALL USING (auth.uid() = user_id);

-- Workflow executions policies
CREATE POLICY "Users can view their own executions" ON public.workflow_executions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create executions for their workflows" ON public.workflow_executions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid())
  );

-- Marketplace policies
CREATE POLICY "Anyone can view approved listings" ON public.marketplace_listings
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can manage their own listings" ON public.marketplace_listings
  FOR ALL USING (auth.uid() = user_id);

-- User activities policies
CREATE POLICY "Users can view their own activities" ON public.user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" ON public.user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Collaborations policies
CREATE POLICY "Users can view collaborations they're part of" ON public.collaborations
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = collaborator_id);

CREATE POLICY "Owners can manage collaborations" ON public.collaborations
  FOR ALL USING (auth.uid() = owner_id);
