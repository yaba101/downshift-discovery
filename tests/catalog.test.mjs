import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

// Production deployment of the Downshift Product Discovery app.
// (Vercel deployment listed as the repo homepage.)
const APP_URL = "https://downshift-items.vercel.app";

describe("Downshift Product Discovery (production)", () => {
  it("loads the catalog and shows products by default", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: APP_URL });
    await testdriver.wait(4000);

    const catalogVisible = await testdriver.assert(
      "the Downshift product discovery page is loaded with a grid of product cards, a FILTER BY sidebar, a SORT control, and a total product count",
    );
    expect(catalogVisible).toBeTruthy();
  });

  it("filters the catalog when searching for 'linen'", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: APP_URL });
    await testdriver.wait(4000);

    // Type a query into the catalog search box in the left sidebar.
    const search = await testdriver.find(
      "the search catalog input field in the left sidebar under the SEARCH label",
    );
    await search.click();
    await testdriver.type("linen");
    await testdriver.wait(2500);

    // Scroll the results grid into view so product titles are on screen.
    await testdriver.scroll("down", { amount: 500 });
    await testdriver.wait(1500);

    // Search should narrow the catalog to linen products.
    const linenResults = await testdriver.assert(
      'the visible product cards are search results for "linen", and at least one product card title contains the word "Linen"',
    );
    expect(linenResults).toBeTruthy();
  });
});
