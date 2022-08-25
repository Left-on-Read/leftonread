import { useRouter } from 'next/router'

import { DefaultContentContainer } from '../components/DefaultContentContainer'
import { Footer } from '../components/Footer'
import { Markdown } from '../components/Markdown'
import { Navbar } from '../components/Navbar'

const PP = `

---
---

## Left on Read Privacy Policy

---
---

This Privacy Policy describes how your personal information is collected, used, and shared when you visit our marketing site,
leftonread.me (the “Site”). This Privacy Policy does not discuss our Desktop application.

----

### Personal Information We Collect
When you visit the Site, we automatically collect certain information about your device, including information 
about your web browser, IP address, time zone, as part of our use of Google Analytics, which we outline in detail below. 
Additionally, through Google Analytics, we collect what websites or search terms referred you to the Site, and 
information about how you interact with the Site. We refer to this automatically-collected information as “Device 
Information.”

The ways we use Google Analytics include:
- “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet 
service provider, referring/exit pages, and date/time stamps.
- “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.

---

### Sharing Your Information
We use Google Analytics to help us understand how our users use the Site: you can read more about how Google uses your 
Personal Information here. You can also opt-out of Google Analytics here.

Additionally, you have the option to share your dashboard page and graphs through your unique link. Finally, we 
may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, 
search warrant or other lawful request for information we receive, or to otherwise protect our rights.

---

### Changes
We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other 
operational, legal or regulatory reasons.

---

### Contact Us
For more information about our privacy practices, if you have questions, or if you would like to make a complaint, 
please contact us: help.leftonread@gmail.com
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
        <Markdown raw={PP} />
      </DefaultContentContainer>
      <Footer />
    </>
  )
}
