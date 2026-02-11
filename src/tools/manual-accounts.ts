import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { client } from "../client.js";

export function registerManualAccountTools(server: McpServer) {
  server.tool(
    "get_all_manual_accounts",
    "Get all manually-tracked accounts",
    {},
    async () => {
      const accounts = await client.manualAccounts.getAll();
      return { content: [{ type: "text", text: JSON.stringify(accounts, null, 2) }] };
    },
  );

  server.tool(
    "get_manual_account",
    "Get a single manual account by ID",
    { id: z.number().describe("Manual account ID") },
    async ({ id }) => {
      const account = await client.manualAccounts.get(id);
      return { content: [{ type: "text", text: JSON.stringify(account, null, 2) }] };
    },
  );

  server.tool(
    "create_manual_account",
    "Create a new manually-tracked account",
    {
      name: z.string().describe("Account name"),
      type: z.string().describe("Account type (e.g. 'checking', 'savings', 'credit', 'investment', 'property', 'vehicle', 'loan', 'other')"),
      balance: z.union([z.number(), z.string()]).describe("Current balance"),
      institution_name: z.string().nullable().optional().describe("Financial institution name"),
      display_name: z.string().nullable().optional().describe("Display name"),
      subtype: z.string().optional().describe("Account subtype"),
      currency: z.string().optional().describe("Currency code (e.g. 'usd')"),
      balance_as_of: z.string().optional().describe("Date of balance (YYYY-MM-DD)"),
      status: z.enum(["active", "closed"]).optional().describe("Account status"),
      closed_on: z.string().nullable().optional().describe("Date account was closed"),
      external_id: z.string().nullable().optional().describe("External ID"),
      exclude_from_transactions: z.boolean().optional().describe("Exclude from transaction views"),
    },
    async (params) => {
      const account = await client.manualAccounts.create(params as any);
      return { content: [{ type: "text", text: JSON.stringify(account, null, 2) }] };
    },
  );

  server.tool(
    "update_manual_account",
    "Update an existing manual account",
    {
      id: z.number().describe("Manual account ID to update"),
      name: z.string().optional().describe("Account name"),
      type: z.string().optional().describe("Account type"),
      balance: z.union([z.number(), z.string()]).optional().describe("Current balance"),
      institution_name: z.string().nullable().optional().describe("Financial institution name"),
      display_name: z.string().nullable().optional().describe("Display name"),
      subtype: z.string().optional().describe("Account subtype"),
      currency: z.string().optional().describe("Currency code"),
      balance_as_of: z.string().optional().describe("Date of balance (YYYY-MM-DD)"),
      status: z.enum(["active", "closed"]).optional().describe("Account status"),
      closed_on: z.string().nullable().optional().describe("Date account was closed"),
      external_id: z.string().nullable().optional().describe("External ID"),
      exclude_from_transactions: z.boolean().optional().describe("Exclude from transaction views"),
    },
    async ({ id, ...data }) => {
      const account = await client.manualAccounts.update(id, data as any);
      return { content: [{ type: "text", text: JSON.stringify(account, null, 2) }] };
    },
  );

  server.tool(
    "delete_manual_account",
    "Delete a manual account by ID",
    { id: z.number().describe("Manual account ID to delete") },
    async ({ id }) => {
      await client.manualAccounts.delete(id);
      return { content: [{ type: "text", text: `Manual account ${id} deleted successfully.` }] };
    },
  );
}
