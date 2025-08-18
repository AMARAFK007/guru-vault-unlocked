import { useState, useCallback } from 'react';

interface PaymentState {
  isModalOpen: boolean;
  selectedMethod: 'gumroad' | 'cryptomus' | null;
  isProcessing: boolean;
}

interface UsePaymentReturn {
  isModalOpen: boolean;
  selectedMethod: 'gumroad' | 'cryptomus' | null;
  isProcessing: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  selectPaymentMethod: (method: 'gumroad' | 'cryptomus') => void;
  setProcessing: (processing: boolean) => void;
}

export function usePayment(): UsePaymentReturn {
  const [state, setState] = useState<PaymentState>({
    isModalOpen: false,
    selectedMethod: null,
    isProcessing: false,
  });

  const openPaymentModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      selectedMethod: null,
      isProcessing: false,
    }));
  }, []);

  const closePaymentModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      selectedMethod: null,
      isProcessing: false,
    }));
  }, []);

  const selectPaymentMethod = useCallback((method: 'gumroad' | 'cryptomus') => {
    setState(prev => ({
      ...prev,
      selectedMethod: method,
    }));
  }, []);

  const setProcessing = useCallback((processing: boolean) => {
    setState(prev => ({
      ...prev,
      isProcessing: processing,
    }));
  }, []);

  return {
    isModalOpen: state.isModalOpen,
    selectedMethod: state.selectedMethod,
    isProcessing: state.isProcessing,
    openPaymentModal,
    closePaymentModal,
    selectPaymentMethod,
    setProcessing,
  };
}
