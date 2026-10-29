export function trackLead(form) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "generate_lead", { form_name: form });
  window.fbq?.("track", "Lead");
}
