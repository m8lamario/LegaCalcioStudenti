"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import { ScrollTrigger } from "@/lib/gsapClient";
import "lenis/dist/lenis.css";

const LENIS_OPTIONS: LenisOptions = {
  autoRaf: true,
  anchors: true,
  duration: 1,
  stopInertiaOnNavigate: true,
};

function LenisRuntime() {
  const lenis = useLenis();
  const pathname = usePathname();
  const isFirstRoute = useRef(true);

  useEffect(() => {
    if (!lenis) return;

    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const url = new URL(anchor.href, window.location.href);
      const samePage =
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname &&
        url.hash.length > 1;

      if (!samePage) return;

      event.preventDefault();
      window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      lenis.scrollTo(url.hash);
    };

    const onScroll = () => {
      ScrollTrigger.update();
    };

    document.addEventListener("click", onAnchorClick);
    lenis.on("scroll", onScroll);

    const syncMenuLock = () => {
      const locked = document.body.style.overflow === "hidden";
      if (locked) lenis.stop();
      else lenis.start();
    };
    const menuObserver = new MutationObserver(syncMenuLock);
    menuObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      menuObserver.disconnect();
      document.removeEventListener("click", onAnchorClick);
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    const hash = window.location.hash;
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      if (!hash) return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (hash) lenis.scrollTo(hash);
      else lenis.scrollTo(0, { immediate: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [lenis, pathname]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <LenisRuntime />
      {children}
    </ReactLenis>
  );
}
