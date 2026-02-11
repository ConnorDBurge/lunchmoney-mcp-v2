import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { client } from "../client.js";

export function registerUserTools(server: McpServer) {
  server.tool("get_me", "Get current authenticated user information", {}, async () => {
    const user = await client.user.getMe();
    return { content: [{ type: "text", text: JSON.stringify(user, null, 2) }] };
  });
}
