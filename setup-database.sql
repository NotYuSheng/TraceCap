-- Create TraceCap database and user
-- Run this as postgres superuser

-- Create database
CREATE DATABASE tracecap;

-- Create user
CREATE USER tracecap_user WITH PASSWORD 'tracecap_pass';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tracecap TO tracecap_user;

-- Connect to tracecap database and grant schema privileges
\c tracecap

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO tracecap_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tracecap_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tracecap_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tracecap_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO tracecap_user;
