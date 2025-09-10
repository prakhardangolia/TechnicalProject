const express = require('express');
const router = express.Router();
const {
    getAllStatusUpdates,
    getStatusUpdatesByOrder,
    getStatusUpdatesByShipment,
    createStatusUpdate,
    approveStatusUpdate,
    getPendingApprovals,
    requestCancellation
} = require('../controllers/statusUpdateController');

// Get all status updates
router.get('/', getAllStatusUpdates);

// Get status updates by order ID
router.get('/order/:orderId', getStatusUpdatesByOrder);

// Get status updates by shipment ID
router.get('/shipment/:shipmentId', getStatusUpdatesByShipment);

// Get pending approval status updates
router.get('/pending-approvals', getPendingApprovals);

// Create a new status update
router.post('/', createStatusUpdate);

// Approve or reject a status update
router.patch('/:id/approve', approveStatusUpdate);

// Customer cancellation request
router.post('/cancel', requestCancellation);

module.exports = router;
