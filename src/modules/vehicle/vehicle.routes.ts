import { Router } from "express";
import auth from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";

const router = Router();

router.post("/", auth("admin"), vehicleController.createVehicle);

router.get("/",  vehicleController.getVehicle);
router.get("/:id", auth("admin"),  vehicleController.getSingleVehicle);


router.put("/:id", auth("admin"), vehicleController.updateVehicle);

router.delete("/:id", auth("admin"), vehicleController.deleteVehicle);

export const vehicleRoutes = router;