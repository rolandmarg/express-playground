CREATE TABLE IF NOT EXISTS providers (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  provider_name VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  access_token VARCHAR(1024) NOT NULL,
  refresh_token VARCHAR(1024),
  photo VARCHAR(1024),
  display_name VARCHAR(255),
  full_name VARCHAR(255),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (email, provider_name)
)