import { Router } from "express";
import { validateBody } from "../Middleware/validateBody.js";
import { auctionSchema } from "../Validations/AuctionValidation.js";
import {
    createAuction,
    getAuctionById,
    getAllAuctions,
    updateAuction,
    deleteAuction,
    deleteManyAuctions,
    createManyAuctions,
    updateManyAuctions,
    getMyWins,
} from "../Controllers/AuctionControllers.js";
import { checkAuth } from "../Middleware/authMiddleware.js";
import { checkRole } from "../Middleware/checkRole.js";

const router = Router();

router.use(checkAuth);

router.get("/", checkRole(["admin", "user", "company"]), getAllAuctions);

router.use(checkRole("admin"));
router.post("/", validateBody(auctionSchema), createAuction);
router.post("/bulk", createManyAuctions);
router.put("/:id", validateBody(auctionSchema), updateAuction);
router.put("/bulk", updateManyAuctions);
router.get("/:id", getAuctionById);
router.delete("/:id", deleteAuction);
router.delete("/bulk", deleteManyAuctions);
router.get("/my-wins", checkAuth, getMyWins);

export default router;
