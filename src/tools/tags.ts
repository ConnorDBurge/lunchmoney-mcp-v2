import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { client } from "../client.js";

export function registerTagTools(server: McpServer) {
  server.tool("get_all_tags", "Get all tags", {}, async () => {
    const tags = await client.tags.getAll();
    return { content: [{ type: "text", text: JSON.stringify(tags, null, 2) }] };
  });

  server.tool(
    "get_tag",
    "Get a single tag by ID",
    { id: z.number().describe("Tag ID") },
    async ({ id }) => {
      const tag = await client.tags.get(id);
      return { content: [{ type: "text", text: JSON.stringify(tag, null, 2) }] };
    },
  );

  server.tool(
    "create_tag",
    "Create a new tag",
    {
      name: z.string().describe("Tag name"),
      description: z.string().optional().describe("Tag description"),
      text_color: z.string().nullable().optional().describe("Text color hex code"),
      background_color: z.string().nullable().optional().describe("Background color hex code"),
    },
    async (params) => {
      const tag = await client.tags.create(params);
      return { content: [{ type: "text", text: JSON.stringify(tag, null, 2) }] };
    },
  );

  server.tool(
    "update_tag",
    "Update an existing tag",
    {
      id: z.number().describe("Tag ID to update"),
      name: z.string().optional().describe("Tag name"),
      description: z.string().optional().describe("Tag description"),
      text_color: z.string().nullable().optional().describe("Text color hex code"),
      background_color: z.string().nullable().optional().describe("Background color hex code"),
      archived: z.boolean().optional().describe("Whether the tag is archived"),
    },
    async ({ id, ...data }) => {
      const tag = await client.tags.update(id, data);
      return { content: [{ type: "text", text: JSON.stringify(tag, null, 2) }] };
    },
  );

  server.tool(
    "delete_tag",
    "Delete a tag by ID",
    {
      id: z.number().describe("Tag ID to delete"),
      force: z.boolean().optional().describe("Force delete even if tag has dependencies"),
    },
    async ({ id, force }) => {
      await client.tags.delete(id, { force });
      return { content: [{ type: "text", text: `Tag ${id} deleted successfully.` }] };
    },
  );
}
