/**
 * A minimalist reactive store factory (framework agnostic).
 * Encourages Selector-first access and immutable updates.
 */
export interface StoreApi<T> {
  getState: () => T;
  setState: (updater: (draft: T) => Partial<T> | T) => void;
  subscribe: (listener: (state: T) => void) => () => void;
}

export function createStore<T>(initialState: T): StoreApi<T> {
  let state = initialState;
  const listeners = new Set<(state: T) => void>();

  const getState = () => state;

  const setState = (updater: (draft: T) => Partial<T> | T) => {
    const nextPartial = updater(state);
    
    // Immutable merge (shallow)
    state = { ...state, ...nextPartial };
    
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener: (state: T) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
}

/**
 * A standard selector hook for React would look like:
 * export function useStore<T, U>(store: StoreApi<T>, selector: (state: T) => U): U { ... }
 * We omit the React dependency here to remain framework agnostic in the core layer, 
 * but the architecture natively supports it.
 */
