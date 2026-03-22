-- Legacy column retained for backward compatibility.
-- Authorization is role-based via USER_ROLES and no longer uses is_admin.
ALTER TABLE users
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
