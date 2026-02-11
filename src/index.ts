#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerUserTools } from "./tools/user.js";
import { registerCategoryTools } from "./tools/categories.js";
import { registerTransactionTools } from "./tools/transactions.js";
import { registerManualAccountTools } from "./tools/manual-accounts.js";
import { registerPlaidAccountTools } from "./tools/plaid-accounts.js";
import { registerTagTools } from "./tools/tags.js";
import { registerRecurringItemTools } from "./tools/recurring-items.js";
import { registerSummaryTools } from "./tools/summary.js";

const server = new McpServer({
  name: "lunchmoney-mcp-v2",
  version: "1.0.0",
});

registerUserTools(server);
registerCategoryTools(server);
registerTransactionTools(server);
registerManualAccountTools(server);
registerPlaidAccountTools(server);
registerTagTools(server);
registerRecurringItemTools(server);
registerSummaryTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
