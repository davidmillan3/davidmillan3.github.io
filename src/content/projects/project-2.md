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

1. Cuantos empleados han pasado por más de un cargo en la compañía.

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
## Evidencia Script Ejercicio 2

2. Identifique todos los empleados que vivan o trabajen en europa y que tengan un salario entre 4.000 Y 6.000 USD
Columnas:
Nombre y apellidos una solo columna
País al que pertenece
Salario que tiene

```sql
SELECT
    INITCAP(E.FIRST_NAME || ' ' || E.LAST_NAME) AS "FULL NAME",
    (C.COUNTRY_NAME)                      AS "COUNTRY",
    E.SALARY                                   AS "SALARY"
FROM HR.EMPLOYEES E
    JOIN HR.DEPARTMENTS D ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
    JOIN HR.LOCATIONS L   ON D.LOCATION_ID = L.LOCATION_ID
    JOIN HR.COUNTRIES C   ON L.COUNTRY_ID = C.COUNTRY_ID
    JOIN HR.REGIONS R     ON C.REGION_ID = R.REGION_ID
WHERE R.REGION_NAME = 'Europe'
    AND E.SALARY BETWEEN 4000 AND 6000;
```
## Evidencia Script Ejercicio 3

3. Proyectar orden jerarquico de los cargos de los empleados, mostrar el nombre del empleado y sus jefes y extraer emails de los dos (Las primeras 3 letras, Luego rellenar 6 asteriscos a la izquierda)

```sql
SELECT 
    E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLOYEE_NAME,
    M.FIRST_NAME || ' ' || M.LAST_NAME AS MANAGER_NAME,
    SUBSTR(E.EMAIL, 1, 3) || '******' AS EMPLOYEE_EMAIL,
    SUBSTR(M.EMAIL, 1, 3) || '******' AS MANAGER_EMAIL
FROM HR.EMPLOYEES E
LEFT JOIN HR.EMPLOYEES M
ON E.MANAGER_ID = M.EMPLOYEE_ID
ORDER BY E.EMPLOYEE_ID;
```

## Evidencia Script Ejercicio 4

4. Creación e inserción de datos en Base de Datos "Andromeda"
