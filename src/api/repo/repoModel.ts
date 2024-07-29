import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Repo = z.infer<typeof RepoSchema>;
export const RepoSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  git_url: z.string().url(),
  owner_login: z.string(),
  owner_url: z.string().url(),
});

// Input Validation for 'GET repos/:id' endpoint
export const GetRepoSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
