import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { client } from "../client.js";

export function registerSummaryTools(server: McpServer) {
  server.tool(
    "get_budget_summary",
    "Get budget summary for a date range with category breakdowns, totals, and optional rollover data",
    {
      start_date: z.string().describe("Start date (YYYY-MM-DD)"),
      end_date: z.string().describe("End date (YYYY-MM-DD)"),
      include_exclude_from_budgets: z
        .boolean()
        .optional()
        .describe("Include categories excluded from budgets"),
      include_occurrences: z.boolean().optional().describe("Include recurring occurrences"),
      include_past_budget_dates: z.boolean().optional().describe("Include past budget dates"),
      include_totals: z.boolean().optional().describe("Include totals"),
      include_rollover_pool: z.boolean().optional().describe("Include rollover pool data"),
    },
    async (params) => {
      const summary = await client.summary.get(params);
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    },
  );
}
