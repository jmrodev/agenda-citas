const debug = require('debug');

function debugReferences(...args) {
  if (process.env.DEBUG_REFERENCES === 'true') {
    console.log('[DEBUG REFERENCES]', ...args);
  }
}

module.exports = {
  debugApp: debug('backend:app'),
  debugPatients: debug('backend:patients'),
  debugAuth: debug('backend:auth'),
  debugCalendar: debug('backend:calendar'),
  debugDashboard: debug('backend:dashboard'),
  debugPayments: debug('backend:payments'),
  debugReferences,
}; 