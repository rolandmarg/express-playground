SELECT *
FROM meetings
WHERE starts_at > ${startsAt}
  AND id > ${id}
ORDER BY starts_at ASC,
  id ASC
LIMIT ${num}