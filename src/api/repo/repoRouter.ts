import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { RepoSchema } from "@/api/repo/repoModel";
import { repoController } from "./repoController";

export const repoRegistry = new OpenAPIRegistry();
export const repoRouter: Router = express.Router();

repoRegistry.register("Repo", RepoSchema);

repoRegistry.registerPath({
  method: "get",
  path: "/repos",
  tags: ["Repo"],
  responses: createApiResponse(z.array(RepoSchema), "Success"),
});

repoRouter.get("/", repoController.getRepos);
