import test from "node:test";
import assert from "node:assert/strict";
import { trackLead } from "../src/lib/analytics.js";

test("a lead is queued before external analytics libraries load", () => {
  const previous = globalThis.window;
  globalThis.window = new EventTarget();
  try {
    trackLead("contact");
    assert.equal(typeof window.gtag, "function");
    assert.equal(typeof window.fbq, "function");
    const ga = window.dataLayer.map(args => Array.from(args));
    assert(ga.some(args => args[0] === "event" && args[1] === "generate_lead" && args[2].form_name === "contact"));
    assert(window.fbq.queue.some(args => args[0] === "track" && args[1] === "Lead"));
    // Starting the queues for a second lead must not duplicate initialization/pageviews.
    trackLead("landing");
    assert.equal(window.dataLayer.map(args => Array.from(args)).filter(args => args[0] === "config").length, 1);
    assert.equal(window.fbq.queue.filter(args => args[0] === "init").length, 1);
    assert.equal(window.fbq.queue.filter(args => args[1] === "PageView").length, 1);
    assert(window.dataLayer.map(args => Array.from(args)).filter(args => args[1] === "generate_lead").every(args => Object.keys(args[2]).join() === "form_name"));
  } finally {
    globalThis.window = previous;
  }
});
