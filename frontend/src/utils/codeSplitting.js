/**
 * Utilidades para code splitting granular
 */

import React, { lazy, Suspense } from 'react';
import Loader from '../components/atoms/Loader/Loader';

/**
 * Componente de fallback personalizable
 * @param {Object} props - Props del componente
 * @param {string} props.text - Texto a mostrar
 * @param {string} props.size - Tamaño del loader
 * @param {string} props.className - Clases CSS adicionales
 */
const FallbackComponent = ({ 
  text = 'Cargando...', 
  size = 'medium',
  className = ''
}) => {
  return React.createElement('div', {
    className: `flex justify-center items-center p-4 ${className}`,
    children: React.createElement(Loader, { size, text })
  });
};

/**
 * Crea un componente lazy con fallback personalizado
 * @param {Function} importFunc - Función de importación
 * @param {Object} options - Opciones de configuración
 * @returns {React.Component} - Componente lazy
 */
export const createLazyComponent = (importFunc, options = {}) => {
  const {
    fallbackText = 'Cargando componente...',
    fallbackSize = 'medium',
    fallbackClassName = '',
    timeout = 5000
  } = options;

  const LazyComponent = lazy(() => {
    return Promise.race([
      importFunc(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout loading component')), timeout)
      )
    ]);
  });

  return (props) => {
    return React.createElement(Suspense, {
      fallback: React.createElement(FallbackComponent, {
        text: fallbackText,
        size: fallbackSize,
        className: fallbackClassName
      }),
      children: React.createElement(LazyComponent, props)
    });
  };
};

/**
 * Lazy loading de componentes de átomos
 */
export const lazyAtoms = {
  Button: createLazyComponent(() => import('../components/atoms/Button/Button')),
  Input: createLazyComponent(() => import('../components/atoms/Input/Input')),
  Alert: createLazyComponent(() => import('../components/atoms/Alert/Alert')),
  Spinner: createLazyComponent(() => import('../components/atoms/Spinner/Spinner')),
  Badge: createLazyComponent(() => import('../components/atoms/Badge/Badge')),
  Avatar: createLazyComponent(() => import('../components/atoms/Avatar/Avatar')),
  Icon: createLazyComponent(() => import('../components/atoms/Icon/Icon')),
  Tooltip: createLazyComponent(() => import('../components/atoms/Tooltip/Tooltip'))
};

/**
 * Lazy loading de componentes de moléculas
 */
export const lazyMolecules = {
  FormField: createLazyComponent(() => import('../components/molecules/FormField/FormField')),
  SearchBar: createLazyComponent(() => import('../components/molecules/SearchBar/SearchBar')),
  DoctorSelector: createLazyComponent(() => import('../components/molecules/DoctorSelector/DoctorSelector')),
  CalendarFilters: createLazyComponent(() => import('../components/molecules/CalendarFilters/CalendarFilters')),
  AppointmentListItem: createLazyComponent(() => import('../components/molecules/AppointmentListItem/AppointmentListItem')),
  UserInfo: createLazyComponent(() => import('../components/molecules/UserInfo/UserInfo')),
  StatusIndicator: createLazyComponent(() => import('../components/molecules/StatusIndicator/StatusIndicator')),
  QuickAction: createLazyComponent(() => import('../components/molecules/QuickAction/QuickAction')),
  MenuDropdown: createLazyComponent(() => import('../components/molecules/MenuDropdown/MenuDropdown')),
  ModalContainer: createLazyComponent(() => import('../components/molecules/ModalContainer/ModalContainer'))
};

/**
 * Lazy loading de componentes de organismos
 */
export const lazyOrganisms = {
  CalendarView: createLazyComponent(() => import('../components/organisms/CalendarView/CalendarView'), {
    fallbackText: 'Cargando calendario...',
    fallbackSize: 'large'
  }),
  LoginForm: createLazyComponent(() => import('../components/organisms/LoginForm/LoginForm')),
  PatientFormModal: createLazyComponent(() => import('../components/organisms/PatientFormModal/PatientFormModal')),
  QuickActionsBar: createLazyComponent(() => import('../components/organisms/QuickActionsBar/QuickActionsBar')),
  RecentUsersList: createLazyComponent(() => import('../components/organisms/RecentUsersList/RecentUsersList')),
  StatsGrid: createLazyComponent(() => import('../components/organisms/StatsGrid/StatsGrid')),
  UpcomingAppointmentsList: createLazyComponent(() => import('../components/organisms/UpcomingAppointmentsList/UpcomingAppointmentsList')),
  ActivityLogList: createLazyComponent(() => import('../components/organisms/ActivityLogList/ActivityLogList')),
  Sidebar: createLazyComponent(() => import('../components/organisms/Sidebar/Sidebar')),
  Header: createLazyComponent(() => import('../components/organisms/Header/Header'))
};

/**
 * Lazy loading de templates
 */
export const lazyTemplates = {
  DashboardLayout: createLazyComponent(() => import('../components/templates/DashboardLayout/DashboardLayout'), {
    fallbackText: 'Cargando layout...',
    fallbackSize: 'large'
  }),
  DesktopAppLayout: createLazyComponent(() => import('../components/templates/DesktopAppLayout/DesktopAppLayout'), {
    fallbackText: 'Cargando aplicación...',
    fallbackSize: 'large'
  })
};

/**
 * Lazy loading de páginas con preloading inteligente
 */
export const lazyPages = {
  // Páginas de autenticación
  Login: createLazyComponent(() => import('../components/pages/auth/Login'), {
    fallbackText: 'Cargando login...',
    fallbackSize: 'large'
  }),
  Register: createLazyComponent(() => import('../components/pages/auth/Register'), {
    fallbackText: 'Cargando registro...',
    fallbackSize: 'large'
  }),

  // Páginas de dashboard
  DashboardAdmin: createLazyComponent(() => import('../components/pages/dashboard/DashboardAdmin'), {
    fallbackText: 'Cargando dashboard...',
    fallbackSize: 'large'
  }),
  SecretaryDashboard: createLazyComponent(() => import('../components/pages/dashboard/SecretaryDashboard'), {
    fallbackText: 'Cargando dashboard...',
    fallbackSize: 'large'
  }),
  PaymentStats: createLazyComponent(() => import('../components/pages/dashboard/PaymentStats'), {
    fallbackText: 'Cargando estadísticas...',
    fallbackSize: 'large'
  }),

  // Páginas de pacientes
  PatientList: createLazyComponent(() => import('../components/pages/patients/PatientsList'), {
    fallbackText: 'Cargando lista de pacientes...',
    fallbackSize: 'large'
  }),
  PatientForm: createLazyComponent(() => import('../components/pages/patients/PatientForm'), {
    fallbackText: 'Cargando formulario...',
    fallbackSize: 'large'
  }),
  PatientView: createLazyComponent(() => import('../components/pages/patients/PatientView'), {
    fallbackText: 'Cargando paciente...',
    fallbackSize: 'large'
  }),

  // Otras páginas
  CalendarPage: createLazyComponent(() => import('../components/pages/calendar/CalendarPage'), {
    fallbackText: 'Cargando calendario...',
    fallbackSize: 'large'
  }),
  HealthInsurancesPage: createLazyComponent(() => import('../components/pages/healthinsurances/HealthInsurancesPage'), {
    fallbackText: 'Cargando obras sociales...',
    fallbackSize: 'large'
  }),
  DesktopAppPage: createLazyComponent(() => import('../components/pages/desktop/DesktopAppPage'), {
    fallbackText: 'Cargando aplicación...',
    fallbackSize: 'large'
  }),
  Settings: createLazyComponent(() => import('../components/pages/Settings'), {
    fallbackText: 'Cargando configuración...',
    fallbackSize: 'large'
  }),
  DevPage: createLazyComponent(() => import('../components/pages/dev/DevPage'), {
    fallbackText: 'Cargando página de desarrollo...',
    fallbackSize: 'large'
  })
};

/**
 * Preload de componentes para mejorar UX
 * @param {string} componentType - Tipo de componente ('atoms', 'molecules', 'organisms', 'templates', 'pages')
 * @param {string} componentName - Nombre del componente
 */
export const preloadComponent = (componentType, componentName) => {
  const componentMap = {
    atoms: lazyAtoms,
    molecules: lazyMolecules,
    organisms: lazyOrganisms,
    templates: lazyTemplates,
    pages: lazyPages
  };

  const component = componentMap[componentType]?.[componentName];
  if (component) {
    // Trigger preload
    component({});
  }
};

/**
 * Preload de rutas comunes
 */
export const preloadCommonRoutes = () => {
  // Preload dashboard después del login
  setTimeout(() => {
    preloadComponent('pages', 'DashboardAdmin');
    preloadComponent('pages', 'PatientList');
    preloadComponent('pages', 'CalendarPage');
  }, 1000);
};

/**
 * Preload de componentes críticos
 */
export const preloadCriticalComponents = () => {
  // Preload componentes que se usan en múltiples lugares
  preloadComponent('atoms', 'Button');
  preloadComponent('atoms', 'Input');
  preloadComponent('atoms', 'Alert');
  preloadComponent('molecules', 'FormField');
  preloadComponent('organisms', 'Header');
  preloadComponent('organisms', 'Sidebar');
}; 