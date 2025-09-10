const express = require('express');
const shipmentController = require('./../controllers/shipmentController');
const router = express.Router();

router
  .route('/')
  .get(shipmentController.getAllShipments)
  .post(shipmentController.createShipment);

router
  .route('/auto-assign')
  .post(shipmentController.createShipmentWithAutoAssignment);

router
  .route('/available-vehicles')
  .get(shipmentController.getAvailableVehicles);

router
  .route('/available-drivers')
  .get(shipmentController.getAvailableDrivers);

router
  .route('/:id')
  .patch(shipmentController.updateShipment)
  .delete(shipmentController.deleteShipment);

module.exports = router;