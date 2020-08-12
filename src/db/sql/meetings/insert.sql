INSERT INTO meetings(title, starts_at, ends_at)
VALUES (${title}, ${startsAt}, ${endsAt})
RETURNING *