import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { TableNames } from './definitions';
import { Table } from './Table';
import { normalizePhoneNumberStatement } from '../utils/initUtils/constants/normalization'

/*
 * NOTE: the chat.db lists the country code always.
 * The addressbook.db, however, does not always include the country code.
 * Therefore, we join on a normalized column that r
 * All phone numbers in the US/Canada are 10-digit...
 *  this assumption will not work as well for users in other countries
 */

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
      replace(replace(replace(replace(replace(ZABCDPHONENUMBER.ZFULLNUMBER, "(", ""), ")", ""), "_", ""), "-", ""), " ", "") as ZFULLNUMBER
    FROM ZABCDRECORD
    LEFT JOIN ZABCDPHONENUMBER ON ZABCDPHONENUMBER.ZOWNER = ZABCDRECORD.Z_PK
    WHERE ZABCDPHONENUMBER.ZFULLNUMBER IS NOT NULL
    )
    SELECT
    -- NOTE: the COALESCE is very important here because the || (concat operator)
    -- returns NULL if one of the columns is NULL
    TRIM(
      COALESCE(ZFIRSTNAME, " ") || " " || COALESCE(ZLASTNAME, " ")
    ) as contact_name,
    ${normalizePhoneNumberStatement(`ZFULLNUMBER`)} AS contact_phone
    FROM CONTACTS_CLEAN_TABLE`;
    await sqlite3Wrapper.runP(this.db, q);
    return this.name;
  }
}
