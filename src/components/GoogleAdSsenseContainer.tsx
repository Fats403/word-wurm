import React, { useEffect } from "react";

export function GoogleAdsenseContainer({ client, slot }: any) {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div style={{ textAlign: "end", overflow: "hidden" }}>
      <span>Advertisment</span>
      <ins
        className="adsbygoogle"
        style={{ display: "flex" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
