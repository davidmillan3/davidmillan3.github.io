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

2. Identifique todos los empleados que vivan o trabajen en europa y que tengan un salario entre 4.000 Y 6.000 USD.
Columnas:
Nombre y apellidos una solo columna.
País al que pertenece.
Salario que tiene.

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

3. Proyectar orden jerarquico de los cargos de los empleados, mostrar el nombre del empleado y sus jefes y extraer emails de los dos (Las primeras 3 letras, Luego rellenar 6 asteriscos a la izquierda).

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

4. Creación e inserción de datos en Base de Datos "Andromeda".

## Evidencia Clase 16 de Febrero

Se trabajó sobre fundamentos y estructuras básicas de **PL/SQL**, aprendiendo la creación de bloques anónimos, declaración de variables, uso de tipos de datos, consultas con `SELECT INTO`, manejo de `%TYPE` y `%ROWTYPE`, concatenación de textos y salida de información mediante `DBMS_OUTPUT.PUT_LINE`. Además, se estudiaron convenciones de nomenclatura, buenas prácticas de programación e introducción al lenguaje procedimental de Oracle Database.

```sql
--- SQL lenguaje estructurado de consultas propio de las bases de datos relacionales.
--- PL/SQL SI es un LENGUAJE DE PROGRAMACION --> Solo usarlo cuando se agoten las opciones SQL.
--- APP <---SENTENCIA SQL (Hablando de las relacionales)---> BASE DE DATOS.
--- SQL Developer -----String-----> Base De Datos. 
-----------------------------------------------------------------------------------------------------------------------------------
---PL SQL-> Lenguaje procedimental, Propiedad de ORACLE, unidades de programa: programas que nosotros vamos hacer.
---PL SQL-> No es sensible a masyusculas.
---PL SQL-> Unidades lexicas: grupo de caracteres (5): Delimitadores, Identificadores, Literales, Comentarios, Expresiones.
---PL SQL-> Delimitadores: Operadores aritmeticos, logicos y relacionales. EJM: Suma
---PL SQL-> Identificador: Constantes,Cursores, variables, subprograma, excepciones, paquetes. EJM: v_frame, c_percent
---PL SQL-> Literal: Valor de tipo numerico
---Comentarios: -- o /* varias lineas */
--- Tipos De Datos:
---Number: Almacena numeros enteros o de tipo flotante, virtualmente de cualquier longitud.
---Boolean: TRUE - FALSE
---Date: Fechas internamente como datos numericos.
--- DECLARE No es necesario en todos los casos
--- BEGIN Totalmente necesario
--- Punto y coma es buena practica y da mas organizacion y precision.

SET SERVEROUTPUT ON; ---> CADA VEZ QUE ENTRAMOS A LA BASE DE DATOS.

Declare 
fecha timestamp;
BEGIN 
SELECT sysdate INTO fecha FROM dual;
dbms_output.put_line('La fecha es: '||fecha);
END;
-------------------------------------------------------------------------
BEGIN
dbms_output.put_line('Hola mundo');
END;
/
--> Bloque anonimo porque no le hemos puesto nombre a ese programa.
------------------------------------------------------------------------
--- PREFIJO PARA LAS VARIABLES
--- vn_xxxxx ---> Forma correcta de crear una variable numerica.
--- vd_xxxx ---> Forma correcta de crear una variable de tipo Date.
--- vv_xxxx ---> Forma correcta de crear una variable de tipo Varchar.
--- vdo_xxx ----> Forma correcta de crear una variable de tipo double.
-------------------------------------------------------------------------
--- PREFIJO PARA LAS CONSTANTES
--- cn_xxx ---> Forma correcta de crear una variable numerica.
--- cd_xxx ---> Forma correcta de crear una variable de tipo Date.
--- cv_xxx ---> Forma correcta de crear una variable de tipo Varchar
--- cdo_xxx ----> Forma correcta de crear una variable de tipo double.
---------------------------------------------------------------------------
--- prefijo para los procedimientos almacenados.
--- sp_xxx
---------------------------------------------------------------------------
--- prefijo para los parametros
--- param_xxx
-----------------------------------------------------------------------------
DECLARE
    vv_miPrimeraVariable VARCHAR2(50);
BEGIN
    vv_miPrimeraVariable := 'Hola mundo';
dbms_output.put_line(vv_miPrimeraVariable);
END;
/
-----------------------------------------------------------------------------
DECLARE
    vv_miPrimeraVariable VARCHAR2(50) := 'Hola mundo';
BEGIN
dbms_output.put_line(vv_miPrimeraVariable);
END;
/
----------------------------------------------------------------------------
DECLARE
    vv_nombre   VARCHAR2(50);
    vv_apellido VARCHAR2(50);
BEGIN
    SELECT
        first_name,
        last_name
    INTO
        vv_nombre,
        vv_apellido  ---> insertar variables
    FROM
        hr.employees
    WHERE
        employee_id = 110;

    dbms_output.put_line('El nombre del empleado es: '
                         || vv_nombre
                         || ' '
                         || vv_apellido); --->Lo que va dentro de las comillas se llama LITERAL
END;
/
----------------------------------------------------------------------------------
DECLARE
    vv_nombre HR.EMPLOYEES.FIRST_NAME%TYPE;
    vv_apellido HR.EMPLOYEES.LAST_NAME%TYPE;
BEGIN
    SELECT
        first_name,
        last_name
    INTO
        vv_nombre,
        vv_apellido  ---> insertar variables
    FROM
        hr.employees
    WHERE
        employee_id = 110;

    dbms_output.put_line('El nombre del empleado es: '
                         || vv_nombre
                         || ' '
                         || vv_apellido); --->Lo que va dentro de las comillas se llama LITERAL
END;
/
----------------------------------------------------------------------------------
DECLARE
    vv_empleado HR.EMPLOYEES%ROWTYPE;
BEGIN
    SELECT
        *
    INTO
        vv_EMPLEADO
    FROM
        hr.employees
    WHERE
        employee_id = 110;

    dbms_output.put_line('El nombre del empleado es: '
                         || vv_empleado.FIRST_NAME
                         || ' '
                         || vv_empleado.LAST_NAME); --->Lo que va dentro de las comillas se llama LITERAL
END;
/
---------------------------------------------------------------------------------------
DECLARE
    vv_empleado HR.EMPLOYEES%ROWTYPE;
BEGIN

    SELECT
        *
    INTO
        vv_EMPLEADO
    FROM
        hr.employees
    WHERE
        employee_id = (110,108);---> ESTO ASI NO FUNKA 

    dbms_output.put_line('El nombre del empleado es: '
                         || vv_empleado.FIRST_NAME
                         || ' '
                         || vv_empleado.LAST_NAME); --->Lo que va dentro de las comillas se llama LITERAL
END;
/
---------------------------------------------------------------------------------------
--- TIPOS DE ATRIBUTOS IMPORTANTES
--- %TYPE: HEREDA EL TIPO DE DATO DE LA TABLA
--- &ROWTYPE: HEREDA TODOS LOS TIPOS DE DATOS DE LA TABLA
------------------------------------------------------------------------------------
--- Jamas olvidar diccionario de datos para ser organizado en todo tipo de trabajos
--- CONTROL + F7 HACE LA INDETACION
--- || ES PARA CONCATENAR
-----------------------------------------------------------------------------------
```

## Evidencia Clase 18 de Febrero

Se trabajó el uso de estructuras de control en **PL/SQL**, implementando condicionales `IF-ELSIF-ELSE`, etiquetas `GOTO` y diferentes tipos de bucles como `LOOP`, `WHILE` y `FOR`. Además, se desarrollaron ejercicios prácticos de lógica y programación, incluyendo validación de números primos, generación de la serie Fibonacci, cálculo del mínimo común múltiplo y operaciones matemáticas usando funciones integradas de Oracle Database.

```sql
--- Estructuras de control
--- En PL/SQL, Solo se tiene la estructura de control "if"

--- IF (expresion) THEN
        -- Instrucciones
---ELSIF (expresion) THEN
        -- Instrucciones
---ELSE
        --Instrucciones
---END IF;
---------------------------------------------------------------------------------------
--- GOTO ETIQUETAS.

---------------------------------------------------------------------------------------
---EJM:Calcule si el dia de hoy es primo o no, si es primo lance el mensaje "Es primo"

SET SERVEROUTPUT ON;
----------------------------------------------------------------------------------------
DECLARE
    vd_hoy INT;
BEGIN
    SELECT TO_NUMBER(TO_CHAR(SYSDATE, 'DD')) INTO vd_hoy FROM DUAL;
    IF vd_hoy = 2 THEN
        DBMS_OUTPUT.PUT_LINE(' ES PRIMO');
    ELSIF vd_hoy <= 1 OR MOD(vd_hoy, 2) = 0 THEN
        DBMS_OUTPUT.PUT_LINE(' NO ES PRIMO');
    ELSE
        DBMS_OUTPUT.PUT_LINE('HOLA PRIMO ');
    END IF;
END;
/
---------------------------------------------------------------------------------------------------------
DECLARE
    dia NUMBER := TO_NUMBER(TO_CHAR(SYSDATE,'DD'));
BEGIN
 
    IF dia IN (2,3,5,7,11,13,17,19,23,29,31) THEN
        GOTO primo;
    ELSE
        GOTO noprimo;
    END IF;
 
<<primo>>
    DBMS_OUTPUT.PUT_LINE('HOLA PRIMO');
    GOTO fin;
 
<<noprimo>>
    DBMS_OUTPUT.PUT_LINE('NO ES PRIMO');
 
<<fin>>
    NULL;
 
END;
/
---------------------------------------------------------------------------------------------------------
---IMPRIMIR LA SERIE FIBONACCI HASTA EL TOPE DE 100 CON EL LOOP.

DECLARE 
    vn_a NUMBER := 0;
    vn_b NUMBER := 1;
    vn_c NUMBER;
BEGIN
 
    loop 
    EXIT WHEN a > 100;
    DBMS_OUTPUT.PUT_LINE(a);
    vn_c := vn_a + vn_b;
    vn_a := vn_b;
    vn_b := vn_c;
    END LOOP;
END;
/
---------------------------------------------------------------------------------------------------------
---Minimo comun multiplo de un numero cualquiera
DECLARE
   a NUMBER := 12;
   b NUMBER := 18;
   mcd NUMBER;
   mcm NUMBER;
   x NUMBER;
   y NUMBER;
BEGIN
   x := a;
   y := b;
 
 
   WHILE y != 0 LOOP
      mcd := MOD(x, y);
      x := y;
      y := mcd;
   END LOOP;
 
   mcd := x;
 
 
   mcm := (a * b) / mcd;
 
   DBMS_OUTPUT.PUT_LINE('El MCM es: ' || mcm);
END;
/
---------------------------------------------------------------------------------------------------------
---Encontrar 2 numeros que al cuadrado den un numero x CON FOR

DECLARE
    vn_numerouno NUMBER := 64;
    vn_numeroraiz NUMBER := 0;
 
BEGIN
    FOR vn_numeroraiz IN 1..SQRT(vn_numerouno) LOOP
        IF ((vn_numeroraiz * vn_numeroraiz)= vn_numerouno) THEN 
            dbms_output.put_line(vn_numeroraiz);
        END IF;
    END LOOP;
END;
/

---------------------------------------------------------------------------------------------------------
---ESTRUCTURAS DE CONTROL
--- Iteradores o bluces
--- LOOP, WHILE, FOR
--- EL BUCLE LOOP, se repite tantas veces sea necesario hasta que se fuerza su salida con la instruccion EXIT
--- LOOP
---Instrucciones
---IF (expresion)THEN
---Instrucciones
---EXIT;
---END IF;
---END LOOP;

--- WHILE (expresion) LOOP 
---Instrucciones
---END LOOP;


---FOR

---BEGIN
---FOR X IN 1..50 LOOP
--- DBMS_OUTPUT.PUT_LINE(2*X);
---END LOOP;
---END;

---BEGIN
---FOR X IN REVERSE 1..50 LOOP
--- DBMS_OUTPUT.PUT_LINE(2*X);
---END LOOP;
---END;
```
## Evidencia Clase 23 de Febrero

Se trabajó la creación y ejecución de subprogramas en PL/SQL, especialmente procedimientos almacenados (PROCEDURE) en Oracle Database. Se aprendió a declarar parámetros de entrada, usar valores por defecto, concatenar cadenas, mostrar mensajes con DBMS_OUTPUT.PUT_LINE y ejecutar procedimientos desde bloques anónimos. Además, se practicó la eliminación de procedimientos con DROP PROCEDURE y el uso de funciones de fecha como NEXT_DAY, LAST_DAY y SYSDATE.

```sql
--- SUBPROGRAMAS ya viven dentro del motor de base de datos, se le asigna un nombre unico por esquema, a trabajar: (procedimientos almacendaos, funciones, triggers, subprogramas en bloques anonimos)
--- [corchetes cuadrados es opcional]
--- <Etiquetas>
--- obligatorio para la clase ponerle el nombre del procedimiento al END;
--- || significa excluyente en las presentaciones
--- procedimientos almacenados: Es como un "metodo" en java pero acà no devuelve ningun valor, devuelven paràmetros
--- valores quemados se les dice LITERALES
--- / -> Se pone al final para indicar "Pase al siguiente paso"

/*
Autor: Thomas Duarte Cano
Fecha: 23/02/2026
Descripcion: Este sp genera un texto saludando a alguien.
*/
--- DESPUES DE CADA CREATE, SELECT TODO

--- CREATE OR REPLACE
--- PROCEDURE Actualiza_saldo(cuenta Number, new_saldo Number)
--- IS
---     Declaracion de variables locales
--- BEGIN
---     Sentencias
--- UPDATE SALDOS_CUENTAS
--- SET SALDO = new_saldo,
--- FX

SET SERVEROUTPUT ON;

--- crar hola mundo pero recibiendo el parametro varchar2 y el nombre de una persona que admire

CREATE OR REPLACE PROCEDURE sp_mensaje (param_nombre IN VARCHAR2)
/*
Autor: Thomas Duarte Cano
Fecha: 23/02/2026
Descripcion: Este sp genera un texto saludando a alguien.
*/
IS
    vv_mensaje VARCHAR2(100);
BEGIN
    vv_mensaje := 'Hola mundo, el es campeon del mundo: ' || param_nombre || ' y cristiano llorando';
    dbms_output.put_line(vv_mensaje);
END sp_mensaje;
/

-------------------------------------------------------------------------------------
--Esto es para invocar el procedimiento almacenado

BEGIN
    sp_mensaje ('Messi'); 
END;
-----------------------------------------------------------------------------------

DROP PROCEDURE messi; --- borrar

--------------------------------------------------------------------------------------------------------------------
--- EJERCICIO CON VALOR EN DEFAULT 
CREATE OR REPLACE PROCEDURE sp_mensajeConDefault (param_nombre IN VARCHAR2 DEFAULT 'Messi')
/*
Autor: Thomas Duarte Cano
Fecha: 23/02/2026
Descripcion: Este sp genera un texto saludando a alguien usando valor en default.
*/
IS
    vv_mensaje VARCHAR2(100);
BEGIN
    vv_mensaje := 'Hola mundo, el es campeon del mundo: ' || param_nombre || ' y cristiano llorando';
    dbms_output.put_line(vv_mensaje);
END sp_mensajeConDefault;
/

BEGIN
    sp_mensajeConDefault (); 
END;
/
--- Si se pone algo en los parentesis se imprrime el valor de la invocacion
---------------------------------------------------------------------------------------------
SELECT NEXT_DAY (LAST_DAY(SYSDATE)-7,'VIERNES')---> ULTIMO VIERNES DEL MES
FROM DUAL;

SELECT NEXT_DAY (LAST_DAY(SYSDATE)-7,'VIERNES')---> ENCONTRAR LA FORMA DE EVALUARLO EN OTRO MES COMO SEPTIEMBRE.
FROM DUAL;


BEGIN
    sp_mensajeConDefaultYFecha (); 
END;

```

## Evidencia Clase 4 de Marzo

Se desarrolló un sistema de nómina utilizando programación procedural en Oracle Database mediante PL/SQL. Durante la práctica se crearon procedimientos almacenados y funciones para automatizar el cálculo y generación de nóminas de empleados, teniendo en cuenta diferentes tipos de pago como mensual, quincenal y semanal. También se trabajó con validaciones mediante estructuras condicionales, manejo de variables, consultas con `SELECT INTO`, inserciones y actualizaciones automáticas de registros relacionados con salarios, deducciones de salud y pensión, además de la generación masiva de desprendibles de pago utilizando ciclos y subprogramas.

Adicionalmente, se reforzaron conceptos relacionados con funciones que retornan valores, manejo de excepciones, uso de parámetros, paquetes (`PACKAGE` y `PACKAGE BODY`) y la organización de lógica de negocio dentro del motor de base de datos, permitiendo centralizar y automatizar procesos administrativos de manera más eficiente.

```sql
--- primero llenar pay emp contracts
--- sacar id payrol
--- if para dividir en 
--- 
INSERT INTO pay_emp_contracts (
    employee_id,
    payroll_type_id,
    base_salary,
    hours_per_month,
    start_date,
    status
)
    SELECT
        e.employee_id,
        CASE
            WHEN e.employee_id <= 2000 THEN
                (
                    SELECT
                        payroll_type_id
                    FROM
                        pay_payroll_types
                    WHERE
                        code = 'MENSUAL'
                )
            WHEN e.employee_id <= 4000 THEN
                (
                    SELECT
                        payroll_type_id
                    FROM
                        pay_payroll_types
                    WHERE
                        code = 'QUINCENAL'
                )
            ELSE
                (
                    SELECT
                        payroll_type_id
                    FROM
                        pay_payroll_types
                    WHERE
                        code = 'SEMANAL'
                )
        END,
        e.salary,
        240,
        sysdate,
        'ACTIVO'
    FROM
        employees e;

CREATE OR REPLACE PROCEDURE ingresar_nomina (
    p_employee_id IN NUMBER,
    p_period_code IN VARCHAR2
) IS

    vv_period_id       pay_periods.period_id%TYPE;
    vv_salary          pay_emp_contracts.base_salary%TYPE;
    vv_payroll_type_id pay_emp_contracts.payroll_type_id%TYPE;
    vv_period_salary   NUMBER(12, 2);
    vv_salud_rate      pay_concepts.default_rate%TYPE;
    vv_pension_rate    pay_concepts.default_rate%TYPE;
    vv_salud           NUMBER(12, 2);
    vv_pension         NUMBER(12, 2);
    vv_payslip_id      pay_payslips.payslip_id%TYPE;
    vv_sal_base_id     pay_concepts.concept_id%TYPE;
    vv_salud_id        pay_concepts.concept_id%TYPE;
    vv_pension_id      pay_concepts.concept_id%TYPE;
    vv_payroll_code    pay_payroll_types.code%TYPE;
BEGIN

    --  periodo
    SELECT
        period_id
    INTO vv_period_id
    FROM
        pay_periods
    WHERE
        period_code = p_period_code;

    --  contrato activo
    SELECT
        c.base_salary,
        c.payroll_type_id,
        t.code
    INTO
        vv_salary,
        vv_payroll_type_id,
        vv_payroll_code
    FROM
             pay_emp_contracts c
        JOIN pay_payroll_types t ON c.payroll_type_id = t.payroll_type_id
    WHERE
            c.employee_id = p_employee_id
        AND c.status = 'ACTIVO';

    -- Calcular salario
    IF vv_payroll_code = 'MENSUAL' THEN
        vv_period_salary := vv_salary;
    ELSIF vv_payroll_code = 'QUINCENAL' THEN
        vv_period_salary := vv_salary / 2;
    ELSIF vv_payroll_code = 'SEMANAL' THEN
        vv_period_salary := vv_salary / 4;
    ELSE
        raise_application_error(-20001, 'Tipo de nómina inválido');
    END IF;

    -- conceptos y tasas en una sola consulta cada uno
    SELECT
        concept_id,
        default_rate
    INTO
        vv_salud_id,
        vv_salud_rate
    FROM
        pay_concepts
    WHERE
        code = 'SALUD_EE';

    SELECT
        concept_id,
        default_rate
    INTO
        vv_pension_id,
        vv_pension_rate
    FROM
        pay_concepts
    WHERE
        code = 'PENSION_EE';

    SELECT
        concept_id
    INTO vv_sal_base_id
    FROM
        pay_concepts
    WHERE
        code = 'SAL_BASE';

    --  Calcular deducciones
    vv_salud := vv_period_salary * vv_salud_rate;
    vv_pension := vv_period_salary * vv_pension_rate;

    --  Insertar cabecera
    INSERT INTO pay_payslips (
        period_id,
        employee_id,
        gross_total,
        ded_total,
        net_total
    ) VALUES ( vv_period_id,
               p_employee_id,
               0,
               0,
               0 ) RETURNING payslip_id INTO vv_payslip_id;

    -- Insertar salario base
    INSERT INTO pay_payslip_lines (
        payslip_id,
        concept_id,
        qty,
        unit_value,
        line_total
    ) VALUES ( vv_payslip_id,
               vv_sal_base_id,
               1,
               vv_period_salary,
               vv_period_salary );

    --  Insertar salud
    INSERT INTO pay_payslip_lines (
        payslip_id,
        concept_id,
        qty,
        unit_value,
        line_total
    ) VALUES ( vv_payslip_id,
               vv_salud_id,
               1,
               - vv_salud,
               - vv_salud );

    --  Insertar pensión
    INSERT INTO pay_payslip_lines (
        payslip_id,
        concept_id,
        qty,
        unit_value,
        line_total
    ) VALUES ( vv_payslip_id,
               vv_pension_id,
               1,
               - vv_pension,
               - vv_pension );

    -- Actualizar totales
    UPDATE pay_payslips
    SET
        gross_total = vv_period_salary,
        ded_total = vv_salud + vv_pension,
        net_total = vv_period_salary - ( vv_salud + vv_pension )
    WHERE
        payslip_id = vv_payslip_id;

    COMMIT;
END ingresar_nomina;
/

CREATE OR REPLACE PROCEDURE generar_nomina_total IS
BEGIN
    FOR vv_period IN (
        SELECT
            period_code
        FROM
            pay_periods
        ORDER BY
            period_code
    ) LOOP
        FOR vv_emp IN (
            SELECT
                employee_id
            FROM
                pay_emp_contracts
            WHERE
                status = 'ACTIVO'
        ) LOOP
            BEGIN
                ingresar_nomina(vv_emp.employee_id, vv_period.period_code);
            EXCEPTION
                WHEN OTHERS THEN
                    NULL;
            END;
        END LOOP;
    END LOOP;
END generar_nomina_total;
/

BEGIN
    generar_nomina_total;
END;
/



--- retornar un valor varchar y recibe un nombre
CREATE OR REPLACE 
FUNCTION fn_saludar_A_Alguien (vv_saludar VARCHAR2)
RETURN VARCHAR2
IS
    vv_resultado VARCHAR2(30):='Hola chiquitas,soy: ';
BEGIN
return (vv_resultado || vv_saludar );
END;
/

DECLARE 
mensa VARCHAR2(30);
BEGIN
mensa := fn_saludar_A_Alguien('Messi');
 dbms_output.put_line(mensa);
END;
/
--- 

--- retornar integral

--- paquetes - sintaxis (Especificacion)
--- CREATE OR REPLACE PACKAGE pck_same
--- PROCEDURE calcularNomina -> Esto es publico
--- FUNCTION calcularDivisas -> Esto es publico
-- END;
-- /

--- paquetes - BODY
--- CREATE OR REPLACE PACKAGE BODY pck_same

--- PROCEDURE calcularNomina -> Esto es publico
--
--
--- END;
--- /
--- FUNCTION calcularDivisas -> Esto es publico 
--
--
--- END;
--- END;


--- FUNCION RETORNA UN SOLO VALOR
--- PROCEDIMIENTO DEVUELVE PARAMETROS O NADA

--- Triggers
```
## Clase 9 de Marzo

Se trabajó el manejo de triggers o disparadores en Oracle Database, comprendiendo cómo ejecutar acciones automáticas antes o después de operaciones DML como INSERT, UPDATE y DELETE. Además, se estudió el uso de las variables :OLD y :NEW para controlar los valores anteriores y posteriores a una modificación en una tabla, permitiendo validar y controlar eventos dentro de la base de datos. También se reforzó el manejo de excepciones declaradas y no declaradas dentro de los programas PL/SQL, aplicando buenas prácticas de control de errores y organización del código.

```sql
--- Triggers (Disparadores) Objetos que se ejecuran despues de una accion, utilizados para controlar un evento en la base de datos- se maneja en sentencias de tipo DML
--- CREATE OR REPLACE TRIGGER <nombre>
--- before|after : DELETE, INSERT, UPDATE
--- Siempre funciona un trigger para UNA SOLA tabla con ON
--- OF sirve para especificar columnas a analizar en la tabla
--- 2 varibles, ANTES DEL CAMBIO (OLD) Y DESPUES DEL CAMBIO (NEW)
--- INSERT CON OLD: NULO
--- INSERT CON NEW: NUEVO DATO
--- UPDATE CON OLD: Valores originales
--- UPDATE CON NEW: valores nuevo cuando se complete la orden
--- DELETE CON OLD: Valor borrado antes de 
--- DELTE CON NEW: NULO

--- Escalamiento horizontal: Cuando el server no tiene mas recursos (No se le puede aumentar memoria, etc) 
--- Escalamiento vertical: 16gb -> 32 gb

--- EXCEPCIONES
--- Sin declaracion y declaradas
--- PREFIJO: EXC_XXX


--- Excepciones en todo el trabajo.
```
## Evidencia Taller 2

```sql
-- ======================================================================
-- PUNTO 1 - BLOQUE ANÓNIMO
-- Liquidación individual de nómina
-- ======================================================================

DECLARE

    -- Datos de entrada
    v_empleado_id      EMPLEADOS.id_empleado%TYPE := 1003;
    v_quincena         VARCHAR2(15) := '2026-Q1-ENE';

    -- Información del empleado
    v_nombre_emp       EMPLEADOS.nombre%TYPE;
    v_contrato         EMPLEADOS.tipo_contrato%TYPE;
    v_sede             SEDES.nombre_sede%TYPE;
    v_codigo_sede      EMPLEADOS.cod_sede%TYPE;
    v_antiguedad       NUMBER;

    -- Valores de cálculo
    v_salario_q        NUMBER(12,2) := 0;
    v_valor_hora       NUMBER(12,2) := 0;
    v_total_recargos   NUMBER(12,2) := 0;
    v_bonificacion     NUMBER(12,2) := 0;
    v_auxilio          NUMBER(12,2) := 0;
    v_bono             NUMBER(12,2) := 0;
    v_bruto_total      NUMBER(12,2) := 0;

    -- Variables auxiliares
    v_horas_normales   NUMBER := 0;
    v_salario_mensual  NUMBER := 0;
    v_sanciones        NUMBER := 0;

    -- Parámetros
    v_smlmv            NUMBER;
    v_aux_transporte   NUMBER;
    v_pct_nocturno     NUMBER;
    v_pct_domingo      NUMBER;
    v_pct_noct_dom     NUMBER;
    v_bono_sma         NUMBER;
    v_ret_servicios    NUMBER;

    -- Cursor de horas extras
    CURSOR c_recargos IS
        SELECT tipo_hora,
               cantidad_horas
        FROM HORAS_TRABAJADAS
        WHERE id_empleado = v_empleado_id
          AND id_quincena = v_quincena
          AND tipo_hora IN ('NOCTURNA','DOMINICAL','NOCTURNA_DOM');

BEGIN

    -- ==============================================================
    -- CONSULTAR DATOS DEL EMPLEADO
    -- ==============================================================

    SELECT e.nombre,
           e.tipo_contrato,
           s.nombre_sede,
           e.cod_sede,
           TRUNC(MONTHS_BETWEEN(SYSDATE,e.fecha_ingreso)/12),
           e.salario_base
    INTO v_nombre_emp,
         v_contrato,
         v_sede,
         v_codigo_sede,
         v_antiguedad,
         v_salario_mensual
    FROM EMPLEADOS e
    INNER JOIN SEDES s
        ON e.cod_sede = s.cod_sede
    WHERE e.id_empleado = v_empleado_id;

    -- ==============================================================
    -- CARGAR PARÁMETROS
    -- ==============================================================

    SELECT valor_numerico INTO v_smlmv
    FROM PARAMETROS
    WHERE cod_parametro = 'SMLMV';

    SELECT valor_numerico INTO v_aux_transporte
    FROM PARAMETROS
    WHERE cod_parametro = 'AUX_TRANSPORTE';

    SELECT valor_numerico INTO v_pct_nocturno
    FROM PARAMETROS
    WHERE cod_parametro = 'RECARGO_NOCTURNO';

    SELECT valor_numerico INTO v_pct_domingo
    FROM PARAMETROS
    WHERE cod_parametro = 'RECARGO_DOMINICAL';

    SELECT valor_numerico INTO v_pct_noct_dom
    FROM PARAMETROS
    WHERE cod_parametro = 'RECARGO_NOCT_DOM';

    SELECT valor_numerico INTO v_bono_sma
    FROM PARAMETROS
    WHERE cod_parametro = 'BONO_CLIMA_SMA';

    SELECT valor_numerico INTO v_ret_servicios
    FROM PARAMETROS
    WHERE cod_parametro = 'RET_SERVICIOS';

    -- ==============================================================
    -- REGLA 1 - SALARIO BASE QUINCENAL
    -- ==============================================================

    IF v_contrato = 'PLANTA' THEN

        v_salario_q := v_salario_mensual / 2;
        v_valor_hora := v_salario_mensual / 240;

    ELSIF v_contrato = 'TEMPORAL' THEN

        SELECT NVL(SUM(cantidad_horas),0)
        INTO v_horas_normales
        FROM HORAS_TRABAJADAS
        WHERE id_empleado = v_empleado_id
          AND id_quincena = v_quincena
          AND tipo_hora = 'NORMAL';

        v_valor_hora := v_salario_mensual;
        v_salario_q := v_horas_normales * v_valor_hora;

    ELSIF v_contrato = 'SERVICIOS' THEN

        v_salario_q :=
            (v_salario_mensual -
            (v_salario_mensual * v_ret_servicios / 100)) / 2;

    END IF;

    -- ==============================================================
    -- REGLA 2 - RECARGOS
    -- ==============================================================

    IF v_contrato <> 'SERVICIOS' THEN

        FOR x IN c_recargos LOOP

            IF x.tipo_hora = 'NOCTURNA' THEN

                v_total_recargos :=
                    v_total_recargos +
                    (x.cantidad_horas * v_valor_hora * v_pct_nocturno / 100);

            ELSIF x.tipo_hora = 'DOMINICAL' THEN

                v_total_recargos :=
                    v_total_recargos +
                    (x.cantidad_horas * v_valor_hora * v_pct_domingo / 100);

            ELSIF x.tipo_hora = 'NOCTURNA_DOM' THEN

                v_total_recargos :=
                    v_total_recargos +
                    (x.cantidad_horas * v_valor_hora * v_pct_noct_dom / 100);

            END IF;

        END LOOP;

    END IF;

    -- ==============================================================
    -- REGLA 3 - BONIFICACIÓN
    -- ==============================================================

    IF v_contrato IN ('PLANTA','TEMPORAL') THEN

        SELECT COUNT(*)
        INTO v_sanciones
        FROM SANCIONES
        WHERE id_empleado = v_empleado_id
          AND fecha_sancion >= ADD_MONTHS(SYSDATE,-6);

        IF v_sanciones <= 2 THEN

            CASE
                WHEN v_antiguedad BETWEEN 3 AND 5 THEN
                    v_bonificacion := v_salario_q * 0.03;

                WHEN v_antiguedad BETWEEN 6 AND 10 THEN
                    v_bonificacion := v_salario_q * 0.06;

                WHEN v_antiguedad > 10 THEN
                    v_bonificacion := v_salario_q * 0.10;

                ELSE
                    v_bonificacion := 0;
            END CASE;

        END IF;

    END IF;

    -- ==============================================================
    -- REGLA 4 - AUXILIO DE TRANSPORTE
    -- ==============================================================

    IF v_contrato IN ('PLANTA','TEMPORAL') THEN

        IF v_contrato = 'TEMPORAL' THEN
            v_salario_mensual := v_valor_hora * v_horas_normales * 2;
        END IF;

        IF v_salario_mensual <= (2 * v_smlmv) THEN
            v_auxilio := v_aux_transporte / 2;
        END IF;

    END IF;

    -- ==============================================================
    -- REGLA 5 - BONO POR SEDE
    -- ==============================================================

    IF v_codigo_sede = 'SMA'
       AND v_contrato IN ('PLANTA','TEMPORAL') THEN

        v_bono := v_bono_sma;

    END IF;

    -- ==============================================================
    -- TOTAL BRUTO
    -- ==============================================================

    v_bruto_total :=
          v_salario_q
        + v_total_recargos
        + v_bonificacion
        + v_auxilio
        + v_bono;

    -- ==============================================================
    -- RESULTADOS
    -- ==============================================================

    DBMS_OUTPUT.PUT_LINE('====================================');
    DBMS_OUTPUT.PUT_LINE('      RESUMEN DE LIQUIDACIÓN');
    DBMS_OUTPUT.PUT_LINE('====================================');

    DBMS_OUTPUT.PUT_LINE('Empleado : ' || v_nombre_emp);
    DBMS_OUTPUT.PUT_LINE('ID       : ' || v_empleado_id);
    DBMS_OUTPUT.PUT_LINE('Sede     : ' || v_sede);
    DBMS_OUTPUT.PUT_LINE('Contrato : ' || v_contrato);
    DBMS_OUTPUT.PUT_LINE('Antiguedad : ' || v_antiguedad || ' años');

    DBMS_OUTPUT.PUT_LINE('------------------------------------');

    DBMS_OUTPUT.PUT_LINE('Salario Base      : ' ||
        TO_CHAR(v_salario_q,'999,999,999.99'));

    DBMS_OUTPUT.PUT_LINE('Recargos          : ' ||
        TO_CHAR(v_total_recargos,'999,999,999.99'));

    DBMS_OUTPUT.PUT_LINE('Bonificación      : ' ||
        TO_CHAR(v_bonificacion,'999,999,999.99'));

    DBMS_OUTPUT.PUT_LINE('Auxilio Transporte: ' ||
        TO_CHAR(v_auxilio,'999,999,999.99'));

    DBMS_OUTPUT.PUT_LINE('Bono Sede         : ' ||
        TO_CHAR(v_bono,'999,999,999.99'));

    DBMS_OUTPUT.PUT_LINE('------------------------------------');

    DBMS_OUTPUT.PUT_LINE('TOTAL BRUTO       : ' ||
        TO_CHAR(v_bruto_total,'999,999,999.99'));

    DBMS_OUTPUT.PUT_LINE('====================================');

EXCEPTION

    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE(
            'No existe información del empleado.'
        );

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE(
            'Se presentó un error: ' || SQLERRM
        );

END;
/

-- ======================================================================
-- PUNTO 2: Funciones Independientes
-- ======================================================================

-- ==========================================================
-- Función: fn_calcular_salario_q
-- ==========================================================
CREATE OR REPLACE FUNCTION fn_calcular_salario_q(
    p_empleado NUMBER,
    p_quincena VARCHAR2
)
RETURN NUMBER
IS
    v_contrato        EMPLEADOS.tipo_contrato%TYPE;
    v_salario         EMPLEADOS.salario_base%TYPE;
    v_horas           NUMBER := 0;
    v_retencion       NUMBER := 0;
    v_total_salario   NUMBER := 0;
BEGIN

    SELECT tipo_contrato, salario_base
    INTO v_contrato, v_salario
    FROM EMPLEADOS
    WHERE id_empleado = p_empleado;

    IF v_contrato = 'PLANTA' THEN

        v_total_salario := v_salario / 2;

    ELSIF v_contrato = 'TEMPORAL' THEN

        SELECT NVL(SUM(cantidad_horas),0)
        INTO v_horas
        FROM HORAS_TRABAJADAS
        WHERE id_empleado = p_empleado
          AND id_quincena = p_quincena
          AND tipo_hora = 'NORMAL';

        v_total_salario := v_horas * v_salario;

    ELSIF v_contrato = 'SERVICIOS' THEN

        SELECT valor_numerico
        INTO v_retencion
        FROM PARAMETROS
        WHERE cod_parametro = 'RET_SERVICIOS';

        v_total_salario := (v_salario - (v_salario * v_retencion / 100)) / 2;

    ELSE
        v_total_salario := 0;
    END IF;

    RETURN ROUND(v_total_salario,2);

END;
/

-- ==========================================================
-- Función: fn_total_recargos
-- ==========================================================
CREATE OR REPLACE FUNCTION fn_total_recargos(
    p_empleado NUMBER,
    p_quincena VARCHAR2
)
RETURN NUMBER
IS
    v_contrato        EMPLEADOS.tipo_contrato%TYPE;
    v_hora_base       NUMBER := 0;

    v_pct_nocturno    NUMBER;
    v_pct_dominical   NUMBER;
    v_pct_mixto       NUMBER;

    v_recargo_total   NUMBER := 0;

    CURSOR c_detalle_horas IS
        SELECT tipo_hora, cantidad_horas
        FROM HORAS_TRABAJADAS
        WHERE id_empleado = p_empleado
          AND id_quincena = p_quincena
          AND tipo_hora IN ('NOCTURNA','DOMINICAL','NOCTURNA_DOM');

BEGIN

    SELECT tipo_contrato
    INTO v_contrato
    FROM EMPLEADOS
    WHERE id_empleado = p_empleado;

    IF v_contrato = 'SERVICIOS' THEN
        RETURN 0;
    END IF;

    IF v_contrato = 'PLANTA' THEN

        SELECT salario_base / 240
        INTO v_hora_base
        FROM EMPLEADOS
        WHERE id_empleado = p_empleado;

    ELSE

        SELECT salario_base
        INTO v_hora_base
        FROM EMPLEADOS
        WHERE id_empleado = p_empleado;

    END IF;

    SELECT valor_numerico
    INTO v_pct_nocturno
    FROM PARAMETROS
    WHERE cod_parametro = 'RECARGO_NOCTURNO';

    SELECT valor_numerico
    INTO v_pct_dominical
    FROM PARAMETROS
    WHERE cod_parametro = 'RECARGO_DOMINICAL';

    SELECT valor_numerico
    INTO v_pct_mixto
    FROM PARAMETROS
    WHERE cod_parametro = 'RECARGO_NOCT_DOM';

    FOR dato IN c_detalle_horas LOOP

        IF dato.tipo_hora = 'NOCTURNA' THEN

            v_recargo_total := v_recargo_total +
                               (dato.cantidad_horas * v_hora_base * (v_pct_nocturno/100));

        ELSIF dato.tipo_hora = 'DOMINICAL' THEN

            v_recargo_total := v_recargo_total +
                               (dato.cantidad_horas * v_hora_base * (v_pct_dominical/100));

        ELSIF dato.tipo_hora = 'NOCTURNA_DOM' THEN

            v_recargo_total := v_recargo_total +
                               (dato.cantidad_horas * v_hora_base * (v_pct_mixto/100));

        END IF;

    END LOOP;

    RETURN ROUND(v_recargo_total,2);

END;
/

-- ==========================================================
-- Función: fn_calcular_bono
-- ==========================================================
CREATE OR REPLACE FUNCTION fn_calcular_bono(
    p_empleado NUMBER
)
RETURN NUMBER
IS
    v_contrato        EMPLEADOS.tipo_contrato%TYPE;
    v_ingreso         EMPLEADOS.fecha_ingreso%TYPE;

    v_antiguedad      NUMBER;
    v_sanciones       NUMBER;

    v_salario_q       NUMBER;
    v_bono            NUMBER := 0;

BEGIN

    SELECT tipo_contrato, fecha_ingreso
    INTO v_contrato, v_ingreso
    FROM EMPLEADOS
    WHERE id_empleado = p_empleado;

    IF v_contrato = 'SERVICIOS' THEN
        RETURN 0;
    END IF;

    v_antiguedad := TRUNC(MONTHS_BETWEEN(SYSDATE, v_ingreso) / 12);

    SELECT COUNT(*)
    INTO v_sanciones
    FROM SANCIONES
    WHERE id_empleado = p_empleado
      AND fecha_sancion >= ADD_MONTHS(SYSDATE,-6);

    IF v_sanciones <= 2 THEN

        v_salario_q := fn_calcular_salario_q(p_empleado,'2026-Q1-ENE');

        CASE
            WHEN v_antiguedad BETWEEN 3 AND 5 THEN
                v_bono := v_salario_q * 0.03;

            WHEN v_antiguedad BETWEEN 6 AND 10 THEN
                v_bono := v_salario_q * 0.06;

            WHEN v_antiguedad > 10 THEN
                v_bono := v_salario_q * 0.10;
        END CASE;

    END IF;

    RETURN ROUND(v_bono,2);

END;
/

-- ==========================================================
-- Función: fn_total_bruto
-- ==========================================================
CREATE OR REPLACE FUNCTION fn_total_bruto(
    p_empleado NUMBER,
    p_quincena VARCHAR2
)
RETURN NUMBER
IS

    v_salario_q       NUMBER;
    v_recargos        NUMBER;
    v_bono            NUMBER;

    v_auxilio         NUMBER := 0;
    v_bono_sede       NUMBER := 0;

    v_contrato        EMPLEADOS.tipo_contrato%TYPE;
    v_sede            EMPLEADOS.cod_sede%TYPE;

    v_smlmv           NUMBER;
    v_aux_mensual     NUMBER;

    v_salario_equiv   NUMBER;
    v_horas           NUMBER;
    v_valor_hora      NUMBER;

    v_bono_clima      NUMBER;

BEGIN

    v_salario_q := fn_calcular_salario_q(p_empleado, p_quincena);

    v_recargos := fn_total_recargos(p_empleado, p_quincena);

    v_bono := fn_calcular_bono(p_empleado);

    SELECT tipo_contrato, cod_sede
    INTO v_contrato, v_sede
    FROM EMPLEADOS
    WHERE id_empleado = p_empleado;

    -- ==================================================
    -- Auxilio transporte
    -- ==================================================

    IF v_contrato IN ('PLANTA','TEMPORAL') THEN

        SELECT valor_numerico
        INTO v_smlmv
        FROM PARAMETROS
        WHERE cod_parametro = 'SMLMV';

        SELECT valor_numerico
        INTO v_aux_mensual
        FROM PARAMETROS
        WHERE cod_parametro = 'AUX_TRANSPORTE';

        IF v_contrato = 'PLANTA' THEN

            SELECT salario_base
            INTO v_salario_equiv
            FROM EMPLEADOS
            WHERE id_empleado = p_empleado;

        ELSE

            SELECT salario_base
            INTO v_valor_hora
            FROM EMPLEADOS
            WHERE id_empleado = p_empleado;

            SELECT NVL(SUM(cantidad_horas),0)
            INTO v_horas
            FROM HORAS_TRABAJADAS
            WHERE id_empleado = p_empleado
              AND id_quincena = p_quincena
              AND tipo_hora = 'NORMAL';

            v_salario_equiv := v_horas * v_valor_hora * 2;

        END IF;

        IF v_salario_equiv <= (v_smlmv * 2) THEN
            v_auxilio := v_aux_mensual / 2;
        END IF;

    END IF;

    -- ==================================================
    -- Bono sede Santa Marta
    -- ==================================================

    IF v_contrato IN ('PLANTA','TEMPORAL')
       AND v_sede = 'SMA' THEN

        SELECT valor_numerico
        INTO v_bono_clima
        FROM PARAMETROS
        WHERE cod_parametro = 'BONO_CLIMA_SMA';

        v_bono_sede := v_bono_clima;

    END IF;

    RETURN ROUND(
        v_salario_q +
        v_recargos +
        v_bono +
        v_auxilio +
        v_bono_sede
    ,2);

END;
/

-- ==========================================================
-- PRUEBA DE EJECUCIÓN
-- ==========================================================

SELECT fn_total_bruto(1001,'2026-Q1-ENE')
FROM DUAL;

-- ======================================================================
-- Punto 3: Procedimiento sp_procesar_empleado
-- ======================================================================

CREATE OR REPLACE PROCEDURE sp_procesar_empleado(
    p_empleado NUMBER,
    p_quincena VARCHAR2
) IS
    -- Validación
    w_estado       EMPLEADOS.estado%TYPE;
    w_registros    NUMBER;

    -- Ingresos
    w_sal_q        NUMBER(12,2);
    w_recargos     NUMBER(12,2);
    w_bonif        NUMBER(12,2);
    w_aux_transp   NUMBER(12,2);
    w_bono_sede    NUMBER(12,2);
    w_bruto        NUMBER(12,2);

    -- Deducciones
    w_salud        NUMBER(12,2);
    w_pension      NUMBER(12,2);
    w_fondo        NUMBER(12,2) := 0;
    w_embargo      NUMBER(12,2) := 0;
    w_libranzas    NUMBER(12,2) := 0;
    w_aporte_vol   NUMBER(12,2) := 0;
    w_tot_ded      NUMBER(12,2);
    w_neto         NUMBER(12,2);

    -- Parámetros
    w_pct_salud    NUMBER(5,2);
    w_pct_pension  NUMBER(5,2);
    w_pct_fondo    NUMBER(5,2);
    w_umbral_fondo NUMBER;
    w_smlmv        NUMBER(12,2);
    w_aporte_bog   NUMBER(12,2);
    w_aux_mens     NUMBER(12,2);

    -- Embargo y libranzas
    w_porc_embargo NUMBER(5,2);
    w_lib_mensual  NUMBER(12,2);

    -- Sede y voluntario
    w_cod_sede     VARCHAR2(5);
    w_acepta_vol   VARCHAR2(1);

BEGIN
    -- Verificar que el empleado exista
    BEGIN
        SELECT estado, cod_sede, acepta_aporte_vol
        INTO w_estado, w_cod_sede, w_acepta_vol
        FROM EMPLEADOS
        WHERE id_empleado = p_empleado;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20001, 'Empleado no encontrado: ' || p_empleado);
    END;

    -- Verificar estado activo
    IF w_estado != 'ACTIVO' THEN
        RAISE_APPLICATION_ERROR(-20002, 'Empleado inactivo: estado = ' || w_estado);
    END IF;

    -- Verificar que no exista liquidación previa para la quincena
    SELECT COUNT(*) INTO w_registros
    FROM LIQUIDACION
    WHERE id_empleado = p_empleado AND id_quincena = p_quincena;

    IF w_registros > 0 THEN
        RAISE_APPLICATION_ERROR(-20003,
            'Ya existe liquidación para el empleado ' || p_empleado ||
            ' en la quincena ' || p_quincena);
    END IF;

    -- Calcular ingresos
    w_sal_q    := calcular_salario_q(p_empleado, p_quincena);
    w_recargos := calcular_recargos(p_empleado, p_quincena);
    w_bonif    := calcular_bonificacion(p_empleado);

    -- Auxilio de transporte
    SELECT valor_numerico INTO w_smlmv    FROM PARAMETROS WHERE cod_parametro = 'SMLMV';
    SELECT valor_numerico INTO w_aux_mens FROM PARAMETROS WHERE cod_parametro = 'AUX_TRANSPORTE';

    DECLARE
        w_contrato   EMPLEADOS.tipo_contrato%TYPE;
        w_sal_mens   NUMBER;
        w_val_hora   NUMBER;
        w_horas_norm NUMBER;
    BEGIN
        SELECT tipo_contrato INTO w_contrato
        FROM EMPLEADOS WHERE id_empleado = p_empleado;

        IF w_contrato IN ('PLANTA', 'TEMPORAL') THEN
            IF w_contrato = 'PLANTA' THEN
                SELECT salario_base INTO w_sal_mens
                FROM EMPLEADOS WHERE id_empleado = p_empleado;
            ELSE
                SELECT salario_base INTO w_val_hora
                FROM EMPLEADOS WHERE id_empleado = p_empleado;

                SELECT NVL(SUM(cantidad_horas), 0) INTO w_horas_norm
                FROM HORAS_TRABAJADAS
                WHERE id_empleado = p_empleado
                  AND id_quincena  = p_quincena
                  AND tipo_hora    = 'NORMAL';

                w_sal_mens := w_horas_norm * w_val_hora * 2;
            END IF;

            w_aux_transp := CASE WHEN w_sal_mens <= 2 * w_smlmv THEN w_aux_mens / 2 ELSE 0 END;
        ELSE
            w_aux_transp := 0;
        END IF;
    END;

    -- Bono sede
    DECLARE
        w_contrato   EMPLEADOS.tipo_contrato%TYPE;
        w_bono_sma   NUMBER;
    BEGIN
        SELECT tipo_contrato INTO w_contrato
        FROM EMPLEADOS WHERE id_empleado = p_empleado;

        IF w_contrato IN ('PLANTA', 'TEMPORAL') AND w_cod_sede = 'SMA' THEN
            SELECT valor_numerico INTO w_bono_sma
            FROM PARAMETROS WHERE cod_parametro = 'BONO_CLIMA_SMA';
            w_bono_sede := w_bono_sma;
        ELSE
            w_bono_sede := 0;
        END IF;
    END;

    -- Total bruto
    w_bruto := w_sal_q + w_recargos + w_bonif + w_aux_transp + w_bono_sede;

    -- Deducciones
    SELECT valor_numerico INTO w_pct_salud   FROM PARAMETROS WHERE cod_parametro = 'PCT_SALUD';
    SELECT valor_numerico INTO w_pct_pension FROM PARAMETROS WHERE cod_parametro = 'PCT_PENSION';
    SELECT valor_numerico INTO w_pct_fondo   FROM PARAMETROS WHERE cod_parametro = 'PCT_FONDO_SOLIDARIDAD';
    SELECT valor_numerico INTO w_umbral_fondo FROM PARAMETROS WHERE cod_parametro = 'UMBRAL_FONDO_SMLMV';
    SELECT valor_numerico INTO w_aporte_bog  FROM PARAMETROS WHERE cod_parametro = 'APORTE_VOL_BOG';

    w_salud   := w_bruto * w_pct_salud   / 100;
    w_pension := w_bruto * w_pct_pension / 100;

    IF (w_bruto * 2) > (w_umbral_fondo * w_smlmv) THEN
        w_fondo := w_bruto * w_pct_fondo / 100;
    END IF;

    SELECT NVL(SUM(porcentaje), 0) INTO w_porc_embargo
    FROM EMBARGOS
    WHERE id_empleado = p_empleado AND estado = 'ACTIVO';

    IF w_porc_embargo > 0 THEN
        w_embargo := (w_bruto - w_salud - w_pension - w_fondo) * w_porc_embargo / 100;
    END IF;

    SELECT NVL(SUM(cuota_mensual), 0) INTO w_lib_mensual
    FROM LIBRANZAS
    WHERE id_empleado = p_empleado AND estado = 'ACTIVA';
    w_libranzas := w_lib_mensual / 2;

    IF w_cod_sede = 'BOG' AND w_acepta_vol = 'S' THEN
        w_aporte_vol := w_aporte_bog;
    END IF;

    w_tot_ded := w_salud + w_pension + w_fondo + w_embargo + w_libranzas + w_aporte_vol;
    w_neto    := w_bruto - w_tot_ded;

    -- Ajuste por neto negativo
    IF w_neto < 0 THEN
        w_embargo := 0;
        w_tot_ded := w_salud + w_pension + w_fondo + w_embargo + w_libranzas + w_aporte_vol;
        w_neto    := w_bruto - w_tot_ded;

        IF w_neto < 0 THEN
            w_libranzas := 0;
            w_tot_ded   := w_salud + w_pension + w_fondo + w_embargo + w_libranzas + w_aporte_vol;
            w_neto      := w_bruto - w_tot_ded;
        END IF;
    END IF;

    -- Insertar registro de liquidación
    INSERT INTO LIQUIDACION (
        id_liquidacion, id_empleado, id_quincena,
        salario_base_q, recargos, bonificacion,
        auxilio_transp, bono_sede, bruto,
        deduccion_salud, deduccion_pension,
        fondo_solidaridad, embargo, libranzas,
        aporte_voluntario, total_deducciones, neto
    ) VALUES (
        SEQ_LIQUIDACION.NEXTVAL, p_empleado, p_quincena,
        w_sal_q, w_recargos, w_bonif,
        w_aux_transp, w_bono_sede, w_bruto,
        w_salud, w_pension, w_fondo,
        w_embargo, w_libranzas, w_aporte_vol,
        w_tot_ded, w_neto
    );

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END sp_procesar_empleado;
/

-- Pruebas de validación
BEGIN sp_procesar_empleado(9999, '2026-Q1-ENE');
EXCEPTION WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE(SQLERRM); END;
/

BEGIN sp_procesar_empleado(1017, '2026-Q1-ENE');
EXCEPTION WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE(SQLERRM); END;
/

BEGIN
    sp_procesar_empleado(1001, '2026-Q1-ENE');
    sp_procesar_empleado(1001, '2026-Q1-ENE');
EXCEPTION WHEN OTHERS THEN DBMS_OUTPUT.PUT_LINE(SQLERRM); END;
/

-- ======================================================================
-- Punto 4: Package PKG_NOMINA (spec + body)
-- ======================================================================

CREATE OR REPLACE PACKAGE PKG_NOMINA IS

    -- Tipos públicos
    TYPE t_concepto_liq IS RECORD (
        id_empleado       LIQUIDACION.id_empleado%TYPE,
        id_quincena       LIQUIDACION.id_quincena%TYPE,
        salario_base_q    LIQUIDACION.salario_base_q%TYPE,
        recargos          LIQUIDACION.recargos%TYPE,
        bonificacion      LIQUIDACION.bonificacion%TYPE,
        auxilio_transp    LIQUIDACION.auxilio_transp%TYPE,
        bono_sede         LIQUIDACION.bono_sede%TYPE,
        bruto             LIQUIDACION.bruto%TYPE,
        deduccion_salud   LIQUIDACION.deduccion_salud%TYPE,
        deduccion_pension LIQUIDACION.deduccion_pension%TYPE,
        fondo_solidaridad LIQUIDACION.fondo_solidaridad%TYPE,
        embargo           LIQUIDACION.embargo%TYPE,
        libranzas         LIQUIDACION.libranzas%TYPE,
        aporte_voluntario LIQUIDACION.aporte_voluntario%TYPE,
        total_deducciones LIQUIDACION.total_deducciones%TYPE,
        neto              LIQUIDACION.neto%TYPE
    );

    TYPE t_lista_liq  IS TABLE OF t_concepto_liq INDEX BY PLS_INTEGER;
    TYPE t_ids_tabla  IS TABLE OF EMPLEADOS.id_empleado%TYPE INDEX BY PLS_INTEGER;

    -- Obtener SMLMV vigente
    FUNCTION fn_get_smlmv RETURN NUMBER;

    -- Liquidar un empleado o toda la quincena (sobrecarga)
    PROCEDURE sp_liquidar_quincena(p_id_empleado NUMBER, p_id_quincena VARCHAR2);
    PROCEDURE sp_liquidar_quincena(p_id_quincena VARCHAR2);

    -- Total neto pagado por sede
    FUNCTION fn_total_nomina_sede(p_cod_sede VARCHAR2, p_id_quincena VARCHAR2) RETURN NUMBER;

    -- Reporte pipelined
    TYPE t_fila_reporte IS RECORD (
        id_liquidacion  LIQUIDACION.id_liquidacion%TYPE,
        id_empleado     LIQUIDACION.id_empleado%TYPE,
        nombre_empleado EMPLEADOS.nombre%TYPE,
        cod_sede        SEDES.cod_sede%TYPE,
        id_quincena     LIQUIDACION.id_quincena%TYPE,
        bruto           LIQUIDACION.bruto%TYPE,
        neto            LIQUIDACION.neto%TYPE
    );

    TYPE t_tabla_reporte IS TABLE OF t_fila_reporte;

    FUNCTION fn_reporte_nomina(
        p_cod_sede      VARCHAR2 DEFAULT NULL,
        p_tipo_contrato VARCHAR2 DEFAULT NULL
    ) RETURN t_tabla_reporte PIPELINED;

END PKG_NOMINA;
/

CREATE OR REPLACE PACKAGE BODY PKG_NOMINA IS

    -- Cache de parámetros (privada)
    TYPE t_cache_params IS RECORD (
        smlmv              NUMBER,
        aux_transporte     NUMBER,
        pct_salud          NUMBER,
        pct_pension        NUMBER,
        pct_fondo_solid    NUMBER,
        umbral_fondo_smlmv NUMBER,
        rec_nocturno       NUMBER,
        rec_dominical      NUMBER,
        rec_noct_dom       NUMBER,
        ret_servicios      NUMBER,
        bono_clima_sma     NUMBER,
        aporte_vol_bog     NUMBER
    );

    TYPE t_ded_resultado IS RECORD (
        salud       NUMBER,
        pension     NUMBER,
        fondo_solid NUMBER,
        embargo     NUMBER,
        libranzas   NUMBER,
        aporte_vol  NUMBER,
        total       NUMBER
    );

    g_cache      t_cache_params;
    g_inicializado BOOLEAN := FALSE;

    -- Inicializar cache
    PROCEDURE inicializar_cache IS
    BEGIN
        IF NOT g_inicializado THEN
            SELECT MAX(CASE WHEN cod_parametro = 'SMLMV'               THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'AUX_TRANSPORTE'       THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'PCT_SALUD'            THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'PCT_PENSION'          THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'PCT_FONDO_SOLIDARIDAD'THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'UMBRAL_FONDO_SMLMV'   THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'RECARGO_NOCTURNO'     THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'RECARGO_DOMINICAL'    THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'RECARGO_NOCT_DOM'     THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'RET_SERVICIOS'        THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'BONO_CLIMA_SMA'       THEN valor_numerico END),
                   MAX(CASE WHEN cod_parametro = 'APORTE_VOL_BOG'       THEN valor_numerico END)
            INTO g_cache.smlmv, g_cache.aux_transporte,
                 g_cache.pct_salud, g_cache.pct_pension,
                 g_cache.pct_fondo_solid, g_cache.umbral_fondo_smlmv,
                 g_cache.rec_nocturno, g_cache.rec_dominical,
                 g_cache.rec_noct_dom, g_cache.ret_servicios,
                 g_cache.bono_clima_sma, g_cache.aporte_vol_bog
            FROM PARAMETROS;

            g_inicializado := TRUE;
        END IF;
    END inicializar_cache;

    -- SMLMV público
    FUNCTION fn_get_smlmv RETURN NUMBER IS
    BEGIN
        inicializar_cache;
        RETURN g_cache.smlmv;
    END fn_get_smlmv;

    -- Salario quincenal (privado)
    FUNCTION fn_salario_base_q(p_empleado NUMBER, p_quincena VARCHAR2) RETURN NUMBER IS
        w_contrato   EMPLEADOS.tipo_contrato%TYPE;
        w_sal_base   EMPLEADOS.salario_base%TYPE;
        w_horas_norm NUMBER := 0;
        w_resultado  NUMBER := 0;
    BEGIN
        inicializar_cache;
        SELECT tipo_contrato, salario_base INTO w_contrato, w_sal_base
        FROM EMPLEADOS WHERE id_empleado = p_empleado;

        IF w_contrato = 'PLANTA' THEN
            w_resultado := w_sal_base / 2;
        ELSIF w_contrato = 'TEMPORAL' THEN
            SELECT NVL(SUM(cantidad_horas), 0) INTO w_horas_norm
            FROM HORAS_TRABAJADAS
            WHERE id_empleado = p_empleado AND id_quincena = p_quincena AND tipo_hora = 'NORMAL';
            w_resultado := w_sal_base * w_horas_norm;
        ELSIF w_contrato = 'SERVICIOS' THEN
            w_resultado := (w_sal_base - (w_sal_base * g_cache.ret_servicios / 100)) / 2;
        END IF;

        RETURN NVL(w_resultado, 0);
    END fn_salario_base_q;

    -- Recargos (privado)
    FUNCTION fn_recargos(p_empleado NUMBER, p_quincena VARCHAR2) RETURN NUMBER IS
        w_contrato  EMPLEADOS.tipo_contrato%TYPE;
        w_sal_base  EMPLEADOS.salario_base%TYPE;
        w_val_hora  NUMBER := 0;
        w_total     NUMBER := 0;
        CURSOR cur_h IS
            SELECT tipo_hora, cantidad_horas
            FROM HORAS_TRABAJADAS
            WHERE id_empleado = p_empleado AND id_quincena = p_quincena
              AND tipo_hora IN ('NOCTURNA', 'DOMINICAL', 'NOCTURNA_DOM');
    BEGIN
        inicializar_cache;
        SELECT tipo_contrato, salario_base INTO w_contrato, w_sal_base
        FROM EMPLEADOS WHERE id_empleado = p_empleado;

        IF w_contrato = 'SERVICIOS' THEN RETURN 0; END IF;

        w_val_hora := CASE w_contrato WHEN 'PLANTA' THEN w_sal_base / 240 ELSE w_sal_base END;

        FOR fila IN cur_h LOOP
            CASE fila.tipo_hora
                WHEN 'NOCTURNA'     THEN w_total := w_total + fila.cantidad_horas * w_val_hora * g_cache.rec_nocturno  / 100;
                WHEN 'DOMINICAL'    THEN w_total := w_total + fila.cantidad_horas * w_val_hora * g_cache.rec_dominical / 100;
                WHEN 'NOCTURNA_DOM' THEN w_total := w_total + fila.cantidad_horas * w_val_hora * g_cache.rec_noct_dom  / 100;
            END CASE;
        END LOOP;

        RETURN NVL(w_total, 0);
    END fn_recargos;

    -- Bonificación (privado)
    FUNCTION fn_bonificacion(p_empleado NUMBER) RETURN NUMBER IS
        w_ingreso    EMPLEADOS.fecha_ingreso%TYPE;
        w_contrato   EMPLEADOS.tipo_contrato%TYPE;
        w_antiguedad NUMBER;
        w_porcentaje NUMBER := 0;
        w_sanciones  NUMBER;
        w_sal_q      NUMBER;
    BEGIN
        SELECT fecha_ingreso, tipo_contrato INTO w_ingreso, w_contrato
        FROM EMPLEADOS WHERE id_empleado = p_empleado;

        IF w_contrato = 'SERVICIOS' THEN RETURN 0; END IF;

        w_antiguedad := TRUNC(MONTHS_BETWEEN(SYSDATE, w_ingreso) / 12);

        IF    w_antiguedad BETWEEN 3 AND 5  THEN w_porcentaje := 3;
        ELSIF w_antiguedad BETWEEN 6 AND 10 THEN w_porcentaje := 6;
        ELSIF w_antiguedad > 10             THEN w_porcentaje := 10;
        END IF;

        SELECT COUNT(*) INTO w_sanciones
        FROM SANCIONES
        WHERE id_empleado = p_empleado AND fecha_sancion >= ADD_MONTHS(SYSDATE, -6);

        IF w_sanciones > 2 THEN w_porcentaje := 0; END IF;

        w_sal_q := fn_salario_base_q(p_empleado, '2026-Q1-ENE');
        RETURN w_sal_q * w_porcentaje / 100;
    END fn_bonificacion;

    -- Auxilio de transporte (privado)
    FUNCTION fn_auxilio_transporte(p_empleado NUMBER, p_quincena VARCHAR2) RETURN NUMBER IS
        w_contrato  EMPLEADOS.tipo_contrato%TYPE;
        w_sal_base  EMPLEADOS.salario_base%TYPE;
        w_sal_mens  NUMBER;
        w_horas_norm NUMBER := 0;
    BEGIN
        inicializar_cache;
        SELECT tipo_contrato, salario_base INTO w_contrato, w_sal_base
        FROM EMPLEADOS WHERE id_empleado = p_empleado;

        IF w_contrato = 'SERVICIOS' THEN RETURN 0; END IF;

        IF w_contrato = 'PLANTA' THEN
            w_sal_mens := w_sal_base;
        ELSE
            SELECT NVL(SUM(cantidad_horas), 0) INTO w_horas_norm
            FROM HORAS_TRABAJADAS
            WHERE id_empleado = p_empleado AND id_quincena = p_quincena AND tipo_hora = 'NORMAL';
            w_sal_mens := w_sal_base * w_horas_norm * 2;
        END IF;

        RETURN CASE WHEN w_sal_mens <= 2 * g_cache.smlmv THEN g_cache.aux_transporte / 2 ELSE 0 END;
    END fn_auxilio_transporte;

    -- Bono por sede (privado)
    FUNCTION fn_bono_sede(p_empleado NUMBER) RETURN NUMBER IS
        w_sede     EMPLEADOS.cod_sede%TYPE;
        w_contrato EMPLEADOS.tipo_contrato%TYPE;
    BEGIN
        inicializar_cache;
        SELECT cod_sede, tipo_contrato INTO w_sede, w_contrato
        FROM EMPLEADOS WHERE id_empleado = p_empleado;

        IF w_contrato IN ('PLANTA', 'TEMPORAL') AND w_sede = 'SMA' THEN
            RETURN g_cache.bono_clima_sma;
        END IF;
        RETURN 0;
    END fn_bono_sede;

    -- Bruto total (privado)
    FUNCTION fn_bruto(p_empleado NUMBER, p_quincena VARCHAR2) RETURN NUMBER IS
    BEGIN
        RETURN NVL(fn_salario_base_q(p_empleado, p_quincena), 0)
             + NVL(fn_recargos(p_empleado, p_quincena), 0)
             + NVL(fn_bonificacion(p_empleado), 0)
             + NVL(fn_auxilio_transporte(p_empleado, p_quincena), 0)
             + NVL(fn_bono_sede(p_empleado), 0);
    END fn_bruto;

    -- Deducciones (privado)
    FUNCTION fn_deducciones(p_empleado NUMBER, p_bruto NUMBER, p_quincena VARCHAR2)
    RETURN t_ded_resultado IS
        w_res          t_ded_resultado;
        w_bruto_mens   NUMBER;
        w_base_embargo NUMBER;
        w_porc_embargo NUMBER := 0;
        w_contrato     EMPLEADOS.tipo_contrato%TYPE;
        w_sede         EMPLEADOS.cod_sede%TYPE;
        w_acepta       EMPLEADOS.acepta_aporte_vol%TYPE;
    BEGIN
        inicializar_cache;
        w_res.salud   := p_bruto * g_cache.pct_salud   / 100;
        w_res.pension := p_bruto * g_cache.pct_pension  / 100;

        w_bruto_mens := p_bruto * 2;
        w_res.fondo_solid := CASE
            WHEN w_bruto_mens > g_cache.umbral_fondo_smlmv * g_cache.smlmv
            THEN p_bruto * g_cache.pct_fondo_solid / 100
            ELSE 0 END;

        SELECT NVL(SUM(porcentaje), 0) INTO w_porc_embargo
        FROM EMBARGOS WHERE id_empleado = p_empleado AND estado = 'ACTIVO';

        w_base_embargo  := p_bruto - w_res.salud - w_res.pension - w_res.fondo_solid;
        w_res.embargo   := w_base_embargo * w_porc_embargo / 100;

        SELECT NVL(SUM(cuota_mensual), 0) INTO w_res.libranzas
        FROM LIBRANZAS WHERE id_empleado = p_empleado AND estado = 'ACTIVA';
        w_res.libranzas := w_res.libranzas / 2;

        SELECT tipo_contrato, cod_sede, acepta_aporte_vol
        INTO w_contrato, w_sede, w_acepta
        FROM EMPLEADOS WHERE id_empleado = p_empleado;

        w_res.aporte_vol := CASE
            WHEN w_contrato IN ('PLANTA','TEMPORAL') AND w_sede = 'BOG' AND w_acepta = 'S'
            THEN g_cache.aporte_vol_bog ELSE 0 END;

        w_res.total := w_res.salud + w_res.pension + w_res.fondo_solid
                     + w_res.embargo + w_res.libranzas + w_res.aporte_vol;
        RETURN w_res;
    END fn_deducciones;

    -- Liquidar un empleado (con validaciones)
    PROCEDURE sp_liquidar_quincena(p_id_empleado NUMBER, p_id_quincena VARCHAR2) IS
        w_existe NUMBER;
        w_estado EMPLEADOS.estado%TYPE;
        w_ya_liq NUMBER;
        w_bruto  NUMBER;
        w_ded    t_ded_resultado;
        w_neto   NUMBER;
    BEGIN
        SELECT COUNT(*) INTO w_existe FROM EMPLEADOS WHERE id_empleado = p_id_empleado;
        IF w_existe = 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'Empleado no encontrado: ' || p_id_empleado);
        END IF;

        SELECT estado INTO w_estado FROM EMPLEADOS WHERE id_empleado = p_id_empleado;
        IF w_estado != 'ACTIVO' THEN
            RAISE_APPLICATION_ERROR(-20002, 'Empleado inactivo: estado = ' || w_estado);
        END IF;

        SELECT COUNT(*) INTO w_ya_liq
        FROM LIQUIDACION
        WHERE id_empleado = p_id_empleado AND id_quincena = p_id_quincena;

        IF w_ya_liq > 0 THEN
            RAISE_APPLICATION_ERROR(-20003,
                'Ya existe liquidación para empleado ' || p_id_empleado ||
                ' quincena ' || p_id_quincena);
        END IF;

        w_bruto := fn_bruto(p_id_empleado, p_id_quincena);
        w_ded   := fn_deducciones(p_id_empleado, w_bruto, p_id_quincena);
        w_neto  := w_bruto - w_ded.total;

        -- Ajuste neto negativo
        IF w_neto < 0 THEN
            w_ded.embargo := 0;
            w_ded.total   := w_ded.salud + w_ded.pension + w_ded.fondo_solid + w_ded.embargo + w_ded.libranzas + w_ded.aporte_vol;
            w_neto        := w_bruto - w_ded.total;

            IF w_neto < 0 THEN
                w_ded.libranzas := 0;
                w_ded.total     := w_ded.salud + w_ded.pension + w_ded.fondo_solid + w_ded.embargo + w_ded.libranzas + w_ded.aporte_vol;
                w_neto          := w_bruto - w_ded.total;
                sp_log_nomina('ALERTA_NETO_NEGATIVO',
                    'Empleado ' || p_id_empleado || ' neto: ' || w_neto, 0, 1, 0);
            END IF;
        END IF;

        INSERT INTO LIQUIDACION VALUES (
            SEQ_LIQUIDACION.NEXTVAL, p_id_empleado, p_id_quincena,
            fn_salario_base_q(p_id_empleado, p_id_quincena),
            fn_recargos(p_id_empleado, p_id_quincena),
            fn_bonificacion(p_id_empleado),
            fn_auxilio_transporte(p_id_empleado, p_id_quincena),
            fn_bono_sede(p_id_empleado),
            w_bruto, w_ded.salud, w_ded.pension, w_ded.fondo_solid,
            w_ded.embargo, w_ded.libranzas, w_ded.aporte_vol,
            w_ded.total, w_neto, SYSDATE
        );
        COMMIT;
        sp_log_nomina('LIQUIDACION_OK', 'Empleado ' || p_id_empleado, 1, 0, w_neto);

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            sp_log_nomina('ERROR_LIQUIDACION', SQLERRM, 0, 1, 0);
            RAISE;
    END sp_liquidar_quincena;

    -- Liquidación masiva con BULK COLLECT y FORALL (punto 6)
    PROCEDURE sp_liquidar_quincena(p_id_quincena VARCHAR2) IS
        w_ids        t_ids_tabla;
        w_lotes      t_lista_liq;
        w_ok         NUMBER := 0;
        w_errores    NUMBER := 0;
        w_tot_neto   NUMBER := 0;

        CURSOR cur_activos IS
            SELECT e.id_empleado
            FROM EMPLEADOS e
            WHERE e.estado = 'ACTIVO'
              AND NOT EXISTS (
                  SELECT 1 FROM LIQUIDACION l
                  WHERE l.id_empleado = e.id_empleado
                    AND l.id_quincena = p_id_quincena
              );
    BEGIN
        inicializar_cache;

        OPEN cur_activos;
        FETCH cur_activos BULK COLLECT INTO w_ids;
        CLOSE cur_activos;

        FOR i IN 1..w_ids.COUNT LOOP
            BEGIN
                DECLARE
                    w_bruto NUMBER;
                    w_ded   t_ded_resultado;
                    w_neto  NUMBER;
                    w_sbq   NUMBER; w_rec NUMBER; w_bon NUMBER;
                    w_aux   NUMBER; w_bns NUMBER;
                BEGIN
                    w_sbq   := fn_salario_base_q(w_ids(i), p_id_quincena);
                    w_rec   := fn_recargos(w_ids(i), p_id_quincena);
                    w_bon   := fn_bonificacion(w_ids(i));
                    w_aux   := fn_auxilio_transporte(w_ids(i), p_id_quincena);
                    w_bns   := fn_bono_sede(w_ids(i));
                    w_bruto := w_sbq + w_rec + w_bon + w_aux + w_bns;
                    w_ded   := fn_deducciones(w_ids(i), w_bruto, p_id_quincena);
                    w_neto  := w_bruto - w_ded.total;

                    IF w_neto < 0 THEN
                        w_ded.embargo := 0;
                        w_ded.total   := w_ded.salud + w_ded.pension + w_ded.fondo_solid + w_ded.embargo + w_ded.libranzas + w_ded.aporte_vol;
                        w_neto        := w_bruto - w_ded.total;

                        IF w_neto < 0 THEN
                            w_ded.libranzas := 0;
                            w_ded.total     := w_ded.salud + w_ded.pension + w_ded.fondo_solid + w_ded.embargo + w_ded.libranzas + w_ded.aporte_vol;
                            w_neto          := w_bruto - w_ded.total;
                        END IF;
                    END IF;

                    w_lotes(i).id_empleado        := w_ids(i);
                    w_lotes(i).id_quincena        := p_id_quincena;
                    w_lotes(i).salario_base_q     := w_sbq;
                    w_lotes(i).recargos           := w_rec;
                    w_lotes(i).bonificacion       := w_bon;
                    w_lotes(i).auxilio_transp     := w_aux;
                    w_lotes(i).bono_sede          := w_bns;
                    w_lotes(i).bruto              := w_bruto;
                    w_lotes(i).deduccion_salud    := w_ded.salud;
                    w_lotes(i).deduccion_pension  := w_ded.pension;
                    w_lotes(i).fondo_solidaridad  := w_ded.fondo_solid;
                    w_lotes(i).embargo            := w_ded.embargo;
                    w_lotes(i).libranzas          := w_ded.libranzas;
                    w_lotes(i).aporte_voluntario  := w_ded.aporte_vol;
                    w_lotes(i).total_deducciones  := w_ded.total;
                    w_lotes(i).neto               := w_neto;
                    w_ok       := w_ok + 1;
                    w_tot_neto := w_tot_neto + w_neto;
                EXCEPTION
                    WHEN OTHERS THEN
                        w_errores := w_errores + 1;
                        sp_log_nomina('ERROR_BULK', 'Emp ' || w_ids(i) || ': ' || SQLERRM, 0, 1, 0);
                END;
            END;
        END LOOP;

        FORALL i IN 1..w_lotes.COUNT SAVE EXCEPTIONS
            INSERT INTO LIQUIDACION VALUES (
                SEQ_LIQUIDACION.NEXTVAL,
                w_lotes(i).id_empleado,       w_lotes(i).id_quincena,
                w_lotes(i).salario_base_q,    w_lotes(i).recargos,
                w_lotes(i).bonificacion,      w_lotes(i).auxilio_transp,
                w_lotes(i).bono_sede,         w_lotes(i).bruto,
                w_lotes(i).deduccion_salud,   w_lotes(i).deduccion_pension,
                w_lotes(i).fondo_solidaridad, w_lotes(i).embargo,
                w_lotes(i).libranzas,         w_lotes(i).aporte_voluntario,
                w_lotes(i).total_deducciones, w_lotes(i).neto, SYSDATE
            );

        COMMIT;
        DBMS_OUTPUT.PUT_LINE('OK: ' || w_ok || ' | Errores: ' || w_errores);
        sp_log_nomina('LIQUIDACION_MASIVA', 'Quincena ' || p_id_quincena, w_ok, w_errores, w_tot_neto);

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            sp_log_nomina('ERROR_MASIVO', SQLERRM, 0, w_ids.COUNT, 0);
            RAISE;
    END sp_liquidar_quincena;

    -- Total neto por sede
    FUNCTION fn_total_nomina_sede(p_cod_sede VARCHAR2, p_id_quincena VARCHAR2) RETURN NUMBER IS
        w_total NUMBER;
    BEGIN
        SELECT NVL(SUM(l.neto), 0) INTO w_total
        FROM LIQUIDACION l
        JOIN EMPLEADOS e ON l.id_empleado = e.id_empleado
        WHERE e.cod_sede = p_cod_sede AND l.id_quincena = p_id_quincena;
        RETURN w_total;
    END fn_total_nomina_sede;

    -- Reporte pipelined (punto 7)
    FUNCTION fn_reporte_nomina(
        p_cod_sede      VARCHAR2 DEFAULT NULL,
        p_tipo_contrato VARCHAR2 DEFAULT NULL
    ) RETURN t_tabla_reporte PIPELINED IS
        w_sql    VARCHAR2(4000);
        w_cursor SYS_REFCURSOR;
        w_fila   t_fila_reporte;
    BEGIN
        w_sql := 'SELECT l.id_liquidacion, l.id_empleado, e.nombre, e.cod_sede,
                         l.id_quincena, l.bruto, l.neto
                  FROM LIQUIDACION l
                  JOIN EMPLEADOS e ON l.id_empleado = e.id_empleado
                  WHERE 1=1';

        IF p_cod_sede      IS NOT NULL THEN w_sql := w_sql || ' AND e.cod_sede = :sede';      END IF;
        IF p_tipo_contrato IS NOT NULL THEN w_sql := w_sql || ' AND e.tipo_contrato = :tipo'; END IF;

        OPEN w_cursor FOR w_sql USING p_cod_sede, p_tipo_contrato;
        LOOP
            FETCH w_cursor INTO w_fila.id_liquidacion, w_fila.id_empleado,
                                w_fila.nombre_empleado, w_fila.cod_sede,
                                w_fila.id_quincena, w_fila.bruto, w_fila.neto;
            EXIT WHEN w_cursor%NOTFOUND;
            PIPE ROW(w_fila);
        END LOOP;
        CLOSE w_cursor;
        RETURN;
    END fn_reporte_nomina;

    -- Log con transacción autónoma (punto 8)
    PROCEDURE sp_log_nomina(
        p_operation      VARCHAR2,
        p_detalle        VARCHAR2,
        p_empleados_ok   NUMBER DEFAULT 0,
        p_empleados_error NUMBER DEFAULT 0,
        p_monto_total    NUMBER DEFAULT 0
    ) IS
        PRAGMA AUTONOMOUS_TRANSACTION;
    BEGIN
        INSERT INTO LOG_NOMINA (
            id_log, fecha_hora, operacion, usuario,
            detalle, empleados_ok, empleados_error, monto_total
        ) VALUES (
            SEQ_LOG.NEXTVAL, SYSTIMESTAMP, p_operation, USER,
            p_detalle, p_empleados_ok, p_empleados_error, p_monto_total
        );
        COMMIT;
    END sp_log_nomina;

BEGIN
    inicializar_cache;
END PKG_NOMINA;
/

-- ======================================================================
-- SECCIÓN 5: Compound Trigger sobre LIQUIDACION
-- ======================================================================

CREATE OR REPLACE TRIGGER trg_ctrl_liquidacion
FOR INSERT ON LIQUIDACION
COMPOUND TRIGGER

    TYPE t_tabla_ajustes IS TABLE OF NUMBER INDEX BY PLS_INTEGER;
    v_ajustes t_tabla_ajustes;
    v_pos     NUMBER := 0;

    BEFORE EACH ROW IS
        w_bruto_orig  NUMBER;
        w_neto_calc   NUMBER;
        w_ded_calc    NUMBER;
    BEGIN
        IF :NEW.salario_base_q < 0 THEN
            RAISE_APPLICATION_ERROR(-20010, 'El salario base no puede ser negativo');
        END IF;

        IF :NEW.neto < 0 THEN
            w_bruto_orig := :NEW.bruto;
            w_neto_calc  := :NEW.neto;
            w_ded_calc   := :NEW.total_deducciones;

            :NEW.embargo := 0;
            w_ded_calc   := :NEW.deduccion_salud + :NEW.deduccion_pension + :NEW.fondo_solidaridad
                          + :NEW.embargo + :NEW.libranzas + :NEW.aporte_voluntario;
            w_neto_calc  := w_bruto_orig - w_ded_calc;

            IF w_neto_calc < 0 THEN
                :NEW.libranzas := 0;
                w_ded_calc     := :NEW.deduccion_salud + :NEW.deduccion_pension + :NEW.fondo_solidaridad
                                + :NEW.embargo + :NEW.libranzas + :NEW.aporte_voluntario;
                w_neto_calc    := w_bruto_orig - w_ded_calc;
            END IF;

            :NEW.total_deducciones := w_ded_calc;
            :NEW.neto              := w_neto_calc;

            v_pos           := v_pos + 1;
            v_ajustes(v_pos) := :NEW.id_empleado;
        END IF;
    END BEFORE EACH ROW;

    AFTER EACH ROW IS
    BEGIN
        IF v_ajustes.EXISTS(v_pos) AND v_ajustes(v_pos) = :NEW.id_empleado THEN
            INSERT INTO LOG_NOMINA (id_log, fecha_hora, operacion, usuario, detalle)
            VALUES (SEQ_LOG.NEXTVAL, SYSTIMESTAMP, 'ALERTA_NETO_NEGATIVO', USER,
                    'Ajuste aplicado al empleado ' || :NEW.id_empleado ||
                    ' | Neto final: ' || :NEW.neto);
        END IF;

        UPDATE LIBRANZAS
        SET saldo_pendiente = saldo_pendiente - (:NEW.libranzas),
            estado = CASE
                        WHEN saldo_pendiente - (:NEW.libranzas) <= 0 THEN 'PAGADA'
                        ELSE estado
                     END
        WHERE id_empleado = :NEW.id_empleado AND estado = 'ACTIVA';
    END AFTER EACH ROW;

    AFTER STATEMENT IS
    BEGIN
        INSERT INTO LOG_NOMINA (id_log, fecha_hora, operacion, usuario, detalle)
        VALUES (SEQ_LOG.NEXTVAL, SYSTIMESTAMP, 'BATCH_LIQUIDACION', USER,
                'Inserción completada: ' || TO_CHAR(SYSTIMESTAMP, 'HH24:MI:SS.FF3'));
    END AFTER STATEMENT;

END trg_ctrl_liquidacion;
/

-- ======================================================================
-- BLOQUE DE PRUEBA FINAL
-- ======================================================================

BEGIN
    EXECUTE IMMEDIATE 'DELETE FROM LIQUIDACION';
    EXECUTE IMMEDIATE 'DELETE FROM LOG_NOMINA';
    COMMIT;

    PKG_NOMINA.sp_liquidar_quincena('2026-Q1-ENE');

    DBMS_OUTPUT.PUT_LINE(CHR(10) || '=== RESUMEN DE LIQUIDACIONES ===');
    FOR reg IN (
        SELECT l.id_empleado, e.nombre, l.bruto, l.neto
        FROM LIQUIDACION l
        JOIN EMPLEADOS e ON l.id_empleado = e.id_empleado
        ORDER BY l.id_empleado
    ) LOOP
        DBMS_OUTPUT.PUT_LINE(
            'Emp. ' || reg.id_empleado || ' - ' || reg.nombre ||
            ' | Bruto: ' || TO_CHAR(reg.bruto, '999,999,999.00') ||
            ' | Neto: '  || TO_CHAR(reg.neto,  '999,999,999.00')
        );
    END LOOP;
END;
/
```
## Evidencia Cursores

En esta actividad se desarrolló el manejo de cursores explícitos e implícitos en PL/SQL utilizando Oracle Database. El ejercicio consistió en consultar información de empleados, departamentos y cargos desde varias tablas relacionadas, recorriendo los registros mediante ciclos para mostrar resultados formateados con `DBMS_OUTPUT`. Además, se calcularon métricas como el total de empleados, el valor total de nómina y el tiempo de ejecución del proceso. También se implementó manejo de excepciones para controlar errores durante la ejecución y garantizar el cierre correcto de los cursores.

```sql
SET SERVEROUTPUT ON;

DECLARE

  vv_total_nomina  NUMBER(12,2) := 0;
  vv_contador      NUMBER       := 0;
  vv_inicio        TIMESTAMP;
  vv_fin           TIMESTAMP;
  vv_segundos      NUMBER;


  vv_nombre_completo  VARCHAR2(50);
  vv_departamento     VARCHAR2(30);
  vv_cargo            VARCHAR2(35);
  vv_salario          NUMBER(8,2);


  CURSOR vv_cursor_empleados IS
    SELECT e.first_name || ' ' || e.last_name AS nombre_completo,
           d.department_name                   AS departamento,
           j.job_title                         AS cargo,
           e.salary                            AS salario
    FROM   employees   e,
           departments d,
           jobs        j
    WHERE  e.department_id = d.department_id
    AND    e.job_id        = j.job_id
    ORDER BY e.department_id, e.salary DESC;

BEGIN
  vv_inicio := SYSTIMESTAMP;


  OPEN vv_cursor_empleados;

  LOOP
    FETCH vv_cursor_empleados
      INTO vv_nombre_completo,
           vv_departamento,
           vv_cargo,
           vv_salario;

    EXIT WHEN vv_cursor_empleados%NOTFOUND;

    vv_contador     := vv_contador + 1;
    vv_total_nomina := vv_total_nomina + vv_salario;

    DBMS_OUTPUT.PUT_LINE(
      LPAD(vv_contador, 3)              || ' | ' ||
      RPAD(vv_nombre_completo, 22)      || ' | ' ||
      RPAD(vv_departamento, 20)         || ' | ' ||
      RPAD(vv_cargo, 30)                || ' | ' ||
      TO_CHAR(vv_salario, '999,999')
    );
  END LOOP;

  CLOSE vv_cursor_empleados;

  vv_fin      := SYSTIMESTAMP;
  vv_segundos := EXTRACT(SECOND FROM (vv_fin - vv_inicio));

  DBMS_OUTPUT.PUT_LINE('----------------------------------------');
  DBMS_OUTPUT.PUT_LINE('Total empleados : ' || vv_contador);
  DBMS_OUTPUT.PUT_LINE('Total nomina    : ' || TO_CHAR(vv_total_nomina, '999,999,999'));
  DBMS_OUTPUT.PUT_LINE('Tiempo (seg)    : ' || vv_segundos);

EXCEPTION
  WHEN OTHERS THEN
    IF vv_cursor_empleados%ISOPEN THEN
      CLOSE vv_cursor_empleados;
    END IF;
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/



---implicito
SET SERVEROUTPUT ON;

DECLARE
  vv_nombre_completo  VARCHAR2(50);
  vv_departamento     VARCHAR2(30);
  vv_cargo            VARCHAR2(35);
  vv_salario          NUMBER(8,2);
  vv_total_nomina     NUMBER(12,2) := 0;
  vv_contador         NUMBER       := 0;
  vv_inicio           TIMESTAMP;
  vv_fin              TIMESTAMP;
  vv_segundos         NUMBER;

BEGIN
  vv_inicio := SYSTIMESTAMP;

  FOR vv_reg IN (
    SELECT e.first_name || ' ' || e.last_name AS nombre_completo,
           d.department_name                   AS departamento,
           j.job_title                         AS cargo,
           e.salary                            AS salario
    FROM   employees   e,
           departments d,
           jobs        j
    WHERE  e.department_id = d.department_id
    AND    e.job_id        = j.job_id
    ORDER BY e.department_id, e.salary DESC
  ) LOOP

    vv_contador    := vv_contador + 1;
    vv_total_nomina := vv_total_nomina + vv_reg.salario;

    DBMS_OUTPUT.PUT_LINE(
      LPAD(vv_contador, 3)              || ' | ' ||
      RPAD(vv_reg.nombre_completo, 22)  || ' | ' ||
      RPAD(vv_reg.departamento, 20)     || ' | ' ||
      RPAD(vv_reg.cargo, 30)            || ' | ' ||
      TO_CHAR(vv_reg.salario, '999,999')
    );
  END LOOP;

  vv_fin      := SYSTIMESTAMP;
  vv_segundos := EXTRACT(SECOND FROM (vv_fin - vv_inicio));

  DBMS_OUTPUT.PUT_LINE('----------------------------------------');
  DBMS_OUTPUT.PUT_LINE('Total empleados : ' || vv_contador);
  DBMS_OUTPUT.PUT_LINE('Total nomina    : ' || TO_CHAR(vv_total_nomina, '999,999,999'));
  DBMS_OUTPUT.PUT_LINE('Tiempo (seg)    : ' || vv_segundos);

EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/
```

## 