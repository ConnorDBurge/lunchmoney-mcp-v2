import { LunchMoneyClient } from "@lunch-money/lunch-money-js-v2";

const apiKey = process.env.LUNCHMONEY_API_TOKEN;

if (!apiKey) {
  console.error("LUNCHMONEY_API_TOKEN environment variable is required");
  process.exit(1);
}

export const client = new LunchMoneyClient({ apiKey });
