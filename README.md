# SACKO CONCEPT — Creative Studio

Premium, responsive French/English studio website for Hawa Sacko.

Portfolio, services, three package collections, made-to-order designer resources, LaunchVault, six client brief links and a fixed WhatsApp button.

## Publish

Repository: https://github.com/sackoconcept8-prog/sacko-concept-portfolio

Expected public URL after Pages is enabled: https://sackoconcept8-prog.github.io/sacko-concept-portfolio/

In repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. The workflow builds only the production files in `dist/`. All subsequent pushes to `main` publish automatically. No installation or paid dependency is required.

The previous deployment failed because Pages was not enabled. The GitHub connector available to the agent can write repository files but has no endpoint to activate Pages. Activation must be completed in GitHub settings before the public URL is considered live.

## Build

```sh
npm run build
```

Requires Node 20+. No external npm dependency or database.

## Links and payment configuration

Edit `site-config.js` to change the commercial links. Never place passwords, payment credentials or API secrets in these files.

The verified WhatsApp number is `15054642331`. PayPal invoices are requested from `sackoconcept8@gmail.com`; this email is not a checkout link.

Add official payment URLs to `SITE.payments` using the corresponding package IDs. The site then replaces “Request a PayPal invoice” with the real payment link. **Order always opens the client brief directly**, as requested by Hawa. Prices and deliverables live in `catalog.js`.

If supported by the payment provider, set the post-payment return URL to:

```text
https://sackoconcept8-prog.github.io/sacko-concept-portfolio/?brief=impact-profile
```

Replace `impact-profile` with the relevant package ID. The returned page displays a link to the correct brief. A return visit is never treated as verified payment. Final payment confirmation belongs to the provider and the studio.

Instagram and Facebook use the exact links provided by Hawa. TikTok and a general PayPal checkout link remain `null` until Hawa supplies or confirms their exact URLs. Empty social links are omitted; no unrelated profile or invented PayPal.me link is substituted.

## Client briefs

| Brief | Existing form |
| --- | --- |
| General / Impact | https://form.jotform.com/261604129484054 |
| Website | https://sackoconcept8-prog.github.io/sacko-brief-studio/brief.html |
| Logo | https://sackoconcept8-prog.github.io/sacko-brief-studio/logo-brief.html |
| Banner & profile | https://sackoconcept8-prog.github.io/sacko-brief-studio/banner-brief.html |
| Content | https://sackoconcept8-prog.github.io/sacko-brief-studio/content-brief.html |
| Intake system | https://sackoconcept8-prog.github.io/sacko-brief-studio/intake-system-brief.html |

The general Jotform currently asks for a Shopify order reference. Before-payment requests should be identified clearly as project requests rather than invented paid orders. The specialized briefs have their existing response destination; this website opens them but does not alter or certify their submission backend. QA opens and inspects the forms without sending test submissions.

## Content accuracy

Portfolio work is labelled as independent concepts and design studies, not paid-client testimonials. Graphic template kits are made to order, with deliverables and licence agreed before work starts. LaunchVault reflects the current official store listing: 400+ prompts, $57.

Public package values used: Impact $15/$45/$95, website $49/$89/$149, signature logo $250, product UI $477 and intake system $47. Delivery estimates and scope must be confirmed in the brief.

See `ASSETS.md` for original portfolio sources and font attribution.
