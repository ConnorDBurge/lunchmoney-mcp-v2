import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { client } from "../client.js";

export function registerPlaidAccountTools(server: McpServer) {
  server.tool(
    "get_all_plaid_accounts",
    "Get all Plaid-connected accounts",
    {},
    async () => {
      const accounts = await client.plaidAccounts.getAll();
      return { content: [{ type: "text", text: JSON.stringify(accounts, null, 2) }] };
    },
  );

  server.tool(
    "get_plaid_account",
    "Get a single Plaid account by ID",
    { id: z.number().describe("Plaid account ID") },
    async ({ id }) => {
      const account = await client.plaidAccounts.get(id);
      return { content: [{ type: "text", text: JSON.stringify(account, null, 2) }] };
    },
  );

  server.tool(
    "trigger_plaid_fetch",
    "Trigger a Plaid data sync to fetch latest transactions",
    {
      start_date: z.string().optional().describe("Start date for fetch (YYYY-MM-DD)"),
      end_date: z.string().optional().describe("End date for fetch (YYYY-MM-DD)"),
      id: z.number().optional().describe("Specific Plaid account ID to fetch"),
    },
    async (params) => {
      await client.plaidAccounts.triggerFetch(params);
      return { content: [{ type: "text", text: "Plaid fetch triggered successfully." }] };
    },
  );
}
