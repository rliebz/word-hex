import { describe, expect, it } from "vitest";

import { render } from "@testing-library/react";

import App from "./App";

describe("App", () => {
	it("renders", () => {
		expect(() => render(<App />)).not.toThrow();
	});
});
