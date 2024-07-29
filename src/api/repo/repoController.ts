import type { Request, RequestHandler, Response } from "express";

import { repoService } from "@/api/repo/repoService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class RepoController {
  public getRepos: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await repoService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };
}

export const repoController = new RepoController();
