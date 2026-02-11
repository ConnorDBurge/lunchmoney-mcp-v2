import { vi } from "vitest";

export const mockClient = {
  user: {
    getMe: vi.fn(),
  },
  categories: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  transactions: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    updateMany: vi.fn(),
    split: vi.fn(),
    unsplit: vi.fn(),
    group: vi.fn(),
    ungroup: vi.fn(),
    attachFile: vi.fn(),
    getAttachmentUrl: vi.fn(),
    deleteAttachment: vi.fn(),
  },
  manualAccounts: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  plaidAccounts: {
    getAll: vi.fn(),
    get: vi.fn(),
    triggerFetch: vi.fn(),
  },
  tags: {
    getAll: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  recurringItems: {
    getAll: vi.fn(),
    get: vi.fn(),
  },
  summary: {
    get: vi.fn(),
  },
};

vi.mock("../../client.js", () => ({
  client: mockClient,
}));
