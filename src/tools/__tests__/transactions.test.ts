import { describe, it, expect, beforeEach } from "vitest";
import { mockClient } from "./mock-client.js";
import { createTestServer } from "./test-helpers.js";
import { registerTransactionTools } from "../transactions.js";

describe("transaction tools", () => {
  const { server, tools } = createTestServer();
  registerTransactionTools(server);

  beforeEach(() => {
    Object.values(mockClient.transactions).forEach((fn) => fn.mockReset());
  });

  const allToolNames = [
    "get_all_transactions",
    "get_transaction",
    "create_transactions",
    "update_transaction",
    "delete_transaction",
    "delete_transactions",
    "update_transactions",
    "split_transaction",
    "unsplit_transaction",
    "group_transactions",
    "ungroup_transaction",
    "attach_file",
    "get_attachment_url",
    "delete_attachment",
  ];

  it("registers all 14 transaction tools", () => {
    allToolNames.forEach((name) => {
      expect(tools.has(name), `Missing tool: ${name}`).toBe(true);
    });
  });

  it("get_all_transactions passes filters to client", async () => {
    const mockResult = { transactions: [{ id: 1 }], hasMore: false };
    mockClient.transactions.getAll.mockResolvedValue(mockResult);

    const result = await tools.get("get_all_transactions")!.handler({
      start_date: "2024-01-01",
      end_date: "2024-01-31",
      category_id: 5,
    });
    expect(JSON.parse(result.content[0].text)).toEqual(mockResult);
    expect(mockClient.transactions.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ start_date: "2024-01-01", category_id: 5 }),
    );
  });

  it("get_transaction calls client with id", async () => {
    const mockTx = { id: 99, payee: "Coffee Shop", amount: -5.0 };
    mockClient.transactions.get.mockResolvedValue(mockTx);

    const result = await tools.get("get_transaction")!.handler({ id: 99 });
    expect(JSON.parse(result.content[0].text)).toEqual(mockTx);
  });

  it("create_transactions passes transaction array", async () => {
    const mockResponse = { ids: [1, 2] };
    mockClient.transactions.create.mockResolvedValue(mockResponse);

    const params = {
      transactions: [
        { date: "2024-01-15", payee: "Store", amount: 25.0 },
        { date: "2024-01-16", payee: "Gas", amount: 40.0 },
      ],
      apply_rules: true,
    };
    const result = await tools.get("create_transactions")!.handler(params);
    expect(JSON.parse(result.content[0].text)).toEqual(mockResponse);
  });

  it("update_transaction separates id from data", async () => {
    const updated = { id: 10, payee: "Updated Payee" };
    mockClient.transactions.update.mockResolvedValue(updated);

    await tools.get("update_transaction")!.handler({ id: 10, payee: "Updated Payee" });
    expect(mockClient.transactions.update).toHaveBeenCalledWith(
      10,
      expect.objectContaining({ payee: "Updated Payee" }),
    );
  });

  it("delete_transaction calls client", async () => {
    mockClient.transactions.delete.mockResolvedValue(undefined);

    const result = await tools.get("delete_transaction")!.handler({ id: 7 });
    expect(result.content[0].text).toContain("deleted successfully");
    expect(mockClient.transactions.delete).toHaveBeenCalledWith(7);
  });

  it("delete_transactions bulk deletes", async () => {
    mockClient.transactions.deleteMany.mockResolvedValue(undefined);

    const result = await tools.get("delete_transactions")!.handler({ ids: [1, 2, 3] });
    expect(result.content[0].text).toContain("3 transaction(s) deleted");
    expect(mockClient.transactions.deleteMany).toHaveBeenCalledWith({ ids: [1, 2, 3] });
  });

  it("split_transaction calls client with child transactions", async () => {
    const splitResult = { id: 5, children: [{ id: 6 }, { id: 7 }] };
    mockClient.transactions.split.mockResolvedValue(splitResult);

    await tools.get("split_transaction")!.handler({
      id: 5,
      child_transactions: [{ amount: 10 }, { amount: 15 }],
    });
    expect(mockClient.transactions.split).toHaveBeenCalledWith(5, {
      child_transactions: [{ amount: 10 }, { amount: 15 }],
    });
  });

  it("unsplit_transaction calls client", async () => {
    mockClient.transactions.unsplit.mockResolvedValue(undefined);

    const result = await tools.get("unsplit_transaction")!.handler({ id: 5 });
    expect(result.content[0].text).toContain("unsplit successfully");
  });

  it("group_transactions passes all params", async () => {
    const grouped = { id: 100 };
    mockClient.transactions.group.mockResolvedValue(grouped);

    await tools.get("group_transactions")!.handler({
      ids: [1, 2],
      date: "2024-01-01",
      payee: "Grouped",
    });
    expect(mockClient.transactions.group).toHaveBeenCalledWith(
      expect.objectContaining({ ids: [1, 2], date: "2024-01-01", payee: "Grouped" }),
    );
  });

  it("ungroup_transaction calls client", async () => {
    mockClient.transactions.ungroup.mockResolvedValue(undefined);

    const result = await tools.get("ungroup_transaction")!.handler({ id: 100 });
    expect(result.content[0].text).toContain("ungrouped successfully");
  });

  it("get_attachment_url calls client with file_id", async () => {
    const mockUrl = { url: "https://example.com/file.pdf" };
    mockClient.transactions.getAttachmentUrl.mockResolvedValue(mockUrl);

    const result = await tools.get("get_attachment_url")!.handler({ file_id: 42 });
    expect(JSON.parse(result.content[0].text)).toEqual(mockUrl);
    expect(mockClient.transactions.getAttachmentUrl).toHaveBeenCalledWith(42);
  });

  it("delete_attachment calls client with file_id", async () => {
    mockClient.transactions.deleteAttachment.mockResolvedValue(undefined);

    const result = await tools.get("delete_attachment")!.handler({ file_id: 42 });
    expect(result.content[0].text).toContain("deleted successfully");
    expect(mockClient.transactions.deleteAttachment).toHaveBeenCalledWith(42);
  });
});
