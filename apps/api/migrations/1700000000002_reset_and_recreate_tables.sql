-- Up Migration

-- Step 1: Drop all existing tables and sequences cleanly
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP SEQUENCE IF EXISTS user_emp_code_seq CASCADE;
DROP TABLE IF EXISTS designations CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Step 2: Recreate roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Step 3: Recreate designations table
CREATE TABLE designations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Step 4: Recreate employee code sequence
CREATE SEQUENCE user_emp_code_seq START WITH 1;

-- Step 5: Recreate users table with emp_code and password
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  emp_code VARCHAR(50) UNIQUE NOT NULL DEFAULT ('TSCS_' || LPAD(nextval('user_emp_code_seq')::text, 4, '0')),
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  designation_id INT NOT NULL REFERENCES designations(id) ON DELETE CASCADE
);

-- Step 6: Recreate activities table
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Down Migration

DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP SEQUENCE IF EXISTS user_emp_code_seq CASCADE;
DROP TABLE IF EXISTS designations CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
