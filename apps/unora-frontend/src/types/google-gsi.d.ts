/** Minimal typings for Google Identity Services (loaded from accounts.google.com/gsi/client). */
export {};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          disableAutoSelect: () => void;
          initialize: (config: {
            client_id: string;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            callback: (response: {credential?: string}) => void;
          }) => void;
          prompt: (
            momentListener?: (notification: {
              getDismissedReason: () => string;
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
            }) => void
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              locale?: string;
              logo_alignment?: "left" | "center";
              shape?: "rectangular" | "pill" | "circle" | "square";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              theme?: "outline" | "filled_blue" | "filled_black";
              type?: "standard" | "icon";
              width?: string | number;
            }
          ) => void;
        };
      };
    };
  }
}
