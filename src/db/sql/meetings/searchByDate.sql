SELECT *
FROM meetings
WHERE starts_at > ${startsAt}
ORDER BY starts_at ASC,
  id ASC
LIMIT ${num}