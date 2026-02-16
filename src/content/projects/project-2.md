---
title: 'PL/SQL Scripts'
description: Evidencias PL/SQL Scripts.
publishDate: 'Feb 15 2026'
seo:
  image:
    src: '../../assets/images/project-1.jpg'
    alt: Imagen PL/SQL Scripts
---

## Evidencia Script Ejercicio 1

Cuantos empleados han pasado por más de un cargo en la compañía.

```sql
SELECT E.EMPLOYEE_ID,
       E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
       COUNT(DISTINCT JH.JOB_ID) + 1 AS TOTAL_JOBS
FROM HR.EMPLOYEES E
LEFT JOIN HR.JOB_HISTORY JH
ON E.EMPLOYEE_ID = JH.EMPLOYEE_ID
GROUP BY E.EMPLOYEE_ID, E.FIRST_NAME, E.LAST_NAME
HAVING COUNT(DISTINCT JH.JOB_ID) + 1 > 1
ORDER BY TOTAL_JOBS DESC;
```
