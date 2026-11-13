import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Timeline } from "./Timeline";

vi.mock("@/components/site/Brand", () => ({ logoIconUrl: "/logo.png" }));
vi.mock("@/lib/auth-helpers", () => ({ initials: () => "C" }));

describe("Timeline lifecycle", () => {
  it("does not treat the scrolling result as an effect cleanup", () => {
    const scroll = vi.fn(() => Promise.resolve());
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scroll,
    });
    const view = render(<Timeline messages={[]} clientName="Cliente" />);
    expect(() => view.rerender(<Timeline messages={[]} clientName="Cliente" typing />)).not.toThrow();
    expect(scroll).toHaveBeenCalledTimes(2);
    expect(() => view.unmount()).not.toThrow();
  });
});