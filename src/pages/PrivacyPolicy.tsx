/** @jsx jsx */
import { jsx } from '@emotion/core'

import { DefaultContentContainer } from '../components/DefaultContentContainer'
import { Navbar } from '../components/Navbar'
import { Markdown } from '../components/Markdown'

const PP = `
## Left on Read Privacy Policy
As we inherently deal with sensitive information, text messages, your privacy is our #1 concern. This 
Privacy Policy describes how your personal information is collected, used, and shared when you visit 
leftonread.me (the “Site”).

## Personal Information We Collect
When you visit the Site, we automatically collect certain information about your device, including information 
about your web browser, IP address, time zone, as part of our use of Google Analytics, which we outline in detail below. 
Additionally, through Google Analytics, we collect what websites or search terms referred you to the Site, and 
information about how you interact with the Site. We refer to this automatically-collected information as “Device 
Information.”

The ways we use Google Analytics include:
- “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet 
service provider, referring/exit pages, and date/time stamps.
- “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.

## Data Retention
When you choose to upload your chat.db and optionally choose to upload your contacts file to our site, we query the 
chat.db file and parse the .vcf to create your unique dashboard page. We then encrypt the words of your text messages 
end-to-end using your provided encryption key, which we do not store. We do, however, retain other data required to 
render your dashboard. The data required to render your dashboard is extracted from the files you uploaded and includes 
the frequency of the words you sent, the length of each text, the dates you texted, the time you texted, the contact 
information of the people you texted (if uploaded). We store this data because we cannot render your dashboard without 
it. But again, we want to emphasize that the words that you texted and recieved are encrypted (provided you gave a key), 
and therefore unable to be read. Using regular expressions software, we redact potientially private information such as 
Social Security numbers and Credit Card information. If you choose to upload your contacts file, you have the option to 
choose which conversations you upload, in which case the unselected conversations are never stored and deleted with the 
file. We do not store images, as images are not included in the uploaded chat.db file. Ultimately, all this data is stored 
in a database and, even though it is encrypted, is subject to hack. By uploading your chat.db or your contacts file you 
recognize your data may be compromised. You will not and do not hold Left on Read accountable for any data compromised.

## Sharing Your Information
We use Google Analytics to help us understand how our users use the Site: you can read more about how Google uses your 
Personal Information here. You can also opt-out of Google Analytics here.

Additionally, you have the option to share your dashboard page and graphs through your unique link. Finally, we 
may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, 
search warrant or other lawful request for information we receive, or to otherwise protect our rights.

## Changes
We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other 
operational, legal or regulatory reasons.

## Contact Us
For more information about our privacy practices, if you have questions, or if you would like to make a complaint, 
please contact us.
`

export default function TermsOfService() {
  return (
    <DefaultContentContainer>
      <Navbar />
      <Markdown raw={PP} />
    </DefaultContentContainer>
  )
}
