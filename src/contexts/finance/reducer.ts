
import { FinanceState, FinanceAction } from "./types";

export const initialState: FinanceState = {
  transactions: [],
  goals: [],
  alerts: [],
  notifications: [],
  peaceFund: null,
  peaceFundTransactions: [],
  currentFilter: {
    startDate: null,
    endDate: null,
    type: null,
    category: null,
    searchTerm: ""
  },
  loading: {
    transactions: false,
    goals: false,
    alerts: false,
    notifications: false,
    peaceFund: false
  },
  error: null
};

export const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload
      };
    case "SET_GOALS":
      return {
        ...state,
        goals: action.payload
      };
    case "SET_ALERTS":
      return {
        ...state,
        alerts: action.payload
      };
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload
      };
    case "SET_PEACE_FUND":
      return {
        ...state,
        peaceFund: action.payload
      };
    case "SET_PEACE_FUND_TRANSACTIONS":
      return {
        ...state,
        peaceFundTransactions: action.payload
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        )
      };
    case "ADD_GOAL":
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };
    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.id ? action.payload : goal
        )
      };
    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload)
      };
    case "ADD_PEACE_FUND_TRANSACTION":
      return {
        ...state,
        peaceFundTransactions: [action.payload, ...state.peaceFundTransactions]
      };
    case "UPDATE_PEACE_FUND":
      return {
        ...state,
        peaceFund: state.peaceFund ? { ...state.peaceFund, ...action.payload } : null
      };
    case "MARK_ALERT_READ":
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload ? { ...alert, read: true } : alert
        )
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        )
      };
    case "SET_FILTER":
      return {
        ...state,
        currentFilter: { ...state.currentFilter, ...action.payload }
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
