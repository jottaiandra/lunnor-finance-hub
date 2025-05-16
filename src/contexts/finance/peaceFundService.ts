
/**
 * Serviço de Fundo de Paz
 * 
 * Este arquivo agora serve como um agregador das funções específicas
 * que foram refatoradas em arquivos separados para melhor organização.
 */

export {
  // Funcionalidades principais do fundo de paz
  fetchOrCreatePeaceFund,
  updateSettings as updatePeaceFundSettings,
  fetchTransactions as fetchPeaceFundTransactions,
  addTransaction as addPeaceFundTransaction,
  fetchMonthlyEvolution,
  
  // Funções auxiliares
  mapDatabasePeaceFundToFrontend,
  mapDatabaseTransactionToFrontend
} from './services/peaceFund';

