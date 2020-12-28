/*
 * All phone numbers in the US/Canada are 10-digit.
 * This means that users not in US/Canada will
 * not have contact_names and instead be left to phone numbers.
 */
const PHONE_NUMBER_LENGTH = '10';
const COUNTRY_CODE_SYMBOL = '+';

/*
 * NOTE: the chat.db always lists the country code.
 * The addressbook.db, however, does not always include the country code.
 * Create a shared CASE WHEN statement to 'normalize' the two columns
 */
export function normalizePhoneNumberStatement(column: string): string {
  return `
 CASE
  WHEN LENGTH(replace(${column}, "${COUNTRY_CODE_SYMBOL}", "")) > ${PHONE_NUMBER_LENGTH}
    THEN SUBSTR(
      replace(
        ${column}, "${COUNTRY_CODE_SYMBOL}", ""
      ),
    -${PHONE_NUMBER_LENGTH},
    ${PHONE_NUMBER_LENGTH}
  )
 ELSE ${column}
 END`;
}
