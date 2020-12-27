const PHONE_NUMBER_LENGTH = '10';
const COUNTRY_CODE_SYMBOL = '+';

export function normalizePhoneNumberStatement(column: string):string {
 return `
 CASE
  WHEN LENGTH(replace(${column}, "${COUNTRY_CODE_SYMBOL}", "")) > ${PHONE_NUMBER_LENGTH}
    THEN SUBSTR(
      replace(
        ${column}, "${COUNTRY_CODE_SYMBOL}", ""
      )
    -${PHONE_NUMBER_LENGTH},
    ${PHONE_NUMBER_LENGTH}
  )
 ELSE ${column}
 END`
}
