CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  name text NOT NULL
);

INSERT INTO users (id, name) VALUES ('e687f45a-1bec-429a-bb51-caa5aa505b87', 'anonymous');

CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  created_by UUID not null REFERENCES users(id),
  name text NOT NULL
);

INSERT INTO boards (id, created_by, name) VALUES 
('60748e3f-9118-49f5-b650-9f98855cd0ba', 'e687f45a-1bec-429a-bb51-caa5aa505b87', 'default'),
('83d58b91-4029-405d-b34d-e1e35dacb0e3', 'e687f45a-1bec-429a-bb51-caa5aa505b87', 'work'),
('77a04ba3-2f1f-48ee-ae4c-fc398315d9ef', 'e687f45a-1bec-429a-bb51-caa5aa505b87', 'home'),
('5229e9af-28d2-41fc-803e-ee1d04ed2bf1', 'e687f45a-1bec-429a-bb51-caa5aa505b87', 'self');

CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT (now() at time zone 'utc'),
  created_by UUID REFERENCES users(id) NOT NULL,
  board_id UUID REFERENCES boards(id) NOT NULL,
  text text,
  completed boolean NOT NULL
);