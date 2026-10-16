# Customer care pages

Routes: `/contact`, `/delivery`, `/returns`, `/privacy`, `/terms`. Footer links now lead to the relevant pages, with Privacy & terms opening Privacy and an adjacent navigation link to Terms.

Support uses the supplied number +234 814 538 2171. The enquiry form prepares an encoded WhatsApp message for the customer to review and send. No message is automatically sent and no contact-form backend is claimed. The privacy control clears only the current browser's bag and wishlist.

The owner requested general wording without supplying delivery fees, areas, dates, a return window, warranty durations, support hours, or a business address. Pages therefore explain how to confirm those details directly with MGE. They do not invent fixed fees, deadlines, coverage, or a physical location. The privacy notice describes the implemented browser storage, Google Fonts, and WhatsApp flow; it is not a claim of complete legal compliance or an audit of off-site business records.

Official references consulted for consumer-rights and privacy wording:
- https://fccpc.gov.ng/consumers/
- https://fccpc.gov.ng/wp-content/uploads/2022/07/FCCPA-2018.pdf
- https://ndpc.gov.ng/download/nigeria-data-protection-act-2023
- https://developers.google.com/fonts/faq/privacy

Verification: `node scripts/check-support-browser.mjs` checks all five pages at desktop/mobile widths, footer destinations, WhatsApp message encoding, telephone links, and clearing isolated test browser storage. Production build also passes.
