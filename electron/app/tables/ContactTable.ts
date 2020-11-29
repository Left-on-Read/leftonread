import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { TableNames } from './definitions';
import { Table } from './Table';

/*
 * NOTE: in the chat.db the format is +1619... in other words
 * chat.db lists the country code always.
 * The addressbook.db, however, does not always include the country code.
 * Therefore, we remove the + and the country code, and FILTER on the 10-digit length.
 * All phone numbers in the US/Canada are 10-digit...
 *  this assumption may not work as well for users in other countries
 */
const PHONE_NUMBER_LENGTH = '10';

export class ContactTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
    WITH CONTACTS_CLEAN_TABLE AS (
    SELECT
      ZABCDRECORD.Z_PK,
      ZABCDRECORD.ZFIRSTNAME,
      ZABCDRECORD.ZLASTNAME,
      -- TODO: I understand this is ugly... use regex.
      replace(replace(replace(replace(replace(replace(ZABCDPHONENUMBER.ZFULLNUMBER, "(", ""), ")", ""), "_", ""), "-", ""), " ", ""), "+", "") as ZFULLNUMBER
    FROM ZABCDRECORD
    LEFT JOIN ZABCDPHONENUMBER ON ZABCDPHONENUMBER.ZOWNER = ZABCDRECORD.Z_PK
    WHERE ZABCDPHONENUMBER.ZFULLNUMBER IS NOT NULL
    )
    SELECT
    ZFIRSTNAME || " " || ZLASTNAME  as contact_name,
    CASE WHEN LENGTH(ZFULLNUMBER) > ${PHONE_NUMBER_LENGTH}
      THEN SUBSTR(ZFULLNUMBER, -${PHONE_NUMBER_LENGTH}, ${PHONE_NUMBER_LENGTH})
      ELSE ZFULLNUMBER
    END AS contact_phone
    FROM CONTACTS_CLEAN_TABLE`;
    await sqlite3Wrapper.runP(this.db, q);
    return this.name;
  }
}
