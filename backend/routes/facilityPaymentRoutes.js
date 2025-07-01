// Actualizar pago de doctor
router.put('/:doctor_id/payments/:payment_id', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.updatePayment);
// Eliminar pago de doctor
router.delete('/:doctor_id/payments/:payment_id', authenticateToken, authorizeRoles('admin', 'secretary'), facilityPaymentController.removePayment); 