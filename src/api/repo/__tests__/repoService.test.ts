import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { Repo } from "@/api/repo/repoModel";
import { RepoRepository } from "@/api/repo/repoRepository";
import { RepoService } from "@/api/repo/repoService";

vi.mock("@/api/repo/repoRepository");

describe("repoService", () => {
  let repoServiceInstance: RepoService;
  let repoRepositoryInstance: RepoRepository;

  const mockRepos: Repo[] = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      age: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      age: 21,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    repoRepositoryInstance = new RepoRepository();
    repoServiceInstance = new RepoService(repoRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all repos", async () => {
      // Arrange
      (repoRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockRepos);

      // Act
      const result = await repoServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Repos found");
      expect(result.responseObject).toEqual(mockRepos);
    });

    it("returns a not found error for no repos found", async () => {
      // Arrange
      (repoRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await repoServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No Repos found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (repoRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await repoServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while retrieving repos.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a repo for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mockRepo = mockRepos.find((repo) => repo.id === testId);
      (repoRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockRepo);

      // Act
      const result = await repoServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Repo found");
      expect(result.responseObject).toEqual(mockRepo);
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (repoRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await repoServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while finding repo.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = 1;
      (repoRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await repoServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("Repo not found");
      expect(result.responseObject).toBeNull();
    });
  });
});
