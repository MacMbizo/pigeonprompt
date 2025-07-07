-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.ai_integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_data JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_activities (user_id, activity_type, activity_data)
  VALUES (p_user_id, p_activity_type, p_activity_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_usage_count(
  p_table_name TEXT,
  p_id UUID
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE public.%I SET usage_count = usage_count + 1 WHERE id = $1', p_table_name)
  USING p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate average rating
CREATE OR REPLACE FUNCTION public.update_average_rating(
  p_table_name TEXT,
  p_id UUID,
  p_new_rating DECIMAL
)
RETURNS VOID AS $$
DECLARE
  current_rating DECIMAL;
  current_count INTEGER;
  new_average DECIMAL;
BEGIN
  EXECUTE format('SELECT rating, rating_count FROM public.%I WHERE id = $1', p_table_name)
  INTO current_rating, current_count
  USING p_id;
  
  IF current_count = 0 THEN
    new_average := p_new_rating;
  ELSE
    new_average := ((current_rating * current_count) + p_new_rating) / (current_count + 1);
  END IF;
  
  EXECUTE format('UPDATE public.%I SET rating = $1, rating_count = rating_count + 1 WHERE id = $2', p_table_name)
  USING new_average, p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
