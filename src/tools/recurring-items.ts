import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { client } from "../client.js";

export function registerRecurringItemTools(server: McpServer) {
  server.tool(
    "get_all_recurring_items",
    "Get all recurring items (expenses and income)",
    {
      start_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      end_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
      include_suggested: z.boolean().optional().describe("Include suggested recurring items"),
    },
    async (params) => {
      const items = await client.recurringItems.getAll(params);
      return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
    },
  );

  server.tool(
    "get_recurring_item",
    "Get a single recurring item by ID",
    { id: z.number().describe("Recurring item ID") },
    async ({ id }) => {
      const item = await client.recurringItems.get(id);
      return { content: [{ type: "text", text: JSON.stringify(item, null, 2) }] };
    },
  );
}
