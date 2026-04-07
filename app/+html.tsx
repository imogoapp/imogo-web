import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

export default function RootHtml({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --ios-statusbar-bg: #F5F5F5F5;
              }
              html, body {
                background-color: var(--ios-statusbar-bg);
              }
              body {
                padding-top: env(safe-area-inset-top);
                padding-top: constant(safe-area-inset-top);
              }
              @supports (padding-top: max(0px)) {
                body {
                  padding-top: env(safe-area-inset-top);
                }
              }
            `,
          }}
        />
        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d,t) {
                var BASE_URL="https://chat-imogo.juk.re";
                var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                g.src=BASE_URL+"/packs/js/sdk.js";
                g.async = true;
                s.parentNode.insertBefore(g,s);
                g.onload=function(){
                  window.chatwootSDK.run({
                    websiteToken: 'mwmMhBeUMdu1Kx3e1Kb63kZL',
                    baseUrl: BASE_URL
                  })
                }
              })(document,"script");
            `,
          }}
        />
      </body>
    </html>
  );
}
