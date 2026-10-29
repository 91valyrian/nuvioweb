// A lead is accepted only after at least one durable delivery channel succeeded.
export function inquiryAccepted(savedInquiry, emailSent) {
  return Boolean(savedInquiry || emailSent);
}
