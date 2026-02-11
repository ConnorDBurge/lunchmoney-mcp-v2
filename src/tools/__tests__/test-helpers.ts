import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { vi } from "vitest";

type ToolHandler = (...args: any[]) => Promise<any>;

export interface RegisteredTool {
  name: string;
  description: string;
  schema: Record<string, unknown>;
  handler: ToolHandler;
}

/**
 * Creates a test McpServer that captures tool registrations
 * so we can invoke handlers directly in tests.
 */
export function createTestServer() {
  const tools = new Map<string, RegisteredTool>();

  const server = {
    tool: vi.fn((...args: any[]) => {
      let name: string;
      let description: string;
      let schema: Record<string, unknown>;
      let handler: ToolHandler;

      if (args.length === 4) {
        [name, description, schema, handler] = args;
      } else {
        [name, description, handler] = args;
        schema = {};
      }

      tools.set(name, { name, description, schema, handler });
    }),
  } as unknown as McpServer;

  return { server, tools };
}
