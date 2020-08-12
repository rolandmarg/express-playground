SELECT *
FROM meetings
ORDER BY starts_at DESC,
  id DESC
LIMIT 1