const express = require('express');
const fleetController = require('./../controllers/fleetController'); 
const router = express.Router();

router
  .route('/')
  .get(fleetController.getAllVehicles) 
  .post(fleetController.createFleet)

router
  .route('/:id')
  .get(fleetController.getVehicleById)
  .patch(fleetController.updateVehicle)
  .delete(fleetController.deleteVehicle);

module.exports = router;