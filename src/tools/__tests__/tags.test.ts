import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "./mock-client.js";
import { createTestServer } from "./test-helpers.js";
import { registerTagTools } from "../tags.js";

describe("tag tools", () => {
  const { server, tools } = createTestServer();
  registerTagTools(server);

  beforeEach(() => {
    Object.values(mockClient.tags).forEach((fn) => fn.mockReset());
  });

  it("registers all 5 tag tools", () => {
    expect(tools.has("get_all_tags")).toBe(true);
    expect(tools.has("get_tag")).toBe(true);
    expect(tools.has("create_tag")).toBe(true);
    expect(tools.has("update_tag")).toBe(true);
    expect(tools.has("delete_tag")).toBe(true);
  });

  it("get_all_tags returns tags", async () => {
    const tags = [{ id: 1, name: "Travel" }];
    mockClient.tags.getAll.mockResolvedValue(tags);

    const result = await tools.get("get_all_tags")!.handler({});
    expect(JSON.parse(result.content[0].text)).toEqual(tags);
  });

  it("get_tag calls with id", async () => {
    const tag = { id: 2, name: "Food" };
    mockClient.tags.get.mockResolvedValue(tag);

    const result = await tools.get("get_tag")!.handler({ id: 2 });
    expect(JSON.parse(result.content[0].text)).toEqual(tag);
  });

  it("create_tag passes body", async () => {
    const created = { id: 10, name: "New Tag" };
    mockClient.tags.create.mockResolvedValue(created);

    await tools.get("create_tag")!.handler({ name: "New Tag", description: "test" });
    expect(mockClient.tags.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Tag", description: "test" }),
    );
  });

  it("update_tag separates id from body", async () => {
    const updated = { id: 2, name: "Updated" };
    mockClient.tags.update.mockResolvedValue(updated);

    await tools.get("update_tag")!.handler({ id: 2, name: "Updated" });
    expect(mockClient.tags.update).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ name: "Updated" }),
    );
  });

  it("delete_tag calls with id and force", async () => {
    mockClient.tags.delete.mockResolvedValue(undefined);

    const result = await tools.get("delete_tag")!.handler({ id: 2, force: true });
    expect(result.content[0].text).toContain("deleted successfully");
    expect(mockClient.tags.delete).toHaveBeenCalledWith(2, { force: true });
  });
});
