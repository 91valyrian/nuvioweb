// Keep queues available before the heavy vendor scripts are downloaded.
export function initializeAnalytics() {
  if (typeof window === "undefined" || window.__nuvioAnalyticsInitialized) return;
  window.__nuvioAnalyticsInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!window.fbq) {
    const queue = function () {
      if (queue.callMethod) queue.callMethod.apply(queue, arguments);
      else queue.queue.push(arguments);
    };
    queue.push = queue;
    queue.loaded = true;
    queue.version = "2.0";
    queue.queue = [];
    window.fbq = queue;
    window._fbq = queue;
  }
  window.gtag("js", new Date());
  window.gtag("config", "G-XS0LDTNCMH", { send_page_view: false });
  window.fbq("init", "1532252177885828");
  window.fbq("track", "PageView");
  window.dispatchEvent(new Event("nuvio:analytics-ready"));
}

export function trackLead(form) {
  if (typeof window === "undefined") return;
  initializeAnalytics();
  window.gtag("event", "generate_lead", { form_name: form });
  window.fbq("track", "Lead");
}
