import { StatusCodes } from "http-status-codes";

import type { Repo } from "@/api/repo/repoModel";
import { RepoRepository } from "@/api/repo/repoRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class RepoService {
  private repoRepository: RepoRepository;

  constructor(repository: RepoRepository = new RepoRepository()) {
    this.repoRepository = repository;
  }

  // Retrieves all repos from the database
  async findAll(): Promise<ServiceResponse<Repo[] | null>> {
    try {
      const repos = await this.repoRepository.findAllAsync();
      if (!repos || repos.length === 0) {
        return ServiceResponse.failure("No Repos found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Repo[]>("Repos found", repos);
    } catch (ex) {
      const errorMessage = `Error finding all repos: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving repos.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const repoService = new RepoService();
