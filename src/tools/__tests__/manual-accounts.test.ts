import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "./mock-client.js";
import { createTestServer } from "./test-helpers.js";
import { registerManualAccountTools } from "../manual-accounts.js";

describe("manual account tools", () => {
  const { server, tools } = createTestServer();
  registerManualAccountTools(server);

  beforeEach(() => {
    Object.values(mockClient.manualAccounts).forEach((fn) => fn.mockReset());
  });

  it("registers all 5 manual account tools", () => {
    expect(tools.has("get_all_manual_accounts")).toBe(true);
    expect(tools.has("get_manual_account")).toBe(true);
    expect(tools.has("create_manual_account")).toBe(true);
    expect(tools.has("update_manual_account")).toBe(true);
    expect(tools.has("delete_manual_account")).toBe(true);
  });

  it("get_all_manual_accounts returns accounts", async () => {
    const accounts = [{ id: 1, name: "Savings" }];
    mockClient.manualAccounts.getAll.mockResolvedValue(accounts);

    const result = await tools.get("get_all_manual_accounts")!.handler({});
    expect(JSON.parse(result.content[0].text)).toEqual(accounts);
  });

  it("get_manual_account calls with id", async () => {
    const account = { id: 5, name: "Checking" };
    mockClient.manualAccounts.get.mockResolvedValue(account);

    const result = await tools.get("get_manual_account")!.handler({ id: 5 });
    expect(JSON.parse(result.content[0].text)).toEqual(account);
  });

  it("create_manual_account passes body", async () => {
    const created = { id: 10, name: "New Account" };
    mockClient.manualAccounts.create.mockResolvedValue(created);

    await tools.get("create_manual_account")!.handler({
      name: "New Account",
      type: "checking",
      balance: 1000,
    });
    expect(mockClient.manualAccounts.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Account", type: "checking", balance: 1000 }),
    );
  });

  it("update_manual_account separates id from body", async () => {
    const updated = { id: 5, name: "Renamed" };
    mockClient.manualAccounts.update.mockResolvedValue(updated);

    await tools.get("update_manual_account")!.handler({ id: 5, name: "Renamed" });
    expect(mockClient.manualAccounts.update).toHaveBeenCalledWith(
      5,
      expect.objectContaining({ name: "Renamed" }),
    );
  });

  it("delete_manual_account calls with id", async () => {
    mockClient.manualAccounts.delete.mockResolvedValue(undefined);

    const result = await tools.get("delete_manual_account")!.handler({ id: 5 });
    expect(result.content[0].text).toContain("deleted successfully");
    expect(mockClient.manualAccounts.delete).toHaveBeenCalledWith(5);
  });
});
