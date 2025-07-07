-- Insert default categories
INSERT INTO public.categories (name, description, icon, color) VALUES
('Marketing', 'Marketing and advertising prompts', 'megaphone', '#3B82F6'),
('Writing', 'Content creation and writing assistance', 'pen-tool', '#10B981'),
('Development', 'Code generation and development help', 'code', '#8B5CF6'),
('Business', 'Business strategy and analysis', 'briefcase', '#F59E0B'),
('Education', 'Learning and educational content', 'graduation-cap', '#EF4444'),
('Creative', 'Creative and artistic prompts', 'palette', '#EC4899'),
('Data Analysis', 'Data processing and analysis', 'bar-chart', '#06B6D4'),
('Customer Support', 'Customer service and support', 'headphones', '#84CC16');

-- Insert sample prompts
INSERT INTO public.prompts (user_id, title, description, content, category_id, tags, is_public, is_featured) 
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  'Email Marketing Campaign',
  'Generate compelling email marketing campaigns',
  'Create an email marketing campaign for {{product_name}} targeting {{target_audience}}. Include subject line, body content, and call-to-action.',
  (SELECT id FROM public.categories WHERE name = 'Marketing'),
  ARRAY['email', 'marketing', 'campaign'],
  true,
  true
WHERE EXISTS (SELECT 1 FROM auth.users);

INSERT INTO public.prompts (user_id, title, description, content, category_id, tags, is_public, is_featured) 
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  'Code Review Assistant',
  'Comprehensive code review and suggestions',
  'Review the following {{language}} code and provide detailed feedback on:\n1. Code quality and best practices\n2. Performance optimizations\n3. Security considerations\n4. Maintainability improvements\n\nCode:\n{{code_snippet}}',
  (SELECT id FROM public.categories WHERE name = 'Development'),
  ARRAY['code', 'review', 'development'],
  true,
  true
WHERE EXISTS (SELECT 1 FROM auth.users);

-- Insert sample templates
INSERT INTO public.templates (user_id, name, description, category_id, template_data, variables, is_public, is_premium) 
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  'Blog Post Generator',
  'Complete blog post template with SEO optimization',
  (SELECT id FROM public.categories WHERE name = 'Writing'),
  '{"structure": "intro-body-conclusion", "seo_optimized": true, "word_count": "800-1200"}',
  '{"topic": "string", "target_keywords": "array", "tone": "string"}',
  true,
  false
WHERE EXISTS (SELECT 1 FROM auth.users);

-- Insert sample workflow
INSERT INTO public.workflows (user_id, name, description, workflow_data, status, is_public) 
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  'Content Creation Pipeline',
  'Automated content creation and optimization workflow',
  '{"nodes": [{"id": "input-1", "type": "input", "data": {"name": "topic"}, "position": {"x": 100, "y": 100}}, {"id": "ai-1", "type": "ai-model", "data": {"provider": "openai", "model": "gpt-4", "prompt": "Create a blog post about {{topic}}"}, "position": {"x": 300, "y": 100}}], "edges": [{"id": "e1", "source": "input-1", "target": "ai-1"}]}',
  'active',
  true
WHERE EXISTS (SELECT 1 FROM auth.users);
