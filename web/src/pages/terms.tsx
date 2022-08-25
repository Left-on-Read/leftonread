import { useRouter } from 'next/router'

import { DefaultContentContainer } from '../components/DefaultContentContainer'
import { Footer } from '../components/Footer'
import { Markdown } from '../components/Markdown'
import { Navbar } from '../components/Navbar'

const TOS = `
---
---

## Left on Read Terms of Service

---
---

These terms and conditions outline the rules and regulations for the use of all of Left on Read 's marketing website: www.leftonread.me. 
By accessing this website we assume you accept these terms and conditions in full. Do not continue to use 
Left on Read 's website if you do not accept all of the terms and conditions stated on this page. 

The following terminology applies to these Terms and Conditions, Privacy Policy and any or all Agreements: “Client”, 
“You” and “Your” refers to you, the person accessing this website and accepting the Company’s terms and conditions. 
“The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to Left on Read . "Party”, “Parties”, or “Us", refers to 
both the Client and ourselves, or either the Client or ourselves. Any use of the above terminology or other words in 
the singular, plural, capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring 
to same.

---

### Cookies
We employ the use of cookies. By using Left on Read 's website you consent to the use of cookies in accordance with 
Left on Read’s privacy policy. Most of the modern day interactive web sites use cookies to enable us to retrieve user 
details for each visit. Cookies are used in some areas of our site to enable the functionality of this area and ease of 
use for those people visiting, and also used as part of use of Google Analytics.

---

### License
Unless otherwise stated, Left on Read and/or it’s licensors own the intellectual property rights for all material on 
Left on Read's website. All intellectual property rights are reserved. You may view and or print pages from leftonread.me for 
your own personal use subject to restrictions set in these terms and conditions.

You must not:
- Republish material from leftonread.me
- Sell, rent or sub-license material from leftonread.me
- Reproduce, duplicate or copy material from leftonread.me
- Redistribute content from Left on Read (unless content is specifically made for redistribution, such as sharing graphs).

### Hyperlinking to our Content
The following organizations may link to our Website without prior written approval: Government agencies, search engines, 
news organizations, and online directory distributors when they list us in the directory may link to our Website in the 
same manner as they hyperlink to the Websites of other listed businesses.

These organizations may link to our home page, to publications or to other Website information so long as the link: (a) 
is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its 
products or services; and (c) fits within the context of the linking party's site.

We will approve link requests from these organizations if we determine that: (a) the link would not reflect unfavorably; 
(b)the organization does not have an unsatisfactory record with us; (c) the benefit to us from the visibility associated 
with the hyperlink outweighs the absence of; and (d) where the link is in the context of general resource information or is 
otherwise consistent with editorial content in a newsletter or similar product furthering the mission of the organization.

These organizations may link to our landing page, to publications or to other Website information so long as the link: (a) 
is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and it 
products or services; and (c) fits within the context of the linking party's site.

Approved organizations may hyperlink to our Website as follows:
- By use of our name; or
- By use of the uniform resource locator (Web address) being linked to; or
- By use of any other description of our Website or material being linked to that makes sense within the context and format 
of content on the linking party's site.
No use of Left on Read’s logo or other artwork will be allowed for linking absent a trademark license agreement.

---

### iFrames
Without prior approval and express written permission, you may not create frames around our Web pages or use other techniques 
that alter in any way the visual presentation or appearance of our Website.

---

### Reservation of Rights
We reserve the right at any time and in its sole discretion to request that you remove all links or any particular link to our 
Website. You agree to immediately remove all links to our Website upon such request. We also reserve the right to amend these 
terms and conditions and its linking policy at any time. By continuing to link to our Website, you agree to be bound to and 
abide by these linking terms and conditions.

---

### Removal of links from our website
If you find any link on our website or any linked web site objectionable for any reason, you may contact us about this. 
We will consider requests to remove links but will have no obligation to do so or to respond directly to you. Whilst we 
endeavour to ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do 
we commit to ensuring that the website remains available or that the material on the website is kept up to date.

---

### Content Liability
We shall have no responsibility or liability for any content appearing on your Website. You agree to indemnify and defend us 
against all claims arising out of or based upon your Website. No link(s) may appear on any page on your Website or within any 
context containing content or materials that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise 
violates, or advocates the infringement or other violation of, any third party rights.

---

### Disclaimer
To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill).

Nothing in this disclaimer will:
- limit or exclude our or your liability for death or personal injury resulting from negligence;
- limit or exclude our or your liability for fraud or fraudulent misrepresentation;
- limit any of our or your liabilities in any way that is not permitted under applicable law; or
- exclude any of our or your liabilities that may not be excluded under applicable law.

The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer or in relation to the subject matter of this disclaimer, including liabilities arising in contract, in tort (including negligence) and for breach of statutory duty. To the extent that the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.

---
---

If you have any queries regarding any of our terms, please contact us: help.leftonread@gmail.com
`

export default function TermsOfService() {
  const router = useRouter()

  return (
    <>
      <DefaultContentContainer>
        <Navbar
          onDownload={() => {
            router.push('/')
          }}
        />
        <Markdown raw={TOS} />
      </DefaultContentContainer>
      <Footer />
    </>
  )
}
