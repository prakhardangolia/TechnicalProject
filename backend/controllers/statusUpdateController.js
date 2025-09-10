const { StatusUpdate, Order, Shipment, Customer, Supplier, Driver, Admin } = require('../models');

// Get all status updates
const getAllStatusUpdates = async (req, res) => {
    try {
        const statusUpdates = await StatusUpdate.findAll({
            include: [
                { model: Order },
                { model: Shipment },
                { model: Customer, as: 'Customer' },
                { model: Supplier, as: 'Supplier' },
                { model: Driver, as: 'Driver' },
                { model: Admin, as: 'Admin' },
                { model: Admin, as: 'Approver' }
            ],
            order: [['created_at', 'DESC']]
        });
        
        res.status(200).json({
            success: true,
            data: statusUpdates
        });
    } catch (error) {
        console.error('Error fetching status updates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch status updates',
            error: error.message
        });
    }
};

// Get status updates by order ID
const getStatusUpdatesByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const statusUpdates = await StatusUpdate.findAll({
            where: { order_id: orderId },
            include: [
                { model: Order },
                { model: Shipment },
                { model: Customer, as: 'Customer' },
                { model: Supplier, as: 'Supplier' },
                { model: Driver, as: 'Driver' },
                { model: Admin, as: 'Admin' },
                { model: Admin, as: 'Approver' }
            ],
            order: [['created_at', 'DESC']]
        });
        
        res.status(200).json({
            success: true,
            data: statusUpdates
        });
    } catch (error) {
        console.error('Error fetching status updates for order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch status updates for order',
            error: error.message
        });
    }
};

// Get status updates by shipment ID
const getStatusUpdatesByShipment = async (req, res) => {
    try {
        const { shipmentId } = req.params;
        
        const statusUpdates = await StatusUpdate.findAll({
            where: { shipment_id: shipmentId },
            include: [
                { model: Order },
                { model: Shipment },
                { model: Customer, as: 'Customer' },
                { model: Supplier, as: 'Supplier' },
                { model: Driver, as: 'Driver' },
                { model: Admin, as: 'Admin' },
                { model: Admin, as: 'Approver' }
            ],
            order: [['created_at', 'DESC']]
        });
        
        res.status(200).json({
            success: true,
            data: statusUpdates
        });
    } catch (error) {
        console.error('Error fetching status updates for shipment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch status updates for shipment',
            error: error.message
        });
    }
};

// Create a new status update
const createStatusUpdate = async (req, res) => {
    try {
        const {
            order_id,
            shipment_id,
            stakeholder_type,
            stakeholder_id,
            previous_status,
            new_status,
            update_reason,
            customer_notes,
            internal_notes,
            is_cancellation_request,
            cancellation_reason,
            requires_approval
        } = req.body;

        // Validate required fields
        if (!stakeholder_type || !stakeholder_id || !new_status) {
            return res.status(400).json({
                success: false,
                message: 'stakeholder_type, stakeholder_id, and new_status are required'
            });
        }

        // Validate stakeholder type
        const validStakeholderTypes = ['customer', 'supplier', 'driver', 'admin'];
        if (!validStakeholderTypes.includes(stakeholder_type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid stakeholder_type. Must be one of: customer, supplier, driver, admin'
            });
        }

        // Create the status update
        const statusUpdate = await StatusUpdate.create({
            order_id,
            shipment_id,
            stakeholder_type,
            stakeholder_id,
            previous_status,
            new_status,
            update_reason,
            customer_notes,
            internal_notes,
            is_cancellation_request: is_cancellation_request || false,
            cancellation_reason,
            requires_approval: requires_approval || false
        });

        // Update the related order or shipment status if no approval required
        if (!requires_approval) {
            if (order_id) {
                await Order.update(
                    { status: new_status },
                    { where: { id: order_id } }
                );
            }
            if (shipment_id) {
                await Shipment.update(
                    { status: new_status },
                    { where: { id: shipment_id } }
                );
            }
        }

        res.status(201).json({
            success: true,
            message: 'Status update created successfully',
            data: statusUpdate
        });
    } catch (error) {
        console.error('Error creating status update:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create status update',
            error: error.message
        });
    }
};

// Approve or reject a status update
const approveStatusUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_approved, admin_id } = req.body;

        if (typeof is_approved !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'is_approved must be a boolean value'
            });
        }

        const statusUpdate = await StatusUpdate.findByPk(id);
        if (!statusUpdate) {
            return res.status(404).json({
                success: false,
                message: 'Status update not found'
            });
        }

        if (!statusUpdate.requires_approval) {
            return res.status(400).json({
                success: false,
                message: 'This status update does not require approval'
            });
        }

        if (statusUpdate.is_approved !== null) {
            return res.status(400).json({
                success: false,
                message: 'This status update has already been processed'
            });
        }

        // Update the status update
        await statusUpdate.update({
            is_approved,
            approved_by: admin_id,
            approved_at: new Date()
        });

        // If approved, update the related order or shipment status
        if (is_approved) {
            if (statusUpdate.order_id) {
                await Order.update(
                    { status: statusUpdate.new_status },
                    { where: { id: statusUpdate.order_id } }
                );
            }
            if (statusUpdate.shipment_id) {
                await Shipment.update(
                    { status: statusUpdate.new_status },
                    { where: { id: statusUpdate.shipment_id } }
                );
            }
        }

        res.status(200).json({
            success: true,
            message: `Status update ${is_approved ? 'approved' : 'rejected'} successfully`,
            data: statusUpdate
        });
    } catch (error) {
        console.error('Error approving status update:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve status update',
            error: error.message
        });
    }
};

// Get pending approval status updates
const getPendingApprovals = async (req, res) => {
    try {
        const pendingUpdates = await StatusUpdate.findAll({
            where: {
                requires_approval: true,
                is_approved: null
            },
            include: [
                { model: Order },
                { model: Shipment },
                { model: Customer, as: 'Customer' },
                { model: Supplier, as: 'Supplier' },
                { model: Driver, as: 'Driver' },
                { model: Admin, as: 'Admin' }
            ],
            order: [['created_at', 'ASC']]
        });
        
        res.status(200).json({
            success: true,
            data: pendingUpdates
        });
    } catch (error) {
        console.error('Error fetching pending approvals:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending approvals',
            error: error.message
        });
    }
};

// Customer cancellation request
const requestCancellation = async (req, res) => {
    try {
        const {
            order_id,
            shipment_id,
            customer_id,
            cancellation_reason,
            customer_notes
        } = req.body;

        if (!customer_id || !cancellation_reason) {
            return res.status(400).json({
                success: false,
                message: 'customer_id and cancellation_reason are required'
            });
        }

        // Get current status
        let currentStatus = 'Unknown';
        if (order_id) {
            const order = await Order.findByPk(order_id);
            currentStatus = order ? order.status : 'Unknown';
        } else if (shipment_id) {
            const shipment = await Shipment.findByPk(shipment_id);
            currentStatus = shipment ? shipment.status : 'Unknown';
        }

        const statusUpdate = await StatusUpdate.create({
            order_id,
            shipment_id,
            stakeholder_type: 'customer',
            stakeholder_id: customer_id,
            previous_status: currentStatus,
            new_status: 'Cancellation Requested',
            update_reason: 'Customer requested cancellation',
            customer_notes,
            cancellation_reason,
            is_cancellation_request: true,
            requires_approval: true
        });

        res.status(201).json({
            success: true,
            message: 'Cancellation request submitted successfully',
            data: statusUpdate
        });
    } catch (error) {
        console.error('Error creating cancellation request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create cancellation request',
            error: error.message
        });
    }
};

module.exports = {
    getAllStatusUpdates,
    getStatusUpdatesByOrder,
    getStatusUpdatesByShipment,
    createStatusUpdate,
    approveStatusUpdate,
    getPendingApprovals,
    requestCancellation
};
