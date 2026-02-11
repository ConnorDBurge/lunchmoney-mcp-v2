import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "./mock-client.js";
import { createTestServer } from "./test-helpers.js";
import { registerRecurringItemTools } from "../recurring-items.js";

describe("recurring item tools", () => {
  const { server, tools } = createTestServer();
  registerRecurringItemTools(server);

  beforeEach(() => {
    Object.values(mockClient.recurringItems).forEach((fn) => fn.mockReset());
  });

  it("registers both recurring item tools", () => {
    expect(tools.has("get_all_recurring_items")).toBe(true);
    expect(tools.has("get_recurring_item")).toBe(true);
  });

  it("get_all_recurring_items passes params", async () => {
    const items = [{ id: 1, payee: "Netflix", amount: -15.99 }];
    mockClient.recurringItems.getAll.mockResolvedValue(items);

    const result = await tools.get("get_all_recurring_items")!.handler({
      start_date: "2024-01-01",
      end_date: "2024-12-31",
    });
    expect(JSON.parse(result.content[0].text)).toEqual(items);
    expect(mockClient.recurringItems.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ start_date: "2024-01-01" }),
    );
  });

  it("get_recurring_item calls with id", async () => {
    const item = { id: 5, payee: "Spotify" };
    mockClient.recurringItems.get.mockResolvedValue(item);

    const result = await tools.get("get_recurring_item")!.handler({ id: 5 });
    expect(JSON.parse(result.content[0].text)).toEqual(item);
  });
});
