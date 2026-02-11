import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { client } from "../client.js";

export function registerCategoryTools(server: McpServer) {
  server.tool(
    "get_all_categories",
    "Get all categories, optionally nested or flattened",
    {
      format: z.enum(["nested", "flattened"]).optional().describe("Response format"),
      is_group: z.boolean().optional().describe("Filter to only category groups"),
    },
    async ({ format, is_group }) => {
      const categories = await client.categories.getAll({ format, is_group });
      return { content: [{ type: "text", text: JSON.stringify(categories, null, 2) }] };
    },
  );

  server.tool(
    "get_category",
    "Get a single category by ID",
    { id: z.number().describe("Category ID") },
    async ({ id }) => {
      const category = await client.categories.get(id);
      return { content: [{ type: "text", text: JSON.stringify(category, null, 2) }] };
    },
  );

  server.tool(
    "create_category",
    "Create a new category",
    {
      name: z.string().describe("Category name"),
      description: z.string().nullable().optional().describe("Category description"),
      is_income: z.boolean().optional().describe("Whether this is an income category"),
      exclude_from_budget: z.boolean().optional().describe("Exclude from budget"),
      exclude_from_totals: z.boolean().optional().describe("Exclude from totals"),
      is_group: z.boolean().optional().describe("Whether this is a category group"),
      group_id: z.number().nullable().optional().describe("Parent group ID"),
      archived: z.boolean().optional().describe("Whether the category is archived"),
      order: z.number().nullable().optional().describe("Display order"),
    },
    async (params) => {
      const category = await client.categories.create(params);
      return { content: [{ type: "text", text: JSON.stringify(category, null, 2) }] };
    },
  );

  server.tool(
    "update_category",
    "Update an existing category",
    {
      id: z.number().describe("Category ID to update"),
      name: z.string().optional().describe("Category name"),
      description: z.string().nullable().optional().describe("Category description"),
      is_income: z.boolean().optional().describe("Whether this is an income category"),
      exclude_from_budget: z.boolean().optional().describe("Exclude from budget"),
      exclude_from_totals: z.boolean().optional().describe("Exclude from totals"),
      archived: z.boolean().optional().describe("Whether the category is archived"),
      group_id: z.number().nullable().optional().describe("Parent group ID"),
      order: z.number().nullable().optional().describe("Display order"),
    },
    async ({ id, ...data }) => {
      const category = await client.categories.update(id, data);
      return { content: [{ type: "text", text: JSON.stringify(category, null, 2) }] };
    },
  );

  server.tool(
    "delete_category",
    "Delete a category by ID",
    {
      id: z.number().describe("Category ID to delete"),
      force: z.boolean().optional().describe("Force delete even if category has dependencies"),
    },
    async ({ id, force }) => {
      await client.categories.delete(id, { force });
      return { content: [{ type: "text", text: `Category ${id} deleted successfully.` }] };
    },
  );
}
