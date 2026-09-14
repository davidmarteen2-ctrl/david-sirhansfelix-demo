import * as React from "react";
import "./PartnerLogoMarquee.css";

function PartnerLogoGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="partners-mgroup" aria-hidden={ariaHidden ? "true" : undefined}>
      {/* cTrader — faithful wordmark */}
      <span className="olixer-plogo ct" title="cTrader">
        <span className="wm">
          <span className="c-red">c</span>TRADER
        </span>
      </span>

      {/* MetaTrader 4|5 — official mark */}
      <span className="olixer-plogo" title="MetaTrader 4|5">
        <img
          src="/assets/logos/metatrader-official.png"
          alt="MetaTrader"
          height={28}
          width={28}
          className="h-[28px] w-[28px] object-contain shrink-0"
          loading="eager"
        />
        <span className="wm" style={{ fontSize: "18px", fontWeight: 600 }}>
          MetaTrader
        </span>
        <span style={{ fontSize: "19px", fontWeight: 300, letterSpacing: ".05em" }}>
          4|5
        </span>
      </span>

      {/* TradingView — official brand mark */}
      <span className="olixer-plogo tv" title="TradingView">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          role="img"
          aria-label="TradingView"
          className="shrink-0"
        >
          <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z" />
        </svg>
        <span className="wm" style={{ fontSize: "19px" }}>
          TradingView
        </span>
      </span>

      {/* PrimeXM */}
      <span className="olixer-plogo" title="PrimeXM">
        <img
          src="/assets/logos/primexm-official.png"
          alt="PrimeXM"
          height={30}
          width={110}
          className="h-[30px] w-[110px] object-contain shrink-0"
          loading="eager"
        />
      </span>

      {/* Pepperstone */}
      <span className="olixer-plogo" title="Pepperstone">
        <img
          src="/assets/logos/pepperstone-official.svg"
          alt="Pepperstone"
          height={28}
          width={124}
          className="h-[28px] w-[124px] object-contain shrink-0"
          loading="eager"
        />
      </span>

      {/* Eightcap */}
      <span className="olixer-plogo" title="Eightcap">
        <img
          src="/assets/logos/eightcap-official.svg"
          alt="Eightcap"
          height={24}
          width={118}
          className="h-[24px] w-[118px] object-contain shrink-0"
          loading="eager"
        />
      </span>

      {/* OANDA */}
      <span className="olixer-plogo" title="OANDA">
        <img
          src="/assets/logos/oanda-official.svg"
          alt="OANDA"
          height={20}
          width={113}
          className="h-[20px] w-[113px] object-contain shrink-0"
          loading="eager"
        />
      </span>

      {/* FOREX.com */}
      <span className="olixer-plogo" title="FOREX.com">
        <img
          src="/assets/logos/forexcom-official.svg"
          alt="FOREX.com"
          height={24}
          width={156}
          className="h-[24px] w-[156px] object-contain shrink-0"
          loading="eager"
        />
      </span>
    </div>
  );
}

export function PartnerLogoMarquee() {
  return (
    <section className="partners-marquee-section">
      <div className="partners-marquee">
        <div className="partners-marquee-track">
          <PartnerLogoGroup />
          <PartnerLogoGroup ariaHidden />
          <PartnerLogoGroup ariaHidden />
          <PartnerLogoGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}
