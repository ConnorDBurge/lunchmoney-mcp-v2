import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "./mock-client.js";
import { createTestServer } from "./test-helpers.js";
import { registerSummaryTools } from "../summary.js";

describe("summary tools", () => {
  const { server, tools } = createTestServer();
  registerSummaryTools(server);

  beforeEach(() => {
    mockClient.summary.get.mockReset();
  });

  it("registers get_budget_summary tool", () => {
    expect(tools.has("get_budget_summary")).toBe(true);
  });

  it("get_budget_summary passes required and optional params", async () => {
    const mockSummary = {
      totals: { income: 5000, expenses: -3000 },
      categories: [{ id: 1, name: "Food", amount: -500 }],
    };
    mockClient.summary.get.mockResolvedValue(mockSummary);

    const result = await tools.get("get_budget_summary")!.handler({
      start_date: "2024-01-01",
      end_date: "2024-01-31",
      include_totals: true,
    });
    expect(JSON.parse(result.content[0].text)).toEqual(mockSummary);
    expect(mockClient.summary.get).toHaveBeenCalledWith(
      expect.objectContaining({
        start_date: "2024-01-01",
        end_date: "2024-01-31",
        include_totals: true,
      }),
    );
  });
});
