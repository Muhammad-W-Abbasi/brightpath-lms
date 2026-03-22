UPDATE users
SET password_hash = '$2a$10$ix5ZTZHKUn29KTB25TZJHuj99e7FshCWsWKguzqt/2IrUSF/BbMy2',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'instructor@brightpath.com';

UPDATE users
SET password_hash = '$2a$10$Ri8/HuncMYwAHHlOQC6XeOLWx87D4HwMpE5WCjPcSb1QY5YwJNrrG',
    updated_at = CURRENT_TIMESTAMP
WHERE email IN ('student1@brightpath.com', 'student2@brightpath.com');
