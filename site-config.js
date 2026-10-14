/** Commercial links only: no keys, secrets or payment credentials belong here. */
export const SITE = {
  name: 'SACKO CONCEPT',
  owner: 'Hawa Sacko',
  email: 'contact@sackoconcept.com',
  paypalEmail: 'sackoconcept8@gmail.com',
  whatsapp: '15054642331',
  forms: {
    general: 'https://form.jotform.com/261604129484054',
    website: 'https://sackoconcept8-prog.github.io/sacko-brief-studio/brief.html',
    logo: 'https://sackoconcept8-prog.github.io/sacko-brief-studio/logo-brief.html',
    banner: 'https://sackoconcept8-prog.github.io/sacko-brief-studio/banner-brief.html',
    content: 'https://sackoconcept8-prog.github.io/sacko-brief-studio/content-brief.html',
    intake: 'https://sackoconcept8-prog.github.io/sacko-brief-studio/intake-system-brief.html',
  },
  // Fill with the exact links supplied by Hawa. Empty values are never shown as links.
  social: [
    { name: 'Instagram', url: 'https://www.instagram.com/sacko.concept/', icon: 'instagram' },
    { name: 'Facebook', url: 'https://web.facebook.com/people/Sacko-Concept/61588648091859/', icon: 'facebook' },
    { name: 'Dribbble', url: 'https://dribbble.com/hawa-sacko', icon: 'dribbble' },
    { name: 'Contra', url: 'https://contra.com/hawa_sacko_ngexz4ut', icon: 'link' },
    { name: 'ComeUp', url: 'https://comeup.com/en/@sackoconcept', icon: 'link' },
    { name: 'Pinterest', url: 'https://www.pinterest.com/sackoconcept8/', icon: 'pinterest' },
    { name: 'X', url: 'https://x.com/sackoconcept', icon: 'x' },
    { name: 'GitHub', url: 'https://github.com/sackoconcept8-prog', icon: 'github' },
    { name: 'TikTok', url: null, icon: 'link' },
    { name: 'PayPal', url: null, icon: 'link' },
  ],
  store: 'https://vault.sackoconcept.com/',
  // Only official payment URLs. No made-up PayPal.me links or payment success claims.
  payments: {
    'impact-starter': 'https://www.paypal.com/ncp/payment/PLB-HL32LQES6W4Z', 'impact-profile': 'https://www.paypal.com/ncp/payment/PLB-FPKN3A2SR748', 'impact-business': 'https://www.paypal.com/ncp/payment/PLB-NNCAK4L48V9N',
    'website-starter': 'https://www.paypal.com/ncp/payment/PLB-HVKVQVAACXGM', 'website-premium': 'https://www.paypal.com/ncp/payment/PLB-NXEB74SG827V', 'website-pro': 'https://www.paypal.com/ncp/payment/PLB-TWLG9QFBEQF9',
    'brand-signature': 'https://www.paypal.com/ncp/payment/PLB-2WFJRVY2BF3R', 'ui-signature': 'https://www.paypal.com/ncp/payment/PLB-BH3CKG44P374', 'intake-system': 'https://www.paypal.com/ncp/payment/PLB-9R2GPWDQASSW',
  },
  // Return URLs that payment-link owners can configure in their payment dashboard.
  // Returning here is an invitation to fill a brief, not proof that payment succeeded.
  afterPaymentBase: 'https://www.sackoconcept.com/',
};
