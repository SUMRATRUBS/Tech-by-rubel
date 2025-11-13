import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { User, CreditPackage, Settings, PaymentRequest, PaymentDetails, PaymentStatus } from '../types';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants';
import toast from 'react-hot-toast';

interface GlobalState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  payments: PaymentRequest[];
  settings: Settings;
  activePage: string;
}

const initialState: GlobalState = {
  currentUser: null,
  isAuthenticated: false,
  users: [
    { id: 'user-1', name: 'Demo User', email: 'user@demo.com', credits: 10, role: 'user', isBlocked: false },
  ],
  payments: [],
  settings: {
    paymentDetails: {
      methodName: 'Bkash/Nagad',
      accountNumber: '01700000000',
      qrCodeUrl: 'https://i.ibb.co/68ycr2S/placeholder-qr.png'
    },
    creditPackages: [
      { id: 'pkg1', name: 'Starter Pack', credits: 100, price: 50 },
      { id: 'pkg2', name: 'Pro Pack', credits: 500, price: 200 },
      { id: 'pkg3', name: 'Mega Pack', credits: 1200, price: 450 },
    ]
  },
  activePage: 'generate'
};

type Action =
  | { type: 'LOGIN'; payload: { user: User } }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP'; payload: { newUser: User } }
  | { type: 'SET_ACTIVE_PAGE'; payload: string }
  | { type: 'DEDUCT_CREDITS'; payload: { userId: string; amount: number } }
  | { type: 'REQUEST_PAYMENT'; payload: PaymentRequest }
  | { type: 'APPROVE_PAYMENT'; payload: { paymentId: string } }
  | { type: 'REJECT_PAYMENT'; payload: { paymentId: string } }
  | { type: 'UPDATE_USER_CREDITS'; payload: { userId: string, credits: number } }
  | { type: 'TOGGLE_USER_BLOCK'; payload: { userId: string } }
  | { type: 'UPDATE_PAYMENT_SETTINGS'; payload: PaymentDetails }
  | { type: 'SET_QR_CODE'; payload: string }
  | { type: 'ADD_CREDIT_PACKAGE'; payload: CreditPackage }
  | { type: 'UPDATE_CREDIT_PACKAGE'; payload: CreditPackage }
  | { type: 'DELETE_CREDIT_PACKAGE'; payload: { packageId: string } };

const globalStateReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, currentUser: action.payload.user, activePage: action.payload.user.role === 'admin' ? 'dashboard' : 'generate' };
    case 'LOGOUT':
      return { ...initialState, users: state.users, payments: state.payments, settings: state.settings };
    case 'SIGNUP':
      return { ...state, isAuthenticated: true, currentUser: action.payload.newUser, users: [...state.users, action.payload.newUser], activePage: 'generate' };
    case 'SET_ACTIVE_PAGE':
      return { ...state, activePage: action.payload };
    case 'DEDUCT_CREDITS': {
        const updatedUsers = state.users.map(u => u.id === action.payload.userId ? {...u, credits: u.credits - action.payload.amount} : u);
        const updatedCurrentUser = state.currentUser && state.currentUser.id === action.payload.userId ? {...state.currentUser, credits: state.currentUser.credits - action.payload.amount} : state.currentUser;
        return { ...state, users: updatedUsers, currentUser: updatedCurrentUser };
    }
    case 'REQUEST_PAYMENT':
        return { ...state, payments: [...state.payments, action.payload] };
    case 'APPROVE_PAYMENT': {
        let paymentToApprove: PaymentRequest | undefined;
        const updatedPayments = state.payments.map(p => {
            if (p.id === action.payload.paymentId) {
                // Fix: Use 'as const' to prevent TypeScript from widening the type of 'status' to string.
                paymentToApprove = {...p, status: 'approved' as const};
                return paymentToApprove;
            }
            return p;
        });
        if (!paymentToApprove) return state;
        
        const pkg = state.settings.creditPackages.find(p => p.id === paymentToApprove!.packageId);
        if (!pkg) return state;

        const updatedUsers = state.users.map(u => u.id === paymentToApprove!.userId ? {...u, credits: u.credits + pkg.credits} : u);
        
        return {...state, payments: updatedPayments, users: updatedUsers };
    }
    case 'REJECT_PAYMENT': {
        // Fix: Use 'as const' to prevent TypeScript from widening the type of 'status' to string.
        const updatedPayments = state.payments.map(p => p.id === action.payload.paymentId ? {...p, status: 'rejected' as const} : p);
        return { ...state, payments: updatedPayments };
    }
    case 'UPDATE_USER_CREDITS': {
        const updatedUsers = state.users.map(u => u.id === action.payload.userId ? {...u, credits: action.payload.credits} : u);
        const updatedCurrentUser = state.currentUser?.id === action.payload.userId ? {...state.currentUser, credits: action.payload.credits} : state.currentUser;
        return { ...state, users: updatedUsers, currentUser: updatedCurrentUser };
    }
    case 'TOGGLE_USER_BLOCK': {
        const updatedUsers = state.users.map(u => u.id === action.payload.userId ? {...u, isBlocked: !u.isBlocked} : u);
        return { ...state, users: updatedUsers };
    }
    case 'UPDATE_PAYMENT_SETTINGS':
        return { ...state, settings: { ...state.settings, paymentDetails: action.payload } };
    case 'SET_QR_CODE':
        return { ...state, settings: { ...state.settings, paymentDetails: { ...state.settings.paymentDetails, qrCodeUrl: action.payload } } };
    case 'ADD_CREDIT_PACKAGE':
        return { ...state, settings: { ...state.settings, creditPackages: [...state.settings.creditPackages, action.payload] }};
    case 'UPDATE_CREDIT_PACKAGE':
        return { ...state, settings: { ...state.settings, creditPackages: state.settings.creditPackages.map(p => p.id === action.payload.id ? action.payload : p) }};
    case 'DELETE_CREDIT_PACKAGE':
        return { ...state, settings: { ...state.settings, creditPackages: state.settings.creditPackages.filter(p => p.id !== action.payload.packageId) }};
    default:
      return state;
  }
};

const GlobalStateContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  setActivePage: (page: string) => void;
  deductCredits: (userId: string, amount: number) => void;
  requestPayment: (packageId: string, transactionId: string) => void;
  approvePayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string) => void;
  updateUserCredits: (userId: string, credits: number) => void;
  toggleUserBlock: (userId: string) => void;
  updatePaymentSettings: (details: PaymentDetails) => void;
  setQrCode: (url: string) => void;
  addCreditPackage: (pkg: Omit<CreditPackage, 'id'>) => void;
  updateCreditPackage: (pkg: CreditPackage) => void;
  deleteCreditPackage: (packageId: string) => void;

}>({
  state: initialState,
  dispatch: () => null,
  login: () => false,
  signup: () => false,
  logout: () => {},
  setActivePage: () => {},
  deductCredits: () => {},
  requestPayment: () => {},
  approvePayment: () => {},
  rejectPayment: () => {},
  updateUserCredits: () => {},
  toggleUserBlock: () => {},
  updatePaymentSettings: () => {},
  setQrCode: () => {},
  addCreditPackage: () => {},
  updateCreditPackage: () => {},
  deleteCreditPackage: () => {},
});

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(globalStateReducer, initialState);

  const login = (email: string, pass: string): boolean => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
        const adminUser: User = { id: 'admin-0', name: 'Admin', email: ADMIN_EMAIL, credits: Infinity, role: 'admin', isBlocked: false };
        dispatch({ type: 'LOGIN', payload: { user: adminUser } });
        toast.success("Admin login successful!");
        return true;
    }
    const user = state.users.find(u => u.email === email); // In a real app, you'd check a hashed password.
    if (user) {
        if(user.isBlocked) {
            toast.error("Your account is blocked. Please contact support.");
            return false;
        }
        dispatch({ type: 'LOGIN', payload: { user } });
        toast.success(`Welcome back, ${user.name}!`);
        return true;
    }
    toast.error("Invalid credentials.");
    return false;
  };

  const signup = (name: string, email: string, pass: string): boolean => {
      if(state.users.some(u => u.email === email)) {
          toast.error("An account with this email already exists.");
          return false;
      }
      const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          credits: 10, // 10 free starter credits
          role: 'user',
          isBlocked: false,
      };
      dispatch({ type: 'SIGNUP', payload: { newUser } });
      toast.success("Account created successfully! You have 10 free credits.");
      return true;
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success("You have been logged out.");
  }

  const setActivePage = (page: string) => dispatch({ type: 'SET_ACTIVE_PAGE', payload: page });

  const deductCredits = (userId: string, amount: number) => {
    if(state.currentUser?.role === 'admin') return;
    dispatch({ type: 'DEDUCT_CREDITS', payload: { userId, amount }});
  }
  
  const requestPayment = (packageId: string, transactionId: string) => {
    if (!state.currentUser) return;
    const pkg = state.settings.creditPackages.find(p => p.id === packageId);
    if (!pkg) {
        toast.error("Selected package not found.");
        return;
    }
    const newRequest: PaymentRequest = {
        id: `payment-${Date.now()}`,
        userId: state.currentUser.id,
        userEmail: state.currentUser.email,
        packageId,
        packageName: pkg.name,
        transactionId,
        status: 'pending',
        createdAt: new Date(),
    };
    dispatch({ type: 'REQUEST_PAYMENT', payload: newRequest });
    toast.success("Payment request submitted! Please wait for approval.");
  }

  const approvePayment = (paymentId: string) => {
    dispatch({ type: 'APPROVE_PAYMENT', payload: { paymentId } });
    toast.success("Payment approved and credits added.");
  }

  const rejectPayment = (paymentId: string) => {
    dispatch({ type: 'REJECT_PAYMENT', payload: { paymentId } });
    toast.error("Payment rejected.");
  }

  const updateUserCredits = (userId: string, credits: number) => {
    dispatch({ type: 'UPDATE_USER_CREDITS', payload: { userId, credits } });
    toast.success("User credits updated.");
  };

  const toggleUserBlock = (userId: string) => {
    dispatch({ type: 'TOGGLE_USER_BLOCK', payload: { userId } });
    const user = state.users.find(u => u.id === userId);
    if (user) {
      toast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'}.`);
    }
  };

  const updatePaymentSettings = (details: PaymentDetails) => {
    dispatch({ type: 'UPDATE_PAYMENT_SETTINGS', payload: details });
    toast.success("Payment settings updated.");
  }

  const setQrCode = (url: string) => {
    dispatch({ type: 'SET_QR_CODE', payload: url });
    toast.success("QR Code updated successfully.");
  }

  const addCreditPackage = (pkg: Omit<CreditPackage, 'id'>) => {
    const newPackage: CreditPackage = { ...pkg, id: `pkg-${Date.now()}` };
    dispatch({ type: 'ADD_CREDIT_PACKAGE', payload: newPackage });
    toast.success("Credit package added.");
  }

  const updateCreditPackage = (pkg: CreditPackage) => {
    dispatch({ type: 'UPDATE_CREDIT_PACKAGE', payload: pkg });
    toast.success("Credit package updated.");
  }
  
  const deleteCreditPackage = (packageId: string) => {
    dispatch({ type: 'DELETE_CREDIT_PACKAGE', payload: { packageId } });
    toast.success("Credit package deleted.");
  }

  return (
    <GlobalStateContext.Provider value={{ 
        state, dispatch, login, signup, logout, setActivePage, deductCredits, 
        requestPayment, approvePayment, rejectPayment, updateUserCredits,
        toggleUserBlock, updatePaymentSettings, setQrCode,
        addCreditPackage, updateCreditPackage, deleteCreditPackage
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);