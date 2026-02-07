import { useEffect, useRef } from "react";
import "./AdSlot.css";

const ADSENSE_SCRIPT_ID = "adsbygoogle-script";

type AdSlotProps = {
  id: string;
  placement: "footer" | "sidebar";
  children?: React.ReactNode;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ id, placement, children }: AdSlotProps) {
  const pushed = useRef(false);

  const client = (import.meta.env.VITE_ADSENSE_CLIENT as string)?.trim() || "";
  const slotFooter = (import.meta.env.VITE_ADSENSE_SLOT_FOOTER as string)?.trim() || "";
  const slotSidebar = (import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR as string)?.trim() || "";
  const slotId = placement === "footer" ? slotFooter : slotSidebar;

  const useAdSense = Boolean(client && slotId);

  useEffect(() => {
    if (!useAdSense || pushed.current) return;

    const runPush = () => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushed.current = true;
      } catch {
        // ignore
      }
    };

    // Script already in page (e.g. pasted in index.html as AdSense suggests)
    const hasAdSenseScript = document.getElementById(ADSENSE_SCRIPT_ID) ||
      Array.from(document.querySelectorAll('script[src*="adsbygoogle.js"]')).length > 0;
    if (hasAdSenseScript) {
      runPush();
      return;
    }

    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.crossOrigin = "anonymous";
    script.onload = runPush;
    document.head.appendChild(script);
  }, [client, useAdSense]);

  if (children) {
    return (
      <div
        className={`ad-slot ad-slot--${placement}`}
        data-slot={id}
        id={id}
        role="complementary"
        aria-label="Advertisement"
      >
        {children}
      </div>
    );
  }

  if (useAdSense) {
    return (
      <div
        className={`ad-slot ad-slot--${placement}`}
        data-slot={id}
        id={id}
        role="complementary"
        aria-label="Advertisement"
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format={placement === "footer" ? "auto" : "rectangle"}
          data-full-width-responsive={placement === "footer"}
        />
      </div>
    );
  }

  return (
    <div
      className={`ad-slot ad-slot--${placement}`}
      data-slot={id}
      id={id}
      role="complementary"
      aria-label="Advertisement"
    >
      <div className="ad-slot-placeholder">
        <span className="ad-slot-label">Ad</span>
      </div>
    </div>
  );
}
