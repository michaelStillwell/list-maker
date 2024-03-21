BEGIN;

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    hash TEXT NOT NULL,
	salt TEXT NOT NULL
);

INSERT OR IGNORE INTO users (username, hash, salt) VALUES 
    ('user1',
		'c79a98a4cd233ae458737f3ea87412fae87036405e5f550913332c8dbc2703c3',
		'b6e2362dccbf676d1decc120a5b4af5d'), 
    ('user2',
		'c79a98a4cd233ae458737f3ea87412fae87036405e5f550913332c8dbc2703c3',
		'b6e2362dccbf676d1decc120a5b4af5d'),
    ('user3',
		'c79a98a4cd233ae458737f3ea87412fae87036405e5f550913332c8dbc2703c3',
		'b6e2362dccbf676d1decc120a5b4af5d');


COMMIT;

BEGIN;

CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
	expires_at DATE NOT NULL
);

-- don't need to seed the session obvi

COMMIT;

BEGIN;

CREATE TABLE IF NOT EXISTS lists (
    list_id INTEGER PRIMARY KEY,
    title VARCHAR(255),
    user_id INTEGER NOT NULL REFERENCES users (user_id),

    CONSTRAINT unique_title_per_user UNIQUE (user_id, title),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- user1
INSERT OR IGNORE INTO lists (title, user_id) SELECT 'First List', user_id FROM users WHERE username = 'user1';
INSERT OR IGNORE INTO lists (title, user_id) SELECT 'Second List', user_id FROM users WHERE username = 'user1';
-- user2
INSERT OR IGNORE INTO lists (title, user_id) SELECT 'First List', user_id FROM users WHERE username = 'user2';
INSERT OR IGNORE INTO lists (title, user_id) SELECT 'Second List', user_id FROM users WHERE username = 'user2';
INSERT OR IGNORE INTO lists (title, user_id) SELECT 'Third List', user_id FROM users WHERE username = 'user2';
-- user3
INSERT OR IGNORE INTO lists (title, user_id) SELECT 'First List', user_id FROM users WHERE username = 'user3';

COMMIT;

BEGIN;

CREATE TABLE IF NOT EXISTS items (
    item_id INTEGER PRIMARY KEY,
    title VARCHAR(255),
    list_id INTEGER,
    user_id INTEGER,

    CONSTRAINT unique_title_per_user UNIQUE (user_id, title),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (list_id) REFERENCES lists(list_id) ON DELETE CASCADE
);

-- user1
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'First Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user1' AND lists.title = 'First List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Second Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user1' AND lists.title = 'First List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Third Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user1' AND lists.title = 'Second List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Fourth Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user1' AND lists.title = 'Second List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Fifth Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user1' AND lists.title = 'Second List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Sixth Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user1' AND lists.title = 'Second List';
-- user2
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'First Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user2' AND lists.title = 'First List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Second Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user2' AND lists.title = 'First List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Third Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user2' AND lists.title = 'Second List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Fourth Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user2' AND lists.title = 'Third List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Fifth Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user2' AND lists.title = 'Third List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Sixth Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user2' AND lists.title = 'Third List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Seventh Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user2' AND lists.title = 'Third List';
-- user3
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'First Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user3' AND lists.title = 'First List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Second Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user3' AND lists.title = 'First List';
INSERT OR IGNORE INTO items (title, list_id, user_id) SELECT 'Third Item', list_id, user_id FROM lists JOIN users USING (user_id) WHERE username = 'user3' AND lists.title = 'First List';

COMMIT;
