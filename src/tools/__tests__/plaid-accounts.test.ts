import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "./mock-client.js";
import { createTestServer } from "./test-helpers.js";
import { registerPlaidAccountTools } from "../plaid-accounts.js";

describe("plaid account tools", () => {
  const { server, tools } = createTestServer();
  registerPlaidAccountTools(server);

  beforeEach(() => {
    Object.values(mockClient.plaidAccounts).forEach((fn) => fn.mockReset());
  });

  it("registers all 3 plaid account tools", () => {
    expect(tools.has("get_all_plaid_accounts")).toBe(true);
    expect(tools.has("get_plaid_account")).toBe(true);
    expect(tools.has("trigger_plaid_fetch")).toBe(true);
  });

  it("get_all_plaid_accounts returns accounts", async () => {
    const accounts = [{ id: 1, name: "Chase Checking" }];
    mockClient.plaidAccounts.getAll.mockResolvedValue(accounts);

    const result = await tools.get("get_all_plaid_accounts")!.handler({});
    expect(JSON.parse(result.content[0].text)).toEqual(accounts);
  });

  it("get_plaid_account calls with id", async () => {
    const account = { id: 3, name: "BofA Savings" };
    mockClient.plaidAccounts.get.mockResolvedValue(account);

    const result = await tools.get("get_plaid_account")!.handler({ id: 3 });
    expect(JSON.parse(result.content[0].text)).toEqual(account);
  });

  it("trigger_plaid_fetch calls client", async () => {
    mockClient.plaidAccounts.triggerFetch.mockResolvedValue(undefined);

    const result = await tools.get("trigger_plaid_fetch")!.handler({
      start_date: "2024-01-01",
    });
    expect(result.content[0].text).toContain("triggered successfully");
    expect(mockClient.plaidAccounts.triggerFetch).toHaveBeenCalledWith(
      expect.objectContaining({ start_date: "2024-01-01" }),
    );
  });
});
