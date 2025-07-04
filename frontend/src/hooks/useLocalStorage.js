import { useState, useCallback, useEffect } from 'react';

/**
 * Hook personalizado para manejar localStorage con optimizaciones
 * @param {string} key - Clave en localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 * @returns {[any, function]} - [valor, función para actualizar]
 */
export const useLocalStorage = (key, initialValue) => {
  // Estado local para el valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar tanto el estado como localStorage
  const setValue = useCallback((value) => {
    try {
      // Permitir que value sea una función para tener la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Función para remover el valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sincronizar con cambios en localStorage desde otras pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook para manejar autenticación con localStorage optimizado
 */
export const useAuth = () => {
  const [token, setToken, removeToken] = useLocalStorage('token', null);
  const [user, setUser, removeUser] = useLocalStorage('user', null);
  const [role, setRole, removeRole] = useLocalStorage('role', null);

  const login = useCallback((authData) => {
    setToken(authData.token);
    setUser(authData.user);
    setRole(authData.user?.role);
  }, [setToken, setUser, setRole]);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    removeRole();
  }, [removeToken, removeUser, removeRole]);

  const isAuthenticated = useCallback(() => {
    return !!token;
  }, [token]);

  return {
    token,
    user,
    role,
    login,
    logout,
    isAuthenticated
  };
}; 