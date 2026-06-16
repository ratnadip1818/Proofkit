export const GA_MEASUREMENT_ID = "G-6SBRC0DCYC";

// Declare global window properties for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Tracks a page view event to Google Analytics.
 * @param url The destination path (e.g. /dashboard)
 */
export function trackPageView(url: string): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

/**
 * A generic event tracker helper function for GA4 events.
 * Handles server-side safety checks automatically.
 * @param action The event name
 * @param params Additional event parameters (optional)
 */
export function trackEvent(action: string, params?: Record<string, any>): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics Event Dev] ${action}`, params);
    }
  }
}

/**
 * Tracks when a user starts the signup process.
 */
export function trackSignupStarted(): void {
  trackEvent("signup_started");
}

/**
 * Tracks when a user successfully completes the signup process.
 */
export function trackSignupCompleted(): void {
  trackEvent("signup_completed");
}

/**
 * Tracks when a user successfully creates/submits a testimonial.
 */
export function trackTestimonialCreated(): void {
  trackEvent("testimonial_created");
}

/**
 * Tracks when a user clicks on an upgrade button/link.
 */
export function trackUpgradeClicked(): void {
  trackEvent("upgrade_clicked");
}

/**
 * Tracks when a user completes a purchase (Paddle checkout success).
 * @param value The value of the transaction (optional)
 * @param currency The transaction currency (default: "USD")
 */
export function trackPurchaseCompleted(value?: number, currency: string = "USD"): void {
  trackEvent("purchase_completed", {
    value,
    currency,
  });
}
