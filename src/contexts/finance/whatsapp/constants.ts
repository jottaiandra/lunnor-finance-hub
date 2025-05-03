
export const EVENT_TYPES = [
  { id: 'new_income', name: 'Nova receita' },
  { id: 'new_expense', name: 'Nova despesa' },
  { id: 'upcoming_expense', name: 'Despesas a vencer' },
  { id: 'goal_achieved', name: 'Meta alcançada' },
  { id: 'low_balance', name: 'Saldo baixo' },
  { id: 'goal_updated', name: 'Meta atualizada' },
  { id: 'transaction_updated', name: 'Transação atualizada' }
];

export const DEFAULT_TEMPLATES = {
  new_income: "Olá {nome}! Uma nova receita de {valor} foi registrada com a descrição: {descricao}.",
  new_expense: "Atenção {nome}! Uma nova despesa de {valor} foi registrada com a descrição: {descricao}.",
  upcoming_expense: "Lembrete: Você tem {count} despesa(s) a vencer nos próximos dias, totalizando {valor}.",
  goal_achieved: "Parabéns {nome}! Sua meta '{titulo}' foi atingida com sucesso!",
  low_balance: "Alerta! Seu saldo atual de {valor} está abaixo do limite definido.",
  goal_updated: "A meta '{titulo}' foi atualizada. Progresso atual: {progresso}%.",
  transaction_updated: "Uma transação foi atualizada: {descricao} - {valor}",
  default: "Notificação do Lunnor Caixa: {mensagem}"
};
