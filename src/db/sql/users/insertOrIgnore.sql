INSERT INTO users(email)
VALUES (${email}) ON CONFLICT(email) DO NOTHING