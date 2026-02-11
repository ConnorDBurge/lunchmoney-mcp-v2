import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { client } from "../client.js";

const insertTransactionSchema = z.object({
  date: z.string().describe("Transaction date (YYYY-MM-DD)"),
  payee: z.string().describe("Payee name"),
  amount: z.union([z.number(), z.string()]).describe("Transaction amount"),
  currency: z.string().optional().describe("Currency code (e.g. 'usd')"),
  notes: z.string().optional().describe("Transaction notes"),
  category_id: z.number().nullable().optional().describe("Category ID"),
  manual_account_id: z.number().nullable().optional().describe("Manual account ID"),
  plaid_account_id: z.number().nullable().optional().describe("Plaid account ID"),
  status: z
    .enum(["reviewed", "unreviewed"])
    .optional()
    .describe("Transaction status"),
  is_pending: z.boolean().optional().describe("Whether the transaction is pending"),
  external_id: z.string().nullable().optional().describe("External ID for deduplication"),
  tag_ids: z.array(z.number()).optional().describe("Array of tag IDs"),
  recurring_id: z.number().nullable().optional().describe("Recurring item ID"),
});

const updateTransactionSchema = z.object({
  date: z.string().optional().describe("Transaction date (YYYY-MM-DD)"),
  payee: z.string().optional().describe("Payee name"),
  amount: z.union([z.number(), z.string()]).optional().describe("Transaction amount"),
  currency: z.string().optional().describe("Currency code"),
  notes: z.string().nullable().optional().describe("Transaction notes"),
  category_id: z.number().nullable().optional().describe("Category ID"),
  status: z.enum(["reviewed", "unreviewed"]).optional().describe("Transaction status"),
  is_pending: z.boolean().optional().describe("Whether the transaction is pending"),
  external_id: z.string().nullable().optional().describe("External ID"),
  tag_ids: z.array(z.number()).optional().describe("Array of tag IDs"),
  recurring_id: z.number().nullable().optional().describe("Recurring item ID"),
});

const splitTransactionSchema = z.object({
  amount: z.union([z.number(), z.string()]).describe("Split amount"),
  date: z.string().optional().describe("Split date (YYYY-MM-DD)"),
  payee: z.string().optional().describe("Payee name"),
  category_id: z.number().nullable().optional().describe("Category ID"),
  notes: z.string().nullable().optional().describe("Notes"),
  tag_ids: z.array(z.number()).optional().describe("Array of tag IDs"),
});

export function registerTransactionTools(server: McpServer) {
  server.tool(
    "get_all_transactions",
    "Get all transactions with optional filters for date range, account, category, tags, status, and pagination",
    {
      start_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      end_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
      created_since: z.string().optional().describe("Filter by creation date (ISO 8601)"),
      updated_since: z.string().optional().describe("Filter by update date (ISO 8601)"),
      manual_account_id: z.number().optional().describe("Filter by manual account ID"),
      plaid_account_id: z.number().optional().describe("Filter by Plaid account ID"),
      recurring_id: z.number().optional().describe("Filter by recurring item ID"),
      category_id: z.number().optional().describe("Filter by category ID"),
      tag_id: z.number().optional().describe("Filter by tag ID"),
      is_group_parent: z.boolean().optional().describe("Filter to group parents only"),
      status: z
        .enum(["reviewed", "unreviewed", "delete_pending"])
        .optional()
        .describe("Filter by status"),
      is_pending: z.boolean().optional().describe("Filter by pending status"),
      include_pending: z.boolean().optional().describe("Include pending transactions"),
      include_split_parents: z.boolean().optional().describe("Include split parent transactions"),
      include_group_children: z.boolean().optional().describe("Include group child transactions"),
      include_children: z.boolean().optional().describe("Include child transactions"),
      include_files: z.boolean().optional().describe("Include file attachments"),
      limit: z.number().optional().describe("Max number of transactions to return"),
      offset: z.number().optional().describe("Offset for pagination"),
    },
    async (params) => {
      const result = await client.transactions.getAll(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_transaction",
    "Get a single transaction by ID",
    { id: z.number().describe("Transaction ID") },
    async ({ id }) => {
      const transaction = await client.transactions.get(id);
      return { content: [{ type: "text", text: JSON.stringify(transaction, null, 2) }] };
    },
  );

  server.tool(
    "create_transactions",
    "Create one or more transactions",
    {
      transactions: z.array(insertTransactionSchema).describe("Array of transactions to create"),
      apply_rules: z.boolean().optional().describe("Apply category rules to new transactions"),
      skip_duplicates: z.boolean().optional().describe("Skip duplicate transactions"),
      skip_balance_update: z.boolean().optional().describe("Skip balance update after insert"),
    },
    async (params) => {
      const result = await client.transactions.create(params as any);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "update_transaction",
    "Update a single transaction",
    {
      id: z.number().describe("Transaction ID to update"),
      ...updateTransactionSchema.shape,
    },
    async ({ id, ...data }) => {
      const transaction = await client.transactions.update(id, data as any);
      return { content: [{ type: "text", text: JSON.stringify(transaction, null, 2) }] };
    },
  );

  server.tool(
    "delete_transaction",
    "Delete a single transaction by ID",
    { id: z.number().describe("Transaction ID to delete") },
    async ({ id }) => {
      await client.transactions.delete(id);
      return { content: [{ type: "text", text: `Transaction ${id} deleted successfully.` }] };
    },
  );

  server.tool(
    "delete_transactions",
    "Bulk delete multiple transactions by IDs",
    { ids: z.array(z.number()).describe("Array of transaction IDs to delete") },
    async ({ ids }) => {
      await client.transactions.deleteMany({ ids });
      return {
        content: [{ type: "text", text: `${ids.length} transaction(s) deleted successfully.` }],
      };
    },
  );

  server.tool(
    "update_transactions",
    "Bulk update multiple transactions",
    {
      transactions: z
        .array(updateTransactionSchema.extend({ id: z.number().describe("Transaction ID") }))
        .describe("Array of transactions to update, each must include an id"),
    },
    async (params) => {
      const result = await client.transactions.updateMany(params as any);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "split_transaction",
    "Split a transaction into multiple child transactions",
    {
      id: z.number().describe("Transaction ID to split"),
      child_transactions: z
        .array(splitTransactionSchema)
        .describe("Array of split child transactions"),
    },
    async ({ id, child_transactions }) => {
      const transaction = await client.transactions.split(id, { child_transactions } as any);
      return { content: [{ type: "text", text: JSON.stringify(transaction, null, 2) }] };
    },
  );

  server.tool(
    "unsplit_transaction",
    "Unsplit a previously split transaction",
    { id: z.number().describe("Transaction ID to unsplit") },
    async ({ id }) => {
      await client.transactions.unsplit(id);
      return { content: [{ type: "text", text: `Transaction ${id} unsplit successfully.` }] };
    },
  );

  server.tool(
    "group_transactions",
    "Group multiple transactions together",
    {
      ids: z.array(z.number()).describe("Array of transaction IDs to group"),
      date: z.string().describe("Group date (YYYY-MM-DD)"),
      payee: z.string().describe("Group payee name"),
      category_id: z.number().nullable().optional().describe("Category ID for the group"),
      notes: z.string().nullable().optional().describe("Notes for the group"),
      status: z.enum(["reviewed", "unreviewed"]).optional().describe("Group status"),
      tag_ids: z.array(z.number()).optional().describe("Array of tag IDs"),
    },
    async (params) => {
      const transaction = await client.transactions.group(params);
      return { content: [{ type: "text", text: JSON.stringify(transaction, null, 2) }] };
    },
  );

  server.tool(
    "ungroup_transaction",
    "Ungroup a previously grouped transaction",
    { id: z.number().describe("Group transaction ID to ungroup") },
    async ({ id }) => {
      await client.transactions.ungroup(id);
      return { content: [{ type: "text", text: `Transaction group ${id} ungrouped successfully.` }] };
    },
  );

  server.tool(
    "attach_file",
    "Attach a file to a transaction",
    {
      transaction_id: z.number().describe("Transaction ID to attach file to"),
      file: z.string().describe("File content (base64 encoded)"),
      notes: z.string().optional().describe("Notes about the attachment"),
    },
    async ({ transaction_id, ...data }) => {
      const attachment = await client.transactions.attachFile(transaction_id, data as any);
      return { content: [{ type: "text", text: JSON.stringify(attachment, null, 2) }] };
    },
  );

  server.tool(
    "get_attachment_url",
    "Get the URL for a transaction file attachment",
    { file_id: z.number().describe("File attachment ID") },
    async ({ file_id }) => {
      const result = await client.transactions.getAttachmentUrl(file_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "delete_attachment",
    "Delete a file attachment from a transaction",
    { file_id: z.number().describe("File attachment ID to delete") },
    async ({ file_id }) => {
      await client.transactions.deleteAttachment(file_id);
      return { content: [{ type: "text", text: `Attachment ${file_id} deleted successfully.` }] };
    },
  );
}
