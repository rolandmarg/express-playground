SELECT *
FROM meetings
ORDER BY starts_at ASC,
  id ASC
LIMIT ${num}