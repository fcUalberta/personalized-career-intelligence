import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import profileRouter from "./profile.js";
import targetRolesRouter from "./targetRoles.js";
import jobsRouter from "./jobs.js";
import skillAnalysisRouter from "./skillAnalysis.js";
import compDataRouter from "./compData.js";
import careerTrajectoryRouter from "./careerTrajectory.js";
import peerBenchmarkRouter from "./peerBenchmark.js";
import alertsRouter from "./alertsRoutes.js";
import dashboardRouter from "./dashboard.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(targetRolesRouter);
router.use(jobsRouter);
router.use(skillAnalysisRouter);
router.use(compDataRouter);
router.use(careerTrajectoryRouter);
router.use(peerBenchmarkRouter);
router.use(alertsRouter);
router.use(dashboardRouter);

export default router;
