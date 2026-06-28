import {type IRouter, Router} from "express";

const healthRoutes: IRouter = Router();

healthRoutes.get("/health", (_req, res) => {
  res.json({ok: true as const, service: "unora-backend"});
});

export default healthRoutes;
