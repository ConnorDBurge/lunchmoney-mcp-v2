import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "./mock-client.js";
import { createTestServer } from "./test-helpers.js";
import { registerCategoryTools } from "../categories.js";

describe("category tools", () => {
  const { server, tools } = createTestServer();
  registerCategoryTools(server);

  beforeEach(() => {
    Object.values(mockClient.categories).forEach((fn) => fn.mockReset());
  });

  it("registers all 5 category tools", () => {
    expect(tools.has("get_all_categories")).toBe(true);
    expect(tools.has("get_category")).toBe(true);
    expect(tools.has("create_category")).toBe(true);
    expect(tools.has("update_category")).toBe(true);
    expect(tools.has("delete_category")).toBe(true);
  });

  it("get_all_categories calls client with params", async () => {
    const mockCategories = [{ id: 1, name: "Food" }];
    mockClient.categories.getAll.mockResolvedValue(mockCategories);

    const result = await tools.get("get_all_categories")!.handler({ format: "nested" });
    expect(JSON.parse(result.content[0].text)).toEqual(mockCategories);
    expect(mockClient.categories.getAll).toHaveBeenCalledWith({
      format: "nested",
      is_group: undefined,
    });
  });

  it("get_category calls client with id", async () => {
    const mockCategory = { id: 42, name: "Transport" };
    mockClient.categories.get.mockResolvedValue(mockCategory);

    const result = await tools.get("get_category")!.handler({ id: 42 });
    expect(JSON.parse(result.content[0].text)).toEqual(mockCategory);
    expect(mockClient.categories.get).toHaveBeenCalledWith(42);
  });

  it("create_category calls client with body", async () => {
    const created = { id: 10, name: "Groceries" };
    mockClient.categories.create.mockResolvedValue(created);

    const result = await tools.get("create_category")!.handler({ name: "Groceries" });
    expect(JSON.parse(result.content[0].text)).toEqual(created);
    expect(mockClient.categories.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Groceries" }),
    );
  });

  it("update_category separates id from body", async () => {
    const updated = { id: 5, name: "Updated" };
    mockClient.categories.update.mockResolvedValue(updated);

    const result = await tools.get("update_category")!.handler({ id: 5, name: "Updated" });
    expect(JSON.parse(result.content[0].text)).toEqual(updated);
    expect(mockClient.categories.update).toHaveBeenCalledWith(
      5,
      expect.objectContaining({ name: "Updated" }),
    );
  });

  it("delete_category calls client with id and force", async () => {
    mockClient.categories.delete.mockResolvedValue(undefined);

    const result = await tools.get("delete_category")!.handler({ id: 3, force: true });
    expect(result.content[0].text).toContain("deleted successfully");
    expect(mockClient.categories.delete).toHaveBeenCalledWith(3, { force: true });
  });
});
