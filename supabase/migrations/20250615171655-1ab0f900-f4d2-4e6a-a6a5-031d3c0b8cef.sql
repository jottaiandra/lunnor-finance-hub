
-- Habilitar RLS e criar políticas para tabelas sensíveis a dados do usuário

-- 1. alerts
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários só veem seus alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários só inserem seus próprios alerts" ON public.alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários só atualizam seus alerts" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários só deletam seus alerts" ON public.alerts
  FOR DELETE USING (auth.uid() = user_id);

-- 2. goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários só veem suas metas" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários só criam metas para si" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários só atualizam suas metas" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários só deletam suas metas" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

-- 3. notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários só veem suas notificações" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários só criam notificações para si" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários só atualizam suas notificações" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários só deletam suas notificações" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- 4. peace_funds
ALTER TABLE public.peace_funds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário só vê seu próprio Fundo de Paz" ON public.peace_funds
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário só cria Fundo de Paz para si" ON public.peace_funds
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuário só atualiza seu Fundo de Paz" ON public.peace_funds
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuário só deleta seu Fundo de Paz" ON public.peace_funds
  FOR DELETE USING (auth.uid() = user_id);

-- 5. peace_fund_transactions
ALTER TABLE public.peace_fund_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários só veem suas transações do Fundo de Paz" ON public.peace_fund_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários só criam transações para seu Fundo de Paz" ON public.peace_fund_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários só atualizam suas transações do Fundo de Paz" ON public.peace_fund_transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários só deletam suas transações do Fundo de Paz" ON public.peace_fund_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- 6. transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários só veem suas transações" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários só criam transações para si" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários só atualizam suas transações" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários só deletam suas transações" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- 7. whatsapp_config
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário só vê sua configuração" ON public.whatsapp_config
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário só cria configuração própria" ON public.whatsapp_config
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuário só atualiza sua configuração" ON public.whatsapp_config
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuário só deleta sua configuração" ON public.whatsapp_config
  FOR DELETE USING (auth.uid() = user_id);

-- 8. whatsapp_logs
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário só vê seus logs" ON public.whatsapp_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário só insere logs para si" ON public.whatsapp_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuário só atualiza seus logs" ON public.whatsapp_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuário só deleta seus logs" ON public.whatsapp_logs
  FOR DELETE USING (auth.uid() = user_id);

-- 9. whatsapp_templates
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário só vê seus templates" ON public.whatsapp_templates
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuário só cria templates para si" ON public.whatsapp_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuário só atualiza seus templates" ON public.whatsapp_templates
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuário só deleta seus templates" ON public.whatsapp_templates
  FOR DELETE USING (auth.uid() = user_id);

-- 10. profiles (opcional, se não quiser expor todos perfis)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário só vê o próprio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuário só insere/atualiza seu perfil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuário só atualiza seu perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

