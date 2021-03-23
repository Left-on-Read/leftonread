import * as sqlite3 from 'sqlite3';

// TODO
describe('db', () => {
  beforeEach(() => {
    const db = new sqlite3.Database(':memory:');
    db.run('CREATE TABLE messages (contact_name TEXT, handle_id TEXT)');
    db.run('CREATE TABLE handle (id TEXT)');
  });
});
