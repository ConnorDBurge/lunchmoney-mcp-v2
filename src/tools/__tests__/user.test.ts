import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "./mock-client.js";
import { createTestServer } from "./test-helpers.js";
import { registerUserTools } from "../user.js";

describe("user tools", () => {
  const { server, tools } = createTestServer();

  beforeEach(() => {
    mockClient.user.getMe.mockReset();
  });

  registerUserTools(server);

  it("registers get_me tool", () => {
    expect(tools.has("get_me")).toBe(true);
  });

  it("get_me returns user data", async () => {
    const mockUser = { id: 1, user_name: "testuser", email: "test@example.com" };
    mockClient.user.getMe.mockResolvedValue(mockUser);

    const result = await tools.get("get_me")!.handler({});
    expect(result.content[0].text).toBe(JSON.stringify(mockUser, null, 2));
    expect(mockClient.user.getMe).toHaveBeenCalledOnce();
  });
});
