const debug = require('debug');
module.exports = {
  debugApp: debug('backend:app'),
  debugPatients: debug('backend:patients'),
  debugAuth: debug('backend:auth'),
  debugCalendar: debug('backend:calendar'),
  debugDashboard: debug('backend:dashboard'),
  debugPayments: debug('backend:payments'),
}; 