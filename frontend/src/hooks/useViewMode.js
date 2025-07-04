import { useContext } from 'react';
import { ViewModeContext } from '../components/context/ViewModeContext';

export const useViewMode = () => useContext(ViewModeContext); 