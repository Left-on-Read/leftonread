/*
 * All phone numbers in the US/Canada are 10-digit.
 * This means that users NOT in US/Canada will
 * not have contact_names and instead be left to phone numbers.
 *
 * See https://github.com/Left-on-Read/leftonread/issues/101
 */
export const PHONE_NUMBER_LENGTH = '10';
const COUNTRY_CODE_SYMBOL = '+';

/*
 * normalizePhoneNumberStatement — because the chat.db always lists the country code, but
 * the address book db does not always include the country code,
 * we a shared columns that is run on both dbs
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
