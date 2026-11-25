import { expect, it } from "vitest";
import { BRANCHES } from "@/lib/site-data";

it("includes the Waghodia Road branch with its directions link", () => {
  const branch = BRANCHES.find((item) => item.name === "Waghodia Road");

  expect(BRANCHES).toHaveLength(4);
  expect(branch?.area).toBe("Pariwar Char Rasta");
  expect(branch?.mapsUrl).toContain("Study+House+Library+Sharam+Complex+G+Tower+Waghodia+Road");
});
