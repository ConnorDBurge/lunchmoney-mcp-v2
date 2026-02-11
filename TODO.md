# lunchmoney-mcp-v2 — Implementation TODO

## Project Setup
- [ ] Project scaffolding (`package.json`, `tsconfig.json`, `.gitignore`, `.prettierrc`)
- [ ] Install dependencies (`@modelcontextprotocol/sdk`, `@lunch-money/lunch-money-js-v2`, `zod`)
- [ ] Install dev dependencies (`typescript`, `@types/node`)

## Core Setup
- [ ] `src/client.ts` — Shared LunchMoneyClient instance (reads API token from env)
- [ ] `src/index.ts` — MCP server entry point with stdio transport

## Tool Modules
- [ ] `src/tools/user.ts` — `get_me`
- [ ] `src/tools/categories.ts` — `get_all_categories`, `get_category`, `create_category`, `update_category`, `delete_category`
- [ ] `src/tools/transactions.ts` — `get_all_transactions`, `get_transaction`, `create_transactions`, `update_transaction`, `delete_transaction`, `delete_transactions`, `update_transactions`, `split_transaction`, `unsplit_transaction`, `group_transactions`, `ungroup_transaction`, `attach_file`, `get_attachment_url`, `delete_attachment`
- [ ] `src/tools/manual-accounts.ts` — `get_all_manual_accounts`, `get_manual_account`, `create_manual_account`, `update_manual_account`, `delete_manual_account`
- [ ] `src/tools/plaid-accounts.ts` — `get_all_plaid_accounts`, `get_plaid_account`, `trigger_plaid_fetch`
- [ ] `src/tools/tags.ts` — `get_all_tags`, `get_tag`, `create_tag`, `update_tag`, `delete_tag`
- [ ] `src/tools/recurring-items.ts` — `get_all_recurring_items`, `get_recurring_item`
- [ ] `src/tools/summary.ts` — `get_budget_summary`

## Build & Verify
- [ ] Compile with `tsc` — no errors
- [ ] Test basic server startup

## Finalize
- [ ] Write README with setup instructions
- [ ] Add LICENSE (MIT)
