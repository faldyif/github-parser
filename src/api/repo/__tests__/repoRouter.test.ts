import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Repo } from "@/api/repo/repoModel";
import { repos } from "@/api/repo/repoRepository";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Repo API Endpoints", () => {
  describe("GET /repos", () => {
    it("should return a list of repos", async () => {
      // Act
      const response = await request(app).get("/repos");
      const responseBody: ServiceResponse<Repo[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Repos found");
      expect(responseBody.responseObject.length).toEqual(repos.length);
      responseBody.responseObject.forEach((repo, index) => compareRepos(repos[index] as Repo, repo));
    });
  });

  describe("GET /repos/:id", () => {
    it("should return a repo for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const expectedRepo = repos.find((repo) => repo.id === testId) as Repo;

      // Act
      const response = await request(app).get(`/repos/${testId}`);
      const responseBody: ServiceResponse<Repo> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Repo found");
      if (!expectedRepo) throw new Error("Invalid test data: expectedRepo is undefined");
      compareRepos(expectedRepo, responseBody.responseObject);
    });

    it("should return a not found error for non-existent ID", async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app).get(`/repos/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Repo not found");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      // Act
      const invalidInput = "abc";
      const response = await request(app).get(`/repos/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid input");
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareRepos(mockRepo: Repo, responseRepo: Repo) {
  if (!mockRepo || !responseRepo) {
    throw new Error("Invalid test data: mockRepo or responseRepo is undefined");
  }

  expect(responseRepo.id).toEqual(mockRepo.id);
  expect(responseRepo.name).toEqual(mockRepo.name);
  expect(responseRepo.email).toEqual(mockRepo.email);
  expect(responseRepo.age).toEqual(mockRepo.age);
  expect(new Date(responseRepo.createdAt)).toEqual(mockRepo.createdAt);
  expect(new Date(responseRepo.updatedAt)).toEqual(mockRepo.updatedAt);
}
