import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

export function Segment() {
  const [client, setClient] = useState(false);

  const config = useMemo(() => {
    return ({ inEU, preferences, React: CMReact }) => {
      preferences.onPreferencesSaved((p) => {
        console.log("onPreferencesSaved");
        console.log(JSON.stringify(p));
      });

      return {
        bannerActionsBlock: (props) =>
          CMReact.createElement(
            "div",
            {},
            CMReact.createElement(
              "button",
              {
                type: "button",
                onclick: (e) => {
                  e.stopPropagation();
                  props.denyAll();
                },
              },
              "Reject"
            ),
            CMReact.createElement(
              "button",
              { type: "submit", onclick: () => props.acceptAll() },
              "Allow"
            )
          ),
        bannerContent: CMReact.createElement(
          "span",
          null,
          "By using this site, you agree to our",
          " ",
          CMReact.createElement("a", { href: "/about" }, "Cookie Policy"),
          "."
        ),
        bannerSubContent: "bannerSubContent",
        bannerHideCloseButton: true,
        cancelDialogTitle: "cancelDialogTitle",
        cancelDialogContent: "cancelDialogContent",
        container: "#segment-cookies",
        cookieName: "custom-tracking-preferences",
        defaultDestinationBehavior: "enable",
        implyConsentOnInteraction: false,
        initialPreferences: {
          functional: false,
          marketingAndAnalytics: false,
          advertising: false,
        },
        preferencesDialogContent: "preferencesDialogContent",
        preferencesDialogTitle: "preferencesDialogTitle",
        shouldRequireConsent: inEU,
        writeKey: window.segmentKey,
      };
    };
  }, []);

  useEffect(() => {
    window.consentManagerConfig = config;
    setClient(true);
  }, [config]);

  if (!client) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_SEGMENT_APIKEY) {
    return null;
  }

  return (
    <>
      <Script
        async
        defer
        src="https://unpkg.com/@segment/consent-manager@5.6.0/standalone/consent-manager.js"
      ></Script>
      <Script
        id="segment-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.segmentKey='${process.env.NEXT_PUBLIC_SEGMENT_APIKEY}';!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey=window.segmentKey;analytics.SNIPPET_VERSION="4.15.3";analytics.page();}}();`,
        }}
      ></Script>
      <div id="segment-cookies"></div>
    </>
  );
}
