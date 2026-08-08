-- Up Migration

CREATE SEQUENCE user_emp_code_seq START WITH 1;

ALTER TABLE users 
ADD COLUMN emp_code VARCHAR(50) UNIQUE DEFAULT ('TSCS_' || LPAD(nextval('user_emp_code_seq')::text, 4, '0'));

-- Update any existing rows if emp_code is null
UPDATE users 
SET emp_code = 'TSCS_' || LPAD(nextval('user_emp_code_seq')::text, 4, '0') 
WHERE emp_code IS NULL;

-- Set NOT NULL constraint once existing rows are populated
ALTER TABLE users 
ALTER COLUMN emp_code SET NOT NULL;

-- Down Migration

ALTER TABLE users DROP COLUMN IF EXISTS emp_code;
DROP SEQUENCE IF EXISTS user_emp_code_seq;
