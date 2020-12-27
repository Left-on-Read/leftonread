import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { TableNames } from './definitions';
import { Table } from './Table';
import { normalizePhoneNumberStatement } from '../utils/initUtils/constants/normalization';

export const Columns = {
  CONTACT_NAME: 'contact_name',
  CONTACT_PHONE: 'contact_phone',
};

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
      replace(
        replace(
          replace(
            replace(
              replace(
                ZABCDPHONENUMBER.ZFULLNUMBER,
              "(", "")
            , ")",
          ""),
        "_", ""),
      "-", ""),
    " ", "")
    as ZFULLNUMBER
      FROM ZABCDRECORD
    LEFT JOIN ZABCDPHONENUMBER ON ZABCDPHONENUMBER.ZOWNER = ZABCDRECORD.Z_PK
      WHERE ZABCDPHONENUMBER.ZFULLNUMBER IS NOT NULL
    )
    SELECT
    -- NOTE: the COALESCE is important here because the || (concat operator)
    -- returns NULL if one of the columns is NULL
    TRIM(
      COALESCE(ZFIRSTNAME, " ") || " " || COALESCE(ZLASTNAME, " ")
    ) as ${Columns.CONTACT_NAME},
    ${normalizePhoneNumberStatement(`ZFULLNUMBER`)} AS ${Columns.CONTACT_PHONE}
    FROM CONTACTS_CLEAN_TABLE`;
    await sqlite3Wrapper.runP(this.db, q);
    return this.name;
  }
}
