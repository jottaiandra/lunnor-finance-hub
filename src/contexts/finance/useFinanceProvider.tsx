
import { useReducer } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { initialState, financeReducer } from "./reducer";
import { useTransactions } from "./hooks/useTransactions";
import { useGoals } from "./hooks/useGoals";
import { useNotifications } from "./hooks/useNotifications";
import { useStats } from "./hooks/useStats";
import { useRealtimeSubscriptions } from "./hooks/useRealtimeSubscriptions";

export function useFinanceProvider() {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const { user } = useAuth();

  // Handle transaction functions
  const transactionMethods = useTransactions(user, state, dispatch);
  
  // Handle goal functions
  const goalMethods = useGoals(user, dispatch);
  
  // Handle notification functions
  const notificationMethods = useNotifications(user, state, dispatch);
  
  // Handle stats functions
  const statsMethods = useStats(state);

  // Combine all methods
  const allMethods = {
    ...transactionMethods,
    ...goalMethods,
    ...notificationMethods,
    ...statsMethods,
    dispatch
  };
  
  // Set up real-time subscriptions and data monitoring
  useRealtimeSubscriptions(user, state, allMethods);

  return {
    state,
    dispatch,
    ...transactionMethods,
    ...goalMethods,
    ...notificationMethods,
    ...statsMethods
  };
}
