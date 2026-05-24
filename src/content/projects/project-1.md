---
title: 'SQL'
description: Evidencias SQL.
publishDate: 'Feb 15 2026'
seo:
  image:
    src: '../../assets/images/project-1.jpg'
    alt: Imagen SQL
---

## Evidencia Clase 25 de Febrero

```sql
CREATE TABLE regions
    ( region_id      NUMBER 
       CONSTRAINT  region_id_nn NOT NULL 
    , region_name    VARCHAR2(25) 
    );

CREATE UNIQUE INDEX reg_id_pk
ON regions (region_id);

ALTER TABLE regions
ADD ( CONSTRAINT reg_id_pk
       		 PRIMARY KEY (region_id)
    ) ;
    
CREATE TABLE countries 
    ( country_id      CHAR(2) 
       CONSTRAINT  country_id_nn NOT NULL 
    , country_name    VARCHAR2(60) 
    , region_id       NUMBER 
    , CONSTRAINT     country_c_id_pk 
        	     PRIMARY KEY (country_id) 
    ) 
    ORGANIZATION INDEX; 

ALTER TABLE countries
ADD ( CONSTRAINT countr_reg_fk
        	 FOREIGN KEY (region_id)
          	  REFERENCES regions(region_id) 
    ) ;
    
CREATE TABLE locations
    ( location_id    NUMBER(4)
    , street_address VARCHAR2(40)
    , postal_code    VARCHAR2(12)
    , city       VARCHAR2(30)
	CONSTRAINT     loc_city_nn  NOT NULL
    , state_province VARCHAR2(25)
    , country_id     CHAR(2)
    ) ;

CREATE UNIQUE INDEX loc_id_pk
ON locations (location_id) ;

ALTER TABLE locations
ADD ( CONSTRAINT loc_id_pk
       		 PRIMARY KEY (location_id)
    , CONSTRAINT loc_c_id_fk
       		 FOREIGN KEY (country_id)
        	  REFERENCES countries(country_id) 
    ) ;
    
    
CREATE SEQUENCE locations_seq
 START WITH     3300
 INCREMENT BY   100
 MAXVALUE       9900
 NOCACHE
 NOCYCLE;
 
 CREATE TABLE departments
    ( department_id    NUMBER(4)
    , department_name  VARCHAR2(30)
	CONSTRAINT  dept_name_nn  NOT NULL
    , manager_id       NUMBER(6)
    , location_id      NUMBER(4)
    ) ;

CREATE UNIQUE INDEX dept_id_pk
ON departments (department_id) ;

ALTER TABLE departments
ADD ( CONSTRAINT dept_id_pk
       		 PRIMARY KEY (department_id)
    , CONSTRAINT dept_loc_fk
       		 FOREIGN KEY (location_id)
        	  REFERENCES locations (location_id)
     ) ;
     
     
     
CREATE SEQUENCE departments_seq
 START WITH     280
 INCREMENT BY   10
 MAXVALUE       9990
 NOCACHE
 NOCYCLE;
 
 
 CREATE TABLE jobs
    ( job_id         VARCHAR2(10)
    , job_title      VARCHAR2(35)
	CONSTRAINT     job_title_nn  NOT NULL
    , min_salary     NUMBER(6)
    , max_salary     NUMBER(6)
    ) ;

CREATE UNIQUE INDEX job_id_pk 
ON jobs (job_id) ;

ALTER TABLE jobs
ADD ( CONSTRAINT job_id_pk
      		 PRIMARY KEY(job_id)
    ) ;
    
    
CREATE TABLE employees
    ( employee_id    NUMBER(6)
    , first_name     VARCHAR2(20)
    , last_name      VARCHAR2(25)
	 CONSTRAINT     emp_last_name_nn  NOT NULL
    , email          VARCHAR2(25)
	CONSTRAINT     emp_email_nn  NOT NULL
    , phone_number   VARCHAR2(20)
    , hire_date      DATE
	CONSTRAINT     emp_hire_date_nn  NOT NULL
    , job_id         VARCHAR2(10)
	CONSTRAINT     emp_job_nn  NOT NULL
    , salary         NUMBER(8,2)
    , commission_pct NUMBER(2,2)
    , manager_id     NUMBER(6)
    , department_id  NUMBER(4)
    , CONSTRAINT     emp_salary_min
                     CHECK (salary > 0) 
    , CONSTRAINT     emp_email_uk
                     UNIQUE (email)
    ) ;

CREATE UNIQUE INDEX emp_emp_id_pk
ON employees (employee_id) ;


ALTER TABLE employees
ADD ( CONSTRAINT     emp_emp_id_pk
                     PRIMARY KEY (employee_id)
    , CONSTRAINT     emp_dept_fk
                     FOREIGN KEY (department_id)
                      REFERENCES departments
    , CONSTRAINT     emp_job_fk
                     FOREIGN KEY (job_id)
                      REFERENCES jobs (job_id)
    , CONSTRAINT     emp_manager_fk
                     FOREIGN KEY (manager_id)
                      REFERENCES employees
    ) ;

ALTER TABLE departments
ADD ( CONSTRAINT dept_mgr_fk
      		 FOREIGN KEY (manager_id)
      		  REFERENCES employees (employee_id)
    ) ;
    
    
    
CREATE SEQUENCE employees_seq
 START WITH     207
 INCREMENT BY   1
 NOCACHE
 NOCYCLE;
 
 CREATE TABLE job_history
    ( employee_id   NUMBER(6)
	 CONSTRAINT    jhist_employee_nn  NOT NULL
    , start_date    DATE
	CONSTRAINT    jhist_start_date_nn  NOT NULL
    , end_date      DATE
	CONSTRAINT    jhist_end_date_nn  NOT NULL
    , job_id        VARCHAR2(10)
	CONSTRAINT    jhist_job_nn  NOT NULL
    , department_id NUMBER(4)
    , CONSTRAINT    jhist_date_interval
                    CHECK (end_date > start_date)
    ) ;

CREATE UNIQUE INDEX jhist_emp_id_st_date_pk 
ON job_history (employee_id, start_date) ;

ALTER TABLE job_history
ADD ( CONSTRAINT jhist_emp_id_st_date_pk
      PRIMARY KEY (employee_id, start_date)
    , CONSTRAINT     jhist_job_fk
                     FOREIGN KEY (job_id)
                     REFERENCES jobs
    , CONSTRAINT     jhist_emp_fk
                     FOREIGN KEY (employee_id)
                     REFERENCES employees
    , CONSTRAINT     jhist_dept_fk
                     FOREIGN KEY (department_id)
                     REFERENCES departments
    ) ;
    
    
CREATE OR REPLACE VIEW emp_details_view
  (employee_id,
   job_id,
   manager_id,
   department_id,
   location_id,
   country_id,
   first_name,
   last_name,
   salary,
   commission_pct,
   department_name,
   job_title,
   city,
   state_province,
   country_name,
   region_name)
AS SELECT
  e.employee_id, 
  e.job_id, 
  e.manager_id, 
  e.department_id,
  d.location_id,
  l.country_id,
  e.first_name,
  e.last_name,
  e.salary,
  e.commission_pct,
  d.department_name,
  j.job_title,
  l.city,
  l.state_province,
  c.country_name,
  r.region_name
FROM
  employees e,
  departments d,
  jobs j,
  locations l,
  countries c,
  regions r
WHERE e.department_id = d.department_id
  AND d.location_id = l.location_id
  AND l.country_id = c.country_id
  AND c.region_id = r.region_id
  AND j.job_id = e.job_id 
WITH READ ONLY;


CREATE INDEX emp_department_ix
       ON employees (department_id);

CREATE INDEX emp_job_ix
       ON employees (job_id);

CREATE INDEX emp_manager_ix
       ON employees (manager_id);

CREATE INDEX emp_name_ix
       ON employees (last_name, first_name);

CREATE INDEX dept_location_ix
       ON departments (location_id);

CREATE INDEX jhist_job_ix
       ON job_history (job_id);

CREATE INDEX jhist_employee_ix
       ON job_history (employee_id);

CREATE INDEX jhist_department_ix
       ON job_history (department_id);

CREATE INDEX loc_city_ix
       ON locations (city);

CREATE INDEX loc_state_province_ix	
       ON locations (state_province);

CREATE INDEX loc_country_ix
       ON locations (country_id);
       

COMMENT ON TABLE regions 
IS 'Regions table that contains region numbers and names. references with the Countries table.';

COMMENT ON COLUMN regions.region_id
IS 'Primary key of regions table.';

COMMENT ON COLUMN regions.region_name
IS 'Names of regions. Locations are in the countries of these regions.';

COMMENT ON TABLE locations
IS 'Locations table that contains specific address of a specific office,
warehouse, and/or production site of a company. Does not store addresses /
locations of customers. references with the departments and countries tables. ';

COMMENT ON COLUMN locations.location_id
IS 'Primary key of locations table';

COMMENT ON COLUMN locations.street_address
IS 'Street address of an office, warehouse, or production site of a company.
Contains building number and street name';

COMMENT ON COLUMN locations.postal_code
IS 'Postal code of the location of an office, warehouse, or production site 
of a company. ';

COMMENT ON COLUMN locations.city
IS 'A not null column that shows city where an office, warehouse, or 
production site of a company is located. ';

COMMENT ON COLUMN locations.state_province
IS 'State or Province where an office, warehouse, or production site of a 
company is located.';

COMMENT ON COLUMN locations.country_id
IS 'Country where an office, warehouse, or production site of a company is
located. Foreign key to country_id column of the countries table.';



COMMENT ON TABLE departments
IS 'Departments table that shows details of departments where employees 
work. references with locations, employees, and job_history tables.';

COMMENT ON COLUMN departments.department_id
IS 'Primary key column of departments table.';

COMMENT ON COLUMN departments.department_name
IS 'A not null column that shows name of a department. Administration, 
Marketing, Purchasing, Human Resources, Shipping, IT, Executive, Public 
Relations, Sales, Finance, and Accounting. ';

COMMENT ON COLUMN departments.manager_id
IS 'Manager_id of a department. Foreign key to employee_id column of employees table. The manager_id column of the employee table references this column.';

COMMENT ON COLUMN departments.location_id
IS 'Location id where a department is located. Foreign key to location_id column of locations table.';


COMMENT ON TABLE job_history
IS 'Table that stores job history of the employees. If an employee 
changes departments within the job or changes jobs within the department, 
new rows get inserted into this table with old job information of the 
employee. Contains a complex primary key: employee_id+start_date.
References with jobs, employees, and departments tables.';

COMMENT ON COLUMN job_history.employee_id
  IS 'A not null column in the complex primary key employee_id+start_date. 
Foreign key to employee_id column of the employee table';

COMMENT ON COLUMN job_history.start_date
  IS 'A not null column in the complex primary key employee_id+start_date. 
Must be less than the end_date of the job_history table. (enforced by 
constraint jhist_date_interval)';

COMMENT ON COLUMN job_history.end_date
  IS 'Last day of the employee in this job role. A not null column. Must be 
greater than the start_date of the job_history table. 
(enforced by constraint jhist_date_interval)';

COMMENT ON COLUMN job_history.job_id
  IS 'Job role in which the employee worked in the past; foreign key to 
job_id column in the jobs table. A not null column.';

COMMENT ON COLUMN job_history.department_id
  IS 'Department id in which the employee worked in the past; foreign key to deparment_id column in the departments table';


COMMENT ON TABLE countries
  IS 'country table. References with locations table.';

COMMENT ON COLUMN countries.country_id
  IS 'Primary key of countries table.';

COMMENT ON COLUMN countries.country_name
  IS 'Country name';

COMMENT ON COLUMN countries.region_id
  IS 'Region ID for the country. Foreign key to region_id column in the departments table.';


COMMENT ON TABLE jobs
  IS 'jobs table with job titles and salary ranges.
References with employees and job_history table.';

COMMENT ON COLUMN jobs.job_id
  IS 'Primary key of jobs table.';

COMMENT ON COLUMN jobs.job_title
  IS 'A not null column that shows job title, e.g. AD_VP, FI_ACCOUNTANT';

COMMENT ON COLUMN jobs.min_salary
  IS 'Minimum salary for a job title.';

COMMENT ON COLUMN jobs.max_salary
  IS 'Maximum salary for a job title';


COMMENT ON TABLE employees
  IS 'employees table. References with departments,
jobs, job_history tables. Contains a self reference.';

COMMENT ON COLUMN employees.employee_id
  IS 'Primary key of employees table.';

COMMENT ON COLUMN employees.first_name
  IS 'First name of the employee. A not null column.';

COMMENT ON COLUMN employees.last_name
  IS 'Last name of the employee. A not null column.';

COMMENT ON COLUMN employees.email
  IS 'Email id of the employee';

COMMENT ON COLUMN employees.phone_number
  IS 'Phone number of the employee; includes country code and area code';

COMMENT ON COLUMN employees.hire_date
  IS 'Date when the employee started on this job. A not null column.';

COMMENT ON COLUMN employees.job_id
  IS 'Current job of the employee; foreign key to job_id column of the 
jobs table. A not null column.';

COMMENT ON COLUMN employees.salary
  IS 'Monthly salary of the employee. Must be greater 
than zero (enforced by constraint emp_salary_min)';

COMMENT ON COLUMN employees.commission_pct
  IS 'Commission percentage of the employee; Only employees in sales 
department elgible for commission percentage';

COMMENT ON COLUMN employees.manager_id
  IS 'Manager id of the employee; has same domain as manager_id in 
departments table. Foreign key to employee_id column of employees table. 
(useful for reflexive joins and CONNECT BY query)';

COMMENT ON COLUMN employees.department_id
  IS 'Department id where employee works; foreign key to department_id 
column of the departments table';

GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO afegonzalezg;
GRANT SELECT, INSERT, UPDATE, DELETE ON regions TO afegonzalezg;
GRANT SELECT, INSERT, UPDATE, DELETE ON countries TO afegonzalezg;
GRANT SELECT, INSERT, UPDATE, DELETE ON locations TO afegonzalezg;
GRANT SELECT, INSERT, UPDATE, DELETE ON departments TO afegonzalezg;
GRANT SELECT, INSERT, UPDATE, DELETE ON jobs TO afegonzalezg;
GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO afegonzalezg;
GRANT SELECT, INSERT, UPDATE, DELETE ON job_history TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON regions TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON countries TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON locations TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON departments TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON jobs TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON job_history TO sscalero;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_payroll_types TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_payroll_types TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_concepts TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_concepts TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_periods TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_periods TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_emp_contracts TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_emp_contracts TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_time_entries TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_time_entries TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_leave_requests TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_leave_requests TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_emp_events TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_emp_events TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_payslips TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_payslips TO afegonzalezg;

GRANT SELECT, INSERT, UPDATE, DELETE ON pay_payslip_lines TO sscalero;
GRANT SELECT, INSERT, UPDATE, DELETE ON pay_payslip_lines TO afegonzalezg;


BEGIN
  INSERT INTO regions VALUES
      ( 10
      , 'Europe'
      );

  INSERT INTO regions VALUES
      ( 20
      , 'Americas'
      );

  INSERT INTO regions VALUES
      ( 30
      , 'Asia'
      );

  INSERT INTO regions VALUES
      ( 40
      , 'Oceania'
      );

  INSERT INTO regions VALUES
      ( 50
      , 'Africa'
      );
END;
/

BEGIN
  INSERT INTO countries VALUES
      ( 'IT'
      , 'Italy'
      , 10
      );

  INSERT INTO countries VALUES
      ( 'JP'
      , 'Japan'
      , 30
      );

  INSERT INTO countries VALUES
      ( 'US'
      , 'United States of America'
      , 20
      );

  INSERT INTO countries VALUES
      ( 'CA'
      , 'Canada'
      , 20
      );

  INSERT INTO countries VALUES
      ( 'CN'
      , 'China'
      , 30
      );

  INSERT INTO countries VALUES
      ( 'IN'
      , 'India'
      , 30
      );

  INSERT INTO countries VALUES
      ( 'AU'
      , 'Australia'
      , 40
      );

  INSERT INTO countries VALUES
      ( 'ZW'
      , 'Zimbabwe'
      , 50
      );

  INSERT INTO countries VALUES
      ( 'SG'
      , 'Singapore'
      , 30
      );

  INSERT INTO countries VALUES
      ( 'GB'
      , 'United Kingdom of Great Britain and Northern Ireland'
      , 10
      );

  INSERT INTO countries VALUES
      ( 'FR'
      , 'France'
      , 10
      );

  INSERT INTO countries VALUES
      ( 'DE'
      , 'Germany'
      , 10
      );

  INSERT INTO countries VALUES
      ( 'ZM'
      , 'Zambia'
      , 50
      );

  INSERT INTO countries VALUES
      ( 'EG'
      , 'Egypt'
      , 50
      );

  INSERT INTO countries VALUES
      ( 'BR'
      , 'Brazil'
      , 20
      );

  INSERT INTO countries VALUES
      ( 'CH'
      , 'Switzerland'
      , 10
      );

  INSERT INTO countries VALUES
      ( 'NL'
      , 'Netherlands'
      , 10
      );

  INSERT INTO countries VALUES
      ( 'MX'
      , 'Mexico'
      , 20
      );

  INSERT INTO countries VALUES
      ( 'KW'
      , 'Kuwait'
      , 30
      );

  INSERT INTO countries VALUES
      ( 'IL'
      , 'Israel'
      , 30
      );

  INSERT INTO countries VALUES
      ( 'DK'
      , 'Denmark'
      , 10
      );

  INSERT INTO countries VALUES
      ( 'ML'
      , 'Malaysia'
      , 30
      );

  INSERT INTO countries VALUES
      ( 'NG'
      , 'Nigeria'
      , 50
      );

  INSERT INTO countries VALUES
      ( 'AR'
      , 'Argentina'
      , 20
      );

  INSERT INTO countries VALUES
      ( 'BE'
      , 'Belgium'
      , 10
      );
END;
/



BEGIN
  INSERT INTO locations VALUES
      ( 1000
      , '1297 Via Cola di Rie'
      , '00989'
      , 'Roma'
      , NULL
      , 'IT'
      );

  INSERT INTO locations VALUES
      ( 1100
      , '93091 Calle della Testa'
      , '10934'
      , 'Venice'
      , NULL
      , 'IT'
      );

  INSERT INTO locations VALUES
      ( 1200
      , '2017 Shinjuku-ku'
      , '1689'
      , 'Tokyo'
      , 'Tokyo Prefecture'
      , 'JP'
      );

  INSERT INTO locations VALUES
      ( 1300
      , '9450 Kamiya-cho'
      , '6823'
      , 'Hiroshima'
      , NULL
      , 'JP'
      );

  INSERT INTO locations VALUES
      ( 1400
      , '2014 Jabberwocky Rd'
      , '26192'
      , 'Southlake'
      , 'Texas'
      , 'US'
      );

  INSERT INTO locations VALUES
      ( 1500
      , '2011 Interiors Blvd'
      , '99236'
      , 'South San Francisco'
      , 'California'
      , 'US'
      );

  INSERT INTO locations VALUES
      ( 1600
      , '2007 Zagora St'
      , '50090'
      , 'South Brunswick'
      , 'New Jersey'
      , 'US'
      );

  INSERT INTO locations VALUES
      ( 1700
      , '2004 Charade Rd'
      , '98199'
      , 'Seattle'
      , 'Washington'
      , 'US'
      );

  INSERT INTO locations VALUES
      ( 1800
      , '147 Spadina Ave'
      , 'M5V 2L7'
      , 'Toronto'
      , 'Ontario'
      , 'CA'
      );

  INSERT INTO locations VALUES
      ( 1900
      , '6092 Boxwood St'
      , 'YSW 9T2'
      , 'Whitehorse'
      , 'Yukon'
      , 'CA'
      );

  INSERT INTO locations VALUES
      ( 2000
      , '40-5-12 Laogianggen'
      , '190518'
      , 'Beijing'
      , NULL
      , 'CN'
      );

  INSERT INTO locations VALUES
      ( 2100
      , '1298 Vileparle (E)'
      , '490231'
      , 'Bombay'
      , 'Maharashtra'
      , 'IN'
      );

  INSERT INTO locations VALUES
      ( 2200
      , '12-98 Victoria Street'
      , '2901'
      , 'Sydney'
      , 'New South Wales'
      , 'AU'
      );

  INSERT INTO locations VALUES
      ( 2300
      , '198 Clementi North'
      , '540198'
      , 'Singapore'
      , NULL
      , 'SG'
      );

  INSERT INTO locations VALUES
      ( 2400
      , '8204 Arthur St'
      , NULL
      , 'London'
      , NULL
      , 'GB'
      );

  INSERT INTO locations VALUES
      ( 2500
      , 'Magdalen Centre, The Oxford Science Park'
      , 'OX9 9ZB'
      , 'Oxford'
      , 'Oxford'
      , 'GB'
      );

  INSERT INTO locations VALUES
      ( 2600
      , '9702 Chester Road'
      , '09629850293'
      , 'Stretford'
      , 'Manchester'
      , 'GB'
      );

  INSERT INTO locations VALUES
      ( 2700
      , 'Schwanthalerstr. 7031'
      , '80925'
      , 'Munich'
      , 'Bavaria'
      , 'DE'
      );

  INSERT INTO locations VALUES
      ( 2800
      , 'Rua Frei Caneca 1360 '
      , '01307-002'
      , 'Sao Paulo'
      , 'Sao Paulo'
      , 'BR'
      );

  INSERT INTO locations VALUES
      ( 2900
      , '20 Rue des Corps-Saints'
      , '1730'
      , 'Geneva'
      , 'Geneve'
      , 'CH'
      );

  INSERT INTO locations VALUES
      ( 3000
      , 'Murtenstrasse 921'
      , '3095'
      , 'Bern'
      , 'BE'
      , 'CH'
      );

  INSERT INTO locations VALUES
      ( 3100
      , 'Pieter Breughelstraat 837'
      , '3029SK'
      , 'Utrecht'
      , 'Utrecht'
      , 'NL'
      );

  INSERT INTO locations VALUES
      ( 3200
      , 'Mariano Escobedo 9991'
      , '11932'
      , 'Mexico City'
      , 'Distrito Federal'
      , 'MX'
      );
END;
/




ALTER TABLE departments
  DISABLE CONSTRAINT dept_mgr_fk;

BEGIN
  INSERT INTO departments VALUES
      ( 10
      , 'Administration'
      , 200
      , 1700
      );

  INSERT INTO departments VALUES
      ( 20
      , 'Marketing'
      , 201
      , 1800
      );

  INSERT INTO departments VALUES
      ( 30
      , 'Purchasing'
      , 114
      , 1700
      );

  INSERT INTO departments VALUES
      ( 40
      , 'Human Resources'
      , 203
      , 2400
      );

  INSERT INTO departments VALUES
      ( 50
      , 'Shipping'
      , 121
      , 1500
      );

  INSERT INTO departments VALUES
      ( 60
      , 'IT'
      , 103
      , 1400
      );

  INSERT INTO departments VALUES
      ( 70
      , 'Public Relations'
      , 204
      , 2700
      );

  INSERT INTO departments VALUES
      ( 80
      , 'Sales'
      , 145
      , 2500
      );

  INSERT INTO departments VALUES
      ( 90
      , 'Executive'
      , 100
      , 1700
      );

  INSERT INTO departments VALUES
      ( 100
      , 'Finance'
      , 108
      , 1700
      );

  INSERT INTO departments VALUES
      ( 110
      , 'Accounting'
      , 205
      , 1700
      );

  INSERT INTO departments VALUES
      ( 120
      , 'Treasury'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 130
      , 'Corporate Tax'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 140
      , 'Control And Credit'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 150
      , 'Shareholder Services'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 160
      , 'Benefits'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 170
      , 'Manufacturing'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 180
      , 'Construction'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 190
      , 'Contracting'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 200
      , 'Operations'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 210
      , 'IT Support'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 220
      , 'NOC'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 230
      , 'IT Helpdesk'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 240
      , 'Government Sales'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 250
      , 'Retail Sales'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 260
      , 'Recruiting'
      , NULL
      , 1700
      );

  INSERT INTO departments VALUES
      ( 270
      , 'Payroll'
      , NULL
      , 1700
      );
END;
/

REM *************************** insert data into the JOBS table

Prompt ****** Populating JOBS table ....

BEGIN
  INSERT INTO jobs VALUES
      ( 'AD_PRES'
      , 'President'
      , 20080
      , 40000
      );
  INSERT INTO jobs VALUES
      ( 'AD_VP'
      , 'Administration Vice President'
      , 15000
      , 30000
      );

  INSERT INTO jobs VALUES
      ( 'AD_ASST'
      , 'Administration Assistant'
      , 3000
      , 6000
      );

  INSERT INTO jobs VALUES
      ( 'FI_MGR'
      , 'Finance Manager'
      , 8200
      , 16000
      );

  INSERT INTO jobs VALUES
      ( 'FI_ACCOUNT'
      , 'Accountant'
      , 4200
      , 9000
      );

  INSERT INTO jobs VALUES
      ( 'AC_MGR'
      , 'Accounting Manager'
      , 8200
      , 16000
      );

  INSERT INTO jobs VALUES
      ( 'AC_ACCOUNT'
      , 'Public Accountant'
      , 4200
      , 9000
      );
  INSERT INTO jobs VALUES
      ( 'SA_MAN'
      , 'Sales Manager'
      , 10000
      , 20080
      );

  INSERT INTO jobs VALUES
      ( 'SA_REP'
      , 'Sales Representative'
      , 6000
      , 12008
      );

  INSERT INTO jobs VALUES
      ( 'PU_MAN'
      , 'Purchasing Manager'
      , 8000
      , 15000
      );

  INSERT INTO jobs VALUES
      ( 'PU_CLERK'
      , 'Purchasing Clerk'
      , 2500
      , 5500
      );

  INSERT INTO jobs VALUES
      ( 'ST_MAN'
      , 'Stock Manager'
      , 5500
      , 8500
      );
  INSERT INTO jobs VALUES
      ( 'ST_CLERK'
      , 'Stock Clerk'
      , 2008
      , 5000
      );

  INSERT INTO jobs VALUES
      ( 'SH_CLERK'
      , 'Shipping Clerk'
      , 2500
      , 5500
      );

  INSERT INTO jobs VALUES
      ( 'IT_PROG'
      , 'Programmer'
      , 4000
      , 10000
      );

  INSERT INTO jobs VALUES
      ( 'MK_MAN'
      , 'Marketing Manager'
      , 9000
      , 15000
      );

  INSERT INTO jobs VALUES
      ( 'MK_REP'
      , 'Marketing Representative'
      , 4000
      , 9000
      );

  INSERT INTO jobs VALUES
      ( 'HR_REP'
      , 'Human Resources Representative'
      , 4000
      , 9000
      );

  INSERT INTO jobs VALUES
      ( 'PR_REP'
      , 'Public Relations Representative'
      , 4500
      , 10500
      );
END;
/


REM *************************** insert data into the EMPLOYEES table

Prompt ****** Populating EMPLOYEES table ....

BEGIN
  INSERT INTO employees VALUES
      ( 100
      , 'Steven'
      , 'King'
      , 'SKING'
      , '1.515.555.0100'
      , TO_DATE('17-06-2013', 'dd-MM-yyyy')
      , 'AD_PRES'
      , 24000
      , NULL
      , NULL
      , 90
      );

  INSERT INTO employees VALUES
      ( 101
      , 'Neena'
      , 'Yang'
      , 'NYANG'
      , '1.515.555.0101'
      , TO_DATE('21-09-2015', 'dd-MM-yyyy')
      , 'AD_VP'
      , 17000
      , NULL
      , 100
      , 90
      );

  INSERT INTO employees VALUES
      ( 102
      , 'Lex'
      , 'Garcia'
      , 'LGARCIA'
      , '1.515.555.0102'
      , TO_DATE('13-01-2011', 'dd-MM-yyyy')
      , 'AD_VP'
      , 17000
      , NULL
      , 100
      , 90
      );

  INSERT INTO employees VALUES
      ( 103
      , 'Alexander'
      , 'James'
      , 'AJAMES'
      , '1.590.555.0103'
      , TO_DATE('03-01-2016', 'dd-MM-yyyy')
      , 'IT_PROG'
      , 9000
      , NULL
      , 102
      , 60
      );

  INSERT INTO employees VALUES
      ( 104
      , 'Bruce'
      , 'Miller'
      , 'BMILLER'
      , '1.590.555.0104'
      , TO_DATE('21-05-2017', 'dd-MM-yyyy')
      , 'IT_PROG'
      , 6000
      , NULL
      , 103
      , 60
      );

  INSERT INTO employees VALUES
      ( 105
      , 'David'
      , 'Williams'
      , 'DWILLIAMS'
      , '1.590.555.0105'
      , TO_DATE('25-06-2015', 'dd-MM-yyyy')
      , 'IT_PROG'
      , 4800
      , NULL
      , 103
      , 60
      );

  INSERT INTO employees VALUES
      ( 106
      , 'Valli'
      , 'Jackson'
      , 'VJACKSON'
      , '1.590.555.0106'
      , TO_DATE('05-02-2016', 'dd-MM-yyyy')
      , 'IT_PROG'
      , 4800
      , NULL
      , 103
      , 60
      );

  INSERT INTO employees VALUES
      ( 107
      , 'Diana'
      , 'Nguyen'
      , 'DNGUYEN'
      , '1.590.555.0107'
      , TO_DATE('07-02-2017', 'dd-MM-yyyy')
      , 'IT_PROG'
      , 4200
      , NULL
      , 103
      , 60
      );

  INSERT INTO employees VALUES
      ( 108
      , 'Nancy'
      , 'Gruenberg'
      , 'NGRUENBE'
      , '1.515.555.0108'
      , TO_DATE('17-08-2012', 'dd-MM-yyyy')
      , 'FI_MGR'
      , 12008
      , NULL
      , 101
      , 100
      );

  INSERT INTO employees VALUES
      ( 109
      , 'Daniel'
      , 'Faviet'
      , 'DFAVIET'
      , '1.515.555.0109'
      , TO_DATE('16-08-2012', 'dd-MM-yyyy')
      , 'FI_ACCOUNT'
      , 9000
      , NULL
      , 108
      , 100
      );

  INSERT INTO employees VALUES
      ( 110
      , 'John'
      , 'Chen'
      , 'JCHEN'
      , '1.515.555.0110'
      , TO_DATE('28-09-2015', 'dd-MM-yyyy')
      , 'FI_ACCOUNT'
      , 8200
      , NULL
      , 108
      , 100
      );

  INSERT INTO employees VALUES
      ( 111
      , 'Ismael'
      , 'Sciarra'
      , 'ISCIARRA'
      , '1.515.555.0111'
      , TO_DATE('30-09-2015', 'dd-MM-yyyy')
      , 'FI_ACCOUNT'
      , 7700
      , NULL
      , 108
      , 100
      );

  INSERT INTO employees VALUES
      ( 112
      , 'Jose Manuel'
      , 'Urman'
      , 'JMURMAN'
      , '1.515.555.0112'
      , TO_DATE('07-03-2016', 'dd-MM-yyyy')
      , 'FI_ACCOUNT'
      , 7800
      , NULL
      , 108
      , 100
      );

  INSERT INTO employees VALUES
      ( 113
      , 'Luis'
      , 'Popp'
      , 'LPOPP'
      , '1.515.555.0113'
      , TO_DATE('07-12-2017', 'dd-MM-yyyy')
      , 'FI_ACCOUNT'
      , 6900
      , NULL
      , 108
      , 100
      );

  INSERT INTO employees VALUES
      ( 114
      , 'Den'
      , 'Li'
      , 'DLI'
      , '1.515.555.0114'
      , TO_DATE('07-12-2012', 'dd-MM-yyyy')
      , 'PU_MAN'
      , 11000
      , NULL
      , 100
      , 30
      );

  INSERT INTO employees VALUES
      ( 115
      , 'Alexander'
      , 'Khoo'
      , 'AKHOO'
      , '1.515.555.0115'
      , TO_DATE('18-05-2013', 'dd-MM-yyyy')
      , 'PU_CLERK'
      , 3100
      , NULL
      , 114
      , 30
      );

  INSERT INTO employees VALUES
      ( 116
      , 'Shelli'
      , 'Baida'
      , 'SBAIDA'
      , '1.515.555.0116'
      , TO_DATE('24-12-2015', 'dd-MM-yyyy')
      , 'PU_CLERK'
      , 2900
      , NULL
      , 114
      , 30
      );

  INSERT INTO employees VALUES
      ( 117
      , 'Sigal'
      , 'Tobias'
      , 'STOBIAS'
      , '1.515.555.0117'
      , TO_DATE('24-07-2015', 'dd-MM-yyyy')
      , 'PU_CLERK'
      , 2800
      , NULL
      , 114
      , 30
      );

  INSERT INTO employees VALUES
      ( 118
      , 'Guy'
      , 'Himuro'
      , 'GHIMURO'
      , '1.515.555.0118'
      , TO_DATE('15-11-2016', 'dd-MM-yyyy')
      , 'PU_CLERK'
      , 2600
      , NULL
      , 114
      , 30
      );

  INSERT INTO employees VALUES
      ( 119
      , 'Karen'
      , 'Colmenares'
      , 'KCOLMENA'
      , '1.515.555.0119'
      , TO_DATE('10-08-2017', 'dd-MM-yyyy')
      , 'PU_CLERK'
      , 2500
      , NULL
      , 114
      , 30
      );

  INSERT INTO employees VALUES
      ( 120
      , 'Matthew'
      , 'Weiss'
      , 'MWEISS'
      , '1.650.555.0120'
      , TO_DATE('18-07-2014', 'dd-MM-yyyy')
      , 'ST_MAN'
      , 8000
      , NULL
      , 100
      , 50
      );

  INSERT INTO employees VALUES
      ( 121
      , 'Adam'
      , 'Fripp'
      , 'AFRIPP'
      , '1.650.555.0121'
      , TO_DATE('10-04-2015', 'dd-MM-yyyy')
      , 'ST_MAN'
      , 8200
      , NULL
      , 100
      , 50
      );

  INSERT INTO employees VALUES
      ( 122
      , 'Payam'
      , 'Kaufling'
      , 'PKAUFLIN'
      , '1.650.555.0122'
      , TO_DATE('01-05-2013', 'dd-MM-yyyy')
      , 'ST_MAN'
      , 7900
      , NULL
      , 100
      , 50
      );

  INSERT INTO employees VALUES
      ( 123
      , 'Shanta'
      , 'Vollman'
      , 'SVOLLMAN'
      , '1.650.555.0123'
      , TO_DATE('10-10-2015', 'dd-MM-yyyy')
      , 'ST_MAN'
      , 6500
      , NULL
      , 100
      , 50
      );

  INSERT INTO employees VALUES
      ( 124
      , 'Kevin'
      , 'Mourgos'
      , 'KMOURGOS'
      , '1.650.555.0124'
      , TO_DATE('16-11-2017', 'dd-MM-yyyy')
      , 'ST_MAN'
      , 5800
      , NULL
      , 100
      , 50
      );

  INSERT INTO employees VALUES
      ( 125
      , 'Julia'
      , 'Nayer'
      , 'JNAYER'
      , '1.650.555.0125'
      , TO_DATE('16-07-2015', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 3200
      , NULL
      , 120
      , 50
      );

  INSERT INTO employees VALUES
      ( 126
      , 'Irene'
      , 'Mikkilineni'
      , 'IMIKKILI'
      , '1.650.555.0126'
      , TO_DATE('28-09-2016', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2700
      , NULL
      , 120
      , 50
      );

  INSERT INTO employees VALUES
      ( 127
      , 'James'
      , 'Landry'
      , 'JLANDRY'
      , '1.650.555.0127'
      , TO_DATE('14-01-2017', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2400
      , NULL
      , 120
      , 50
      );

  INSERT INTO employees VALUES
      ( 128
      , 'Steven'
      , 'Markle'
      , 'SMARKLE'
      , '1.650.555.0128'
      , TO_DATE('08-03-2018', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2200
      , NULL
      , 120
      , 50
      );

  INSERT INTO employees VALUES
      ( 129
      , 'Laura'
      , 'Bissot'
      , 'LBISSOT'
      , '1.650.555.0129'
      , TO_DATE('20-08-2015', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 3300
      , NULL
      , 121
      , 50
      );

  INSERT INTO employees VALUES
      ( 130
      , 'Mozhe'
      , 'Atkinson'
      , 'MATKINSO'
      , '1.650.555.0130'
      , TO_DATE('30-10-2015', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2800
      , NULL
      , 121
      , 50
      );

  INSERT INTO employees VALUES
      ( 131
      , 'James'
      , 'Marlow'
      , 'JAMRLOW'
      , '1.650.555.0131'
      , TO_DATE('16-02-2015', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2500
      , NULL
      , 121
      , 50
      );

  INSERT INTO employees VALUES
      ( 132
      , 'TJ'
      , 'Olson'
      , 'TJOLSON'
      , '1.650.555.0132'
      , TO_DATE('10-04-2017', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2100
      , NULL
      , 121
      , 50
      );

  INSERT INTO employees VALUES
      ( 133
      , 'Jason'
      , 'Mallin'
      , 'JMALLIN'
      , '1.650.555.0133'
      , TO_DATE('14-06-2014', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 3300
      , NULL
      , 122
      , 50
      );

  INSERT INTO employees VALUES
      ( 134
      , 'Michael'
      , 'Rogers'
      , 'MROGERS'
      , '1.650.555.0134'
      , TO_DATE('26-08-2016', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2900
      , NULL
      , 122
      , 50
      );

  INSERT INTO employees VALUES
      ( 135
      , 'Ki'
      , 'Gee'
      , 'KGEE'
      , '1.650.555.0135'
      , TO_DATE('12-12-2017', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2400
      , NULL
      , 122
      , 50
      );

  INSERT INTO employees VALUES
      ( 136
      , 'Hazel'
      , 'Philtanker'
      , 'HPHILTAN'
      , '1.650.555.0136'
      , TO_DATE('06-02-2018', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2200
      , NULL
      , 122
      , 50
      );

  INSERT INTO employees VALUES
      ( 137
      , 'Renske'
      , 'Ladwig'
      , 'RLADWIG'
      , '1.650.555.0137'
      , TO_DATE('14-07-2013', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 3600
      , NULL
      , 123
      , 50
      );

  INSERT INTO employees VALUES
      ( 138
      , 'Stephen'
      , 'Stiles'
      , 'SSTILES'
      , '1.650.555.0138'
      , TO_DATE('26-10-2015', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 3200
      , NULL
      , 123
      , 50
      );

  INSERT INTO employees VALUES
      ( 139
      , 'John'
      , 'Seo'
      , 'JSEO'
      , '1.650.555.0139'
      , TO_DATE('12-02-2016', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2700
      , NULL
      , 123
      , 50
      );

  INSERT INTO employees VALUES
      ( 140
      , 'Joshua'
      , 'Patel'
      , 'JPATEL'
      , '1.650.555.0140'
      , TO_DATE('06-04-2016', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2500
      , NULL
      , 123
      , 50
      );

  INSERT INTO employees VALUES
      ( 141
      , 'Trenna'
      , 'Rajs'
      , 'TRAJS'
      , '1.650.555.0141'
      , TO_DATE('17-10-2013', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 3500
      , NULL
      , 124
      , 50
      );

  INSERT INTO employees VALUES
      ( 142
      , 'Curtis'
      , 'Davies'
      , 'CDAVIES'
      , '1.650.555.0142'
      , TO_DATE('29-01-2015', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 3100
      , NULL
      , 124
      , 50
      );

  INSERT INTO employees VALUES
      ( 143
      , 'Randall'
      , 'Matos'
      , 'RMATOS'
      , '1.650.555.0143'
      , TO_DATE('15-03-2016', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2600
      , NULL
      , 124
      , 50
      );

  INSERT INTO employees VALUES
      ( 144
      , 'Peter'
      , 'Vargas'
      , 'PVARGAS'
      , '1.650.555.0144'
      , TO_DATE('09-07-2016', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 2500
      , NULL
      , 124
      , 50
      );

  INSERT INTO employees VALUES
      ( 145
      , 'John'
      , 'Singh'
      , 'JSINGH'
      , '44.1632.960000'
      , TO_DATE('01-10-2014', 'dd-MM-yyyy')
      , 'SA_MAN'
      , 14000
      , .4
      , 100
      , 80
      );

  INSERT INTO employees VALUES
      ( 146
      , 'Karen'
      , 'Partners'
      , 'KPARTNER'
      , '44.1632.960001'
      , TO_DATE('05-01-2015', 'dd-MM-yyyy')
      , 'SA_MAN'
      , 13500
      , .3
      , 100
      , 80
      );

  INSERT INTO employees VALUES
      ( 147
      , 'Alberto'
      , 'Errazuriz'
      , 'AERRAZUR'
      , '44.1632.960002'
      , TO_DATE('10-03-2015', 'dd-MM-yyyy')
      , 'SA_MAN'
      , 12000
      , .3
      , 100
      , 80
      );

  INSERT INTO employees VALUES
      ( 148
      , 'Gerald'
      , 'Cambrault'
      , 'GCAMBRAU'
      , '44.1632.960003'
      , TO_DATE('15-10-2017', 'dd-MM-yyyy')
      , 'SA_MAN'
      , 11000
      , .3
      , 100
      , 80
      );

  INSERT INTO employees VALUES
      ( 149
      , 'Eleni'
      , 'Zlotkey'
      , 'EZLOTKEY'
      , '44.1632.960004'
      , TO_DATE('29-01-2018', 'dd-MM-yyyy')
      , 'SA_MAN'
      , 10500
      , .2
      , 100
      , 80
      );

  INSERT INTO employees VALUES
      ( 150
      , 'Sean'
      , 'Tucker'
      , 'STUCKER'
      , '44.1632.960005'
      , TO_DATE('30-01-2015', 'dd-MM-yyyy')
      , 'SA_REP'
      , 10000
      , .3
      , 145
      , 80
      );

  INSERT INTO employees VALUES
      ( 151
      , 'David'
      , 'Bernstein'
      , 'DBERNSTE'
      , '44.1632.960006'
      , TO_DATE('24-03-2015', 'dd-MM-yyyy')
      , 'SA_REP'
      , 9500
      , .25
      , 145
      , 80
      );

  INSERT INTO employees VALUES
      ( 152
      , 'Peter'
      , 'Hall'
      , 'PHALL'
      , '44.1632.960007'
      , TO_DATE('20-08-2015', 'dd-MM-yyyy')
      , 'SA_REP'
      , 9000
      , .25
      , 145
      , 80
      );

  INSERT INTO employees VALUES
      ( 153
      , 'Christopher'
      , 'Olsen'
      , 'COLSEN'
      , '44.1632.960008'
      , TO_DATE('30-03-2016', 'dd-MM-yyyy')
      , 'SA_REP'
      , 8000
      , .2
      , 145
      , 80
      );

  INSERT INTO employees VALUES
      ( 154
      , 'Nanette'
      , 'Cambrault'
      , 'NCAMBRAU'
      , '44.1632.960009'
      , TO_DATE('09-12-2016', 'dd-MM-yyyy')
      , 'SA_REP'
      , 7500
      , .2
      , 145
      , 80
      );

  INSERT INTO employees VALUES
      ( 155
      , 'Oliver'
      , 'Tuvault'
      , 'OTUVAULT'
      , '44.1632.960010'
      , TO_DATE('23-11-2017', 'dd-MM-yyyy')
      , 'SA_REP'
      , 7000
      , .15
      , 145
      , 80
      );

  INSERT INTO employees VALUES
      ( 156
      , 'Janette'
      , 'King'
      , 'JKING'
      , '44.1632.960011'
      , TO_DATE('30-01-2014', 'dd-MM-yyyy')
      , 'SA_REP'
      , 10000
      , .35
      , 146
      , 80
      );

  INSERT INTO employees VALUES
      ( 157
      , 'Patrick'
      , 'Sully'
      , 'PSULLY'
      , '44.1632.960012'
      , TO_DATE('04-03-2014', 'dd-MM-yyyy')
      , 'SA_REP'
      , 9500
      , .35
      , 146
      , 80
      );

  INSERT INTO employees VALUES
      ( 158
      , 'Allan'
      , 'McEwen'
      , 'AMCEWEN'
      , '44.1632.960013'
      , TO_DATE('01-08-2014', 'dd-MM-yyyy')
      , 'SA_REP'
      , 9000
      , .35
      , 146
      , 80
      );

  INSERT INTO employees VALUES
      ( 159
      , 'Lindsey'
      , 'Smith'
      , 'LSMITH'
      , '44.1632.960014'
      , TO_DATE('10-03-2015', 'dd-MM-yyyy')
      , 'SA_REP'
      , 8000
      , .3
      , 146
      , 80
      );

  INSERT INTO employees VALUES
      ( 160
      , 'Louise'
      , 'Doran'
      , 'LDORAN'
      , '44.1632.960015'
      , TO_DATE('15-12-2015', 'dd-MM-yyyy')
      , 'SA_REP'
      , 7500
      , .3
      , 146
      , 80
      );

  INSERT INTO employees VALUES
      ( 161
      , 'Sarath'
      , 'Sewall'
      , 'SSEWALL'
      , '44.1632.960016'
      , TO_DATE('03-11-2016', 'dd-MM-yyyy')
      , 'SA_REP'
      , 7000
      , .25
      , 146
      , 80
      );

  INSERT INTO employees VALUES
      ( 162
      , 'Clara'
      , 'Vishney'
      , 'CVISHNEY'
      , '44.1632.960017'
      , TO_DATE('11-11-2015', 'dd-MM-yyyy')
      , 'SA_REP'
      , 10500
      , .25
      , 147
      , 80
      );

  INSERT INTO employees VALUES
      ( 163
      , 'Danielle'
      , 'Greene'
      , 'DGREENE'
      , '44.1632.960018'
      , TO_DATE('19-03-2017', 'dd-MM-yyyy')
      , 'SA_REP'
      , 9500
      , .15
      , 147
      , 80
      );

  INSERT INTO employees VALUES
      ( 164
      , 'Mattea'
      , 'Marvins'
      , 'MMARVINS'
      , '44.1632.960019'
      , TO_DATE('24-01-2018', 'dd-MM-yyyy')
      , 'SA_REP'
      , 7200
      , .10
      , 147
      , 80
      );

  INSERT INTO employees VALUES
      ( 165
      , 'David'
      , 'Lee'
      , 'DLEE'
      , '44.1632.960020'
      , TO_DATE('23-02-2018', 'dd-MM-yyyy')
      , 'SA_REP'
      , 6800
      , .1
      , 147
      , 80
      );

  INSERT INTO employees VALUES
      ( 166
      , 'Sundar'
      , 'Ande'
      , 'SANDE'
      , '44.1632.960021'
      , TO_DATE('24-03-2018', 'dd-MM-yyyy')
      , 'SA_REP'
      , 6400
      , .10
      , 147
      , 80
      );

  INSERT INTO employees VALUES
      ( 167
      , 'Amit'
      , 'Banda'
      , 'ABANDA'
      , '44.1632.960022'
      , TO_DATE('21-04-2018', 'dd-MM-yyyy')
      , 'SA_REP'
      , 6200
      , .10
      , 147
      , 80
      );

  INSERT INTO employees VALUES
      ( 168
      , 'Lisa'
      , 'Ozer'
      , 'LOZER'
      , '44.1632.960023'
      , TO_DATE('11-03-2015', 'dd-MM-yyyy')
      , 'SA_REP'
      , 11500
      , .25
      , 148
      , 80
      );

  INSERT INTO employees VALUES
      ( 169
      , 'Harrison'
      , 'Bloom'
      , 'HBLOOM'
      , '44.1632.960024'
      , TO_DATE('23-03-2016', 'dd-MM-yyyy')
      , 'SA_REP'
      , 10000
      , .20
      , 148
      , 80
      );

  INSERT INTO employees VALUES
      ( 170
      , 'Tayler'
      , 'Fox'
      , 'TFOX'
      , '44.1632.960025'
      , TO_DATE('24-01-2016', 'dd-MM-yyyy')
      , 'SA_REP'
      , 9600
      , .20
      , 148
      , 80
      );

  INSERT INTO employees VALUES
      ( 171
      , 'William'
      , 'Smith'
      , 'WSMITH'
      , '44.1632.960026'
      , TO_DATE('23-02-2017', 'dd-MM-yyyy')
      , 'SA_REP'
      , 7400
      , .15
      , 148
      , 80
      );

  INSERT INTO employees VALUES
      ( 172
      , 'Elizabeth'
      , 'Bates'
      , 'EBATES'
      , '44.1632.960027'
      , TO_DATE('24-03-2017', 'dd-MM-yyyy')
      , 'SA_REP'
      , 7300
      , .15
      , 148
      , 80
      );

  INSERT INTO employees VALUES
      ( 173
      , 'Sundita'
      , 'Kumar'
      , 'SKUMAR'
      , '44.1632.960028'
      , TO_DATE('21-04-2018', 'dd-MM-yyyy')
      , 'SA_REP'
      , 6100
      , .10
      , 148
      , 80
      );

  INSERT INTO employees VALUES
      ( 174
      , 'Ellen'
      , 'Abel'
      , 'EABEL'
      , '44.1632.960029'
      , TO_DATE('11-05-2014', 'dd-MM-yyyy')
      , 'SA_REP'
      , 11000
      , .30
      , 149
      , 80
      );

  INSERT INTO employees VALUES
      ( 175
      , 'Alyssa'
      , 'Hutton'
      , 'AHUTTON'
      , '44.1632.960030'
      , TO_DATE('19-03-2015', 'dd-MM-yyyy')
      , 'SA_REP'
      , 8800
      , .25
      , 149
      , 80
      );

  INSERT INTO employees VALUES
      ( 176
      , 'Jonathon'
      , 'Taylor'
      , 'JTAYLOR'
      , '44.1632.960031'
      , TO_DATE('24-03-2016', 'dd-MM-yyyy')
      , 'SA_REP'
      , 8600
      , .20
      , 149
      , 80
      );

  INSERT INTO employees VALUES
      ( 177
      , 'Jack'
      , 'Livingston'
      , 'JLIVINGS'
      , '44.1632.960032'
      , TO_DATE('23-04-2016', 'dd-MM-yyyy')
      , 'SA_REP'
      , 8400
      , .20
      , 149
      , 80
      );

  INSERT INTO employees VALUES
      ( 178
      , 'Kimberely'
      , 'Grant'
      , 'KGRANT'
      , '44.1632.960033'
      , TO_DATE('24-05-2017', 'dd-MM-yyyy')
      , 'SA_REP'
      , 7000
      , .15
      , 149
      , NULL
      );

  INSERT INTO employees VALUES
      ( 179
      , 'Charles'
      , 'Johnson'
      , 'CJOHNSON'
      , '44.1632.960034'
      , TO_DATE('04-01-2018', 'dd-MM-yyyy')
      , 'SA_REP'
      , 6200
      , .10
      , 149
      , 80
      );

  INSERT INTO employees VALUES
      ( 180
      , 'Winston'
      , 'Taylor'
      , 'WTAYLOR'
      , '1.650.555.0145'
      , TO_DATE('24-01-2016', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3200
      , NULL
      , 120
      , 50
      );

  INSERT INTO employees VALUES
      ( 181
      , 'Jean'
      , 'Fleaur'
      , 'JFLEAUR'
      , '1.650.555.0146'
      , TO_DATE('23-02-2016', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3100
      , NULL
      , 120
      , 50
      );

  INSERT INTO employees VALUES
      ( 182
      , 'Martha'
      , 'Sullivan'
      , 'MSULLIVA'
      , '1.650.555.0147'
      , TO_DATE('21-06-2017', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 2500
      , NULL
      , 120
      , 50
      );

  INSERT INTO employees VALUES
      ( 183
      , 'Girard'
      , 'Geoni'
      , 'GGEONI'
      , '1.650.555.0148'
      , TO_DATE('03-02-2018', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 2800
      , NULL
      , 120
      , 50
      );

  INSERT INTO employees VALUES
      ( 184
      , 'Nandita'
      , 'Sarchand'
      , 'NSARCHAN'
      , '1.650.555.0149'
      , TO_DATE('27-01-2014', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 4200
      , NULL
      , 121
      , 50
      );

  INSERT INTO employees VALUES
      ( 185
      , 'Alexis'
      , 'Bull'
      , 'ABULL'
      , '1.650.555.0150'
      , TO_DATE('20-02-2015', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 4100
      , NULL
      , 121
      , 50
      );

  INSERT INTO employees VALUES
      ( 186
      , 'Julia'
      , 'Dellinger'
      , 'JDELLING'
      , '1.650.555.0151'
      , TO_DATE('24-06-2016', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3400
      , NULL
      , 121
      , 50
      );

  INSERT INTO employees VALUES
      ( 187
      , 'Anthony'
      , 'Cabrio'
      , 'ACABRIO'
      , '1.650.555.0152'
      , TO_DATE('07-02-2017', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3000
      , NULL
      , 121
      , 50
      );

  INSERT INTO employees VALUES
      ( 188
      , 'Kelly'
      , 'Chung'
      , 'KCHUNG'
      , '1.650.555.0153'
      , TO_DATE('14-06-2015', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3800
      , NULL
      , 122
      , 50
      );

  INSERT INTO employees VALUES
      ( 189
      , 'Jennifer'
      , 'Dilly'
      , 'JDILLY'
      , '1.650.555.0154'
      , TO_DATE('13-08-2015', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3600
      , NULL
      , 122
      , 50
      );

  INSERT INTO employees VALUES
      ( 190
      , 'Timothy'
      , 'Venzl'
      , 'TVENZL'
      , '1.650.555.0155'
      , TO_DATE('11-07-2016', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 2900
      , NULL
      , 122
      , 50
      );

  INSERT INTO employees VALUES
      ( 191
      , 'Randall'
      , 'Perkins'
      , 'RPERKINS'
      , '1.650.555.0156'
      , TO_DATE('19-12-2017', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 2500
      , NULL
      , 122
      , 50
      );

  INSERT INTO employees VALUES
      ( 192
      , 'Sarah'
      , 'Bell'
      , 'SBELL'
      , '1.650.555.0157'
      , TO_DATE('04-02-2014', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 4000
      , NULL
      , 123
      , 50
      );

  INSERT INTO employees VALUES
      ( 193
      , 'Britney'
      , 'Everett'
      , 'BEVERETT'
      , '1.650.555.0158'
      , TO_DATE('03-03-2015', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3900
      , NULL
      , 123
      , 50
      );

  INSERT INTO employees VALUES
      ( 194
      , 'Samuel'
      , 'McLeod'
      , 'SMCLEOD'
      , '1.650.555.0159'
      , TO_DATE('01-07-2016', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3200
      , NULL
      , 123
      , 50
      );

  INSERT INTO employees VALUES
      ( 195
      , 'Vance'
      , 'Jones'
      , 'VJONES'
      , '1.650.555.0160'
      , TO_DATE('17-03-2017', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 2800
      , NULL
      , 123
      , 50
      );

  INSERT INTO employees VALUES
      ( 196
      , 'Alana'
      , 'Walsh'
      , 'AWALSH'
      , '1.650.555.0161'
      , TO_DATE('24-04-2016', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3100
      , NULL
      , 124
      , 50
      );

  INSERT INTO employees VALUES
      ( 197
      , 'Kevin'
      , 'Feeney'
      , 'KFEENEY'
      , '1.650.555.0162'
      , TO_DATE('23-05-2016', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 3000
      , NULL
      , 124
      , 50
      );

  INSERT INTO employees VALUES
      ( 198
      , 'Donald'
      , 'OConnell'
      , 'DOCONNEL'
      , '1.650.555.0163'
      , TO_DATE('21-06-2017', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 2600
      , NULL
      , 124
      , 50
      );

  INSERT INTO employees VALUES
      ( 199
      , 'Douglas'
      , 'Grant'
      , 'DGRANT'
      , '1.650.555.0164'
      , TO_DATE('13-01-2018', 'dd-MM-yyyy')
      , 'SH_CLERK'
      , 2600
      , NULL
      , 124
      , 50
      );

  INSERT INTO employees VALUES
      ( 200
      , 'Jennifer'
      , 'Whalen'
      , 'JWHALEN'
      , '1.515.555.0165'
      , TO_DATE('17-09-2013', 'dd-MM-yyyy')
      , 'AD_ASST'
      , 4400
      , NULL
      , 101
      , 10
      );

  INSERT INTO employees VALUES
      ( 201
      , 'Michael'
      , 'Martinez'
      , 'MMARTINE'
      , '1.515.555.0166'
      , TO_DATE('17-02-2014', 'dd-MM-yyyy')
      , 'MK_MAN'
      , 13000
      , NULL
      , 100
      , 20
      );

  INSERT INTO employees VALUES
      ( 202
      , 'Pat'
      , 'Davis'
      , 'PDAVIS'
      , '1.603.555.0167'
      , TO_DATE('17-08-2015', 'dd-MM-yyyy')
      , 'MK_REP'
      , 6000
      , NULL
      , 201
      , 20
      );

  INSERT INTO employees VALUES
      ( 203
      , 'Susan'
      , 'Jacobs'
      , 'SJACOBS'
      , '1.515.555.0168'
      , TO_DATE('07-06-2012', 'dd-MM-yyyy')
      , 'HR_REP'
      , 6500
      , NULL
      , 101
      , 40
      );

  INSERT INTO employees VALUES
      ( 204
      , 'Hermann'
      , 'Brown'
      , 'HBROWN'
      , '1.515.555.0169'
      , TO_DATE('07-06-2012', 'dd-MM-yyyy')
      , 'PR_REP'
      , 10000
      , NULL
      , 101
      , 70
      );

  INSERT INTO employees VALUES
      ( 205
      , 'Shelley'
      , 'Higgins'
      , 'SHIGGINS'
      , '1.515.555.0170'
      , TO_DATE('07-06-2012', 'dd-MM-yyyy')
      , 'AC_MGR'
      , 12008
      , NULL
      , 101
      , 110
      );

  INSERT INTO employees VALUES
      ( 206
      , 'William'
      , 'Gietz'
      , 'WGIETZ'
      , '1.515.555.0171'
      , TO_DATE('07-06-2012', 'dd-MM-yyyy')
      , 'AC_ACCOUNT'
      , 8300
      , NULL
      , 205
      , 110
      );
END;
/

REM ********* insert data into the JOB_HISTORY table

Prompt ****** Populating JOB_HISTORY table ....

BEGIN
  INSERT INTO job_history
  VALUES (102
       , TO_DATE('13-01-2011', 'dd-MM-yyyy')
       , TO_DATE('24-07-2016', 'dd-MM-yyyy')
       , 'IT_PROG'
       , 60);

  INSERT INTO job_history
  VALUES (101
       , TO_DATE('21-09-2007', 'dd-MM-yyyy')
       , TO_DATE('27-10-2011', 'dd-MM-yyyy')
       , 'AC_ACCOUNT'
       , 110);

  INSERT INTO job_history
  VALUES (101
       , TO_DATE('28-10-2011', 'dd-MM-yyyy')
       , TO_DATE('15-03-2015', 'dd-MM-yyyy')
       , 'AC_MGR'
       , 110);

  INSERT INTO job_history
  VALUES (201
       , TO_DATE('17-02-2014', 'dd-MM-yyyy')
       , TO_DATE('19-12-2017', 'dd-MM-yyyy')
       , 'MK_REP'
       , 20);

  INSERT INTO job_history
  VALUES  (114
      , TO_DATE('24-03-2016', 'dd-MM-yyyy')
      , TO_DATE('31-12-2017', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 50
      );

  INSERT INTO job_history
  VALUES  (122
      , TO_DATE('01-01-2017', 'dd-MM-yyyy')
      , TO_DATE('31-12-2017', 'dd-MM-yyyy')
      , 'ST_CLERK'
      , 50
      );

  INSERT INTO job_history
  VALUES  (200
      , TO_DATE('17-09-2005', 'dd-MM-yyyy')
      , TO_DATE('17-06-2011', 'dd-MM-yyyy')
      , 'AD_ASST'
      , 90
      );

  INSERT INTO job_history
  VALUES  (176
      , TO_DATE('24-03-2016', 'dd-MM-yyyy')
      , TO_DATE('31-12-2016', 'dd-MM-yyyy')
      , 'SA_REP'
      , 80
      );

  INSERT INTO job_history
  VALUES  (176
      , TO_DATE('01-01-2017', 'dd-MM-yyyy')
      , TO_DATE('31-12-2017', 'dd-MM-yyyy')
      , 'SA_MAN'
      , 80
      );

  INSERT INTO job_history
  VALUES  (200
      , TO_DATE('01-07-2012', 'dd-MM-yyyy')
      , TO_DATE('31-12-2016', 'dd-MM-yyyy')
      , 'AC_ACCOUNT'
      , 90
      );
END;
/

COMMIT;

REM enable integrity constraint to DEPARTMENTS

ALTER TABLE departments
  ENABLE CONSTRAINT dept_mgr_fk;
  
  
  -- 1) Tipos de nómina
CREATE TABLE pay_payroll_types (--> crear los tipos, reales que sean minimo 3
  payroll_type_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  code            VARCHAR2(20) UNIQUE NOT NULL,  -- MENSUAL, QUINCENAL
  description     VARCHAR2(100) NOT NULL
);

INSERT INTO pay_payroll_types (code, description)
VALUES ('MENSUAL', 'Pago de nómina mensual');

INSERT INTO pay_payroll_types (code, description)
VALUES ('QUINCENAL', 'Pago de nómina cada quincena');

INSERT INTO pay_payroll_types (code, description)
VALUES ('SEMANAL', 'Pago de nómina semanal');

-- 2) Conceptos
CREATE TABLE pay_concepts (--> preguntar a la IA, defnir conceptos a pagar, minimo 80 que sean reales
  concept_id      NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  code            VARCHAR2(30) UNIQUE NOT NULL,   -- HED, HEN, VAC, SAL_BASE
  name            VARCHAR2(100) NOT NULL,
  concept_type    VARCHAR2(10)  NOT NULL CHECK (concept_type IN ('DEVENGO','DEDUCCION')),
  calc_method     VARCHAR2(15)  NOT NULL CHECK (calc_method IN ('FIJO','PORCENTAJE','POR_HORA','POR_DIA')),
  default_rate    NUMBER(12,4),                   -- % o tarifa por hora/día
  is_active       CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y','N'))
);


DECLARE
  PROCEDURE upsert_concept(
    p_code         IN VARCHAR2,
    p_name         IN VARCHAR2,
    p_concept_type IN VARCHAR2,
    p_calc_method  IN VARCHAR2,
    p_default_rate IN NUMBER,
    p_is_active    IN CHAR
  ) IS
  BEGIN
    MERGE INTO pay_concepts c
    USING (
      SELECT
        p_code         AS code,
        p_name         AS name,
        p_concept_type AS concept_type,
        p_calc_method  AS calc_method,
        p_default_rate AS default_rate,
        p_is_active    AS is_active
      FROM dual
    ) s
    ON (c.code = s.code)
    WHEN MATCHED THEN
      UPDATE SET
        c.name         = s.name,
        c.concept_type = s.concept_type,
        c.calc_method  = s.calc_method,
        c.default_rate = s.default_rate,
        c.is_active    = s.is_active
    WHEN NOT MATCHED THEN
      INSERT (code, name, concept_type, calc_method, default_rate, is_active)
      VALUES (s.code, s.name, s.concept_type, s.calc_method, s.default_rate, s.is_active);
  END;
BEGIN
  -- ===================== DEVENGOS =====================
  upsert_concept('SAL_BASE', 'Salario base mensual', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('HORA_NORMAL', 'Hora ordinaria', 'DEVENGO', 'POR_HORA', 1.0000, 'Y');
  upsert_concept('HED', 'Hora extra diurna (125%)', 'DEVENGO', 'POR_HORA', 1.2500, 'Y');
  upsert_concept('HEN', 'Hora extra nocturna (175%)', 'DEVENGO', 'POR_HORA', 1.7500, 'Y');
  upsert_concept('HEDDF', 'Hora extra diurna dominical/festiva (200%)', 'DEVENGO', 'POR_HORA', 2.0000, 'Y');
  upsert_concept('HENDF', 'Hora extra nocturna dominical/festiva (250%)', 'DEVENGO', 'POR_HORA', 2.5000, 'Y');
  upsert_concept('REC_NOCT', 'Recargo nocturno (35% adicional)', 'DEVENGO', 'POR_HORA', 0.3500, 'Y');
  upsert_concept('REC_DOMFEST', 'Recargo dominical/festivo (75% adicional)', 'DEVENGO', 'POR_HORA', 0.7500, 'Y');

  upsert_concept('COMISION_VENTAS', 'Comisión por ventas', 'DEVENGO', 'PORCENTAJE', 0.0500, 'Y');
  upsert_concept('COMISION_COBRANZA', 'Comisión por cobranza', 'DEVENGO', 'PORCENTAJE', 0.0200, 'Y');
  upsert_concept('COMISION_OBJETIVOS', 'Comisión por cumplimiento de objetivos', 'DEVENGO', 'PORCENTAJE', 0.1000, 'Y');

  upsert_concept('BONO_DESEMPENO', 'Bono de desempeño', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_PRODUCTIVIDAD', 'Bono de productividad', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_ASISTENCIA', 'Bono por asistencia perfecta', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_PUNTUALIDAD', 'Bono por puntualidad', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_CALIDAD', 'Bono por calidad', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_SST', 'Bono por seguridad y salud en el trabajo', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_NAVIDAD', 'Bono navideño', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_REFERIDO', 'Bono por referido', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_RECONOCIMIENTO', 'Bono de reconocimiento', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_IDEAS', 'Bono por innovación/ideas', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_IDIOMA', 'Bono por idioma', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_RELOCALIZACION', 'Bono por relocalización', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_RESULTADOS_TRIM', 'Bono por resultados trimestral', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_RESULTADOS_ANUAL', 'Bono por resultados anual', 'DEVENGO', 'FIJO', NULL, 'Y');

  upsert_concept('PRIMA_SERVICIOS', 'Prima de servicios (acumulación 8.33%)', 'DEVENGO', 'PORCENTAJE', 0.0833, 'Y');
  upsert_concept('CESANTIAS_MES', 'Cesantías (acumulación 8.33%)', 'DEVENGO', 'PORCENTAJE', 0.0833, 'Y');
  upsert_concept('INT_CESANTIAS_MES', 'Intereses a cesantías (1% mensual)', 'DEVENGO', 'PORCENTAJE', 0.0100, 'Y');
  upsert_concept('PRIMA_VACACIONES', 'Prima de vacaciones', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('VAC_DISFRUTE', 'Vacaciones en disfrute', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('VAC_COMPENSADAS', 'Vacaciones compensadas', 'DEVENGO', 'FIJO', NULL, 'Y');

  upsert_concept('AUX_TRANSPORTE', 'Auxilio de transporte', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_ALIMENTACION', 'Auxilio de alimentación', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_MOVIL', 'Auxilio de telefonía/móvil', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_INTERNET', 'Auxilio de internet', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_VIVIENDA', 'Auxilio de vivienda', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('SUBSIDIO_FAMILIAR', 'Subsidio familiar', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('SUBSIDIO_HIJO', 'Subsidio por hijo', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('SUBSIDIO_ESCOLAR', 'Subsidio escolar', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('SUB_ALIM_DIA', 'Subsidio de alimentación por día', 'DEVENGO', 'POR_DIA', NULL, 'Y');

  upsert_concept('VIATICOS_DIA', 'Viáticos (por día)', 'DEVENGO', 'POR_DIA', NULL, 'Y');
  upsert_concept('VIATICOS_NO_SAL', 'Viáticos no constitutivos salariales', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('REEMB_GASTOS', 'Reembolso de gastos', 'DEVENGO', 'FIJO', NULL, 'Y');

  upsert_concept('PAGO_TIEMPO_COMP', 'Pago por tiempo compensado', 'DEVENGO', 'POR_HORA', 1.0000, 'Y');
  upsert_concept('PAGO_CAPACITACION', 'Pago por horas de capacitación', 'DEVENGO', 'POR_HORA', 1.0000, 'Y');

  upsert_concept('PRIMA_ANTIGUEDAD', 'Prima de antigüedad (2%)', 'DEVENGO', 'PORCENTAJE', 0.0200, 'Y');
  upsert_concept('PRIMA_TECNICA', 'Prima técnica', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('PRIMA_EXTRAORD', 'Prima extraordinaria', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('GRATIFICACION', 'Gratificación especial', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('PROPINA', 'Propinas', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AJUSTE_POSITIVO', 'Ajuste positivo de nómina', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('DIFERENCIAL_SAL', 'Diferencial salarial', 'DEVENGO', 'FIJO', NULL, 'Y');

  upsert_concept('AUX_LENTES', 'Auxilio para lentes', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_MEDICO', 'Auxilio médico', 'DEVENGO', 'FIJO', NULL, 'Y');

  upsert_concept('INC_GENERAL_EPS', 'Incapacidad general EPS (pago empleador/EPS)', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('INC_LABORAL_ARL', 'Incapacidad laboral ARL', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('LIC_REMUN', 'Licencia remunerada', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('LIC_MATERNIDAD', 'Licencia de maternidad', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('LIC_PATERNIDAD', 'Licencia de paternidad', 'DEVENGO', 'FIJO', NULL, 'Y');

  upsert_concept('RETROACTIVO', 'Pago retroactivo de nómina', 'DEVENGO', 'FIJO', NULL, 'Y');

  -- Prestaciones/beneficios adicionales
  upsert_concept('BONO_FIN_ANO', 'Bono fin de año', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_FIDELIDAD', 'Bono de fidelidad', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_PROYECTO', 'Bono por proyecto', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_NOCTURNO', 'Bono por turno nocturno', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_TURNO', 'Bono por turno', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AYUDA_ESCOLAR', 'Ayuda escolar', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_TRANSP_EXTRA', 'Auxilio de transporte extra', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('RECOLOCACION', 'Reconocimiento por relocalización', 'DEVENGO', 'FIJO', NULL, 'Y');

  -- ===================== DEDUCCIONES =====================
  upsert_concept('SALUD_EE', 'Aporte a salud (empleado 4%)', 'DEDUCCION', 'PORCENTAJE', 0.0400, 'Y');
  upsert_concept('PENSION_EE', 'Aporte a pensión (empleado 4%)', 'DEDUCCION', 'PORCENTAJE', 0.0400, 'Y');
  upsert_concept('FONDO_SOL', 'Fondo de solidaridad pensional (1%)', 'DEDUCCION', 'PORCENTAJE', 0.0100, 'Y');
  upsert_concept('RETEFUENTE', 'Retención en la fuente', 'DEDUCCION', 'PORCENTAJE', 0.1000, 'Y');
  upsert_concept('SINDICATO', 'Cuota sindical', 'DEDUCCION', 'PORCENTAJE', 0.0100, 'Y');
  upsert_concept('COOPERATIVA', 'Aporte a cooperativa', 'DEDUCCION', 'PORCENTAJE', 0.0200, 'Y');
  upsert_concept('FONDO_EMPLEADOS', 'Cuota fondo de empleados', 'DEDUCCION', 'PORCENTAJE', 0.0200, 'Y');
  upsert_concept('APORTE_VOL_PEN', 'Aporte voluntario a pensión', 'DEDUCCION', 'PORCENTAJE', 0.0300, 'Y');
  upsert_concept('APORTE_VOL_SAL', 'Aporte voluntario a salud', 'DEDUCCION', 'PORCENTAJE', 0.0100, 'Y');

  upsert_concept('LIBRANZA', 'Libranza', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('PRESTAMO_EMP', 'Cuota préstamo a empleado', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('EMBARGO_JUD', 'Embargo judicial', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('ADELANTO_NOM', 'Descuento por anticipo de nómina', 'DEDUCCION', 'FIJO', NULL, 'Y');

  upsert_concept('CUOTA_PARQ', 'Cuota de parqueadero', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('COMEDOR_EMP', 'Comedor empresarial', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('SEGURO_VIDA', 'Seguro de vida', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('SEGURO_MEDICO', 'Seguro médico', 'DEDUCCION', 'FIJO', NULL, 'Y');

  upsert_concept('PERMISO_NO_REMUN', 'Permisos no remunerados (por día)', 'DEDUCCION', 'POR_DIA', 1.0000, 'Y');
  upsert_concept('AUSENTISMO_NO_PAGO', 'Ausentismo sin salario (por día)', 'DEDUCCION', 'POR_DIA', 1.0000, 'Y');
  upsert_concept('TARDANZA', 'Descuento por tardanza (por hora)', 'DEDUCCION', 'POR_HORA', 1.0000, 'Y');

  upsert_concept('DEV_VIATICOS', 'Devolución de viáticos', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DEV_COMISION', 'Devolución de comisiones', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_HERRAMIENTAS', 'Descuento por herramientas', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_DANOS', 'Descuento por daños', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_UNIFORME', 'Descuento por uniforme', 'DEDUCCION', 'FIJO', NULL, 'Y');

  upsert_concept('SS_ADICIONAL', 'Deducción seguridad social adicional', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('RETENCION_JUD', 'Retención judicial adicional', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_SERVICIOS', 'Descuento por servicios (gimnasio, etc.)', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_ALMUERZO', 'Descuento por almuerzo', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_TRANS_EMP', 'Descuento transporte empresarial', 'DEDUCCION', 'FIJO', NULL, 'Y');

  upsert_concept('AJUSTE_NEGATIVO', 'Ajuste negativo de nómina', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DIFERENCIAL_NEG', 'Diferencial negativo', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_FALTANTE_CAJA', 'Descuento por faltante de caja', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_DIAS_SIN_SUELDO', 'Días sin sueldo (por día)', 'DEDUCCION', 'POR_DIA', 1.0000, 'Y');
  upsert_concept('DEDUCCION_OTROS', 'Otras deducciones', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_TECNOLOGIA', 'Descuento por compra de tecnología', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DESC_SEGURO_HOGAR', 'Descuento seguro de hogar', 'DEDUCCION', 'FIJO', NULL, 'Y');

  -- Extras para llegar a 80+ y cubrir casos comunes
  upsert_concept('SEGURO_MIXTO', 'Seguro mixto (plan corporativo)', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('APORTE_CAJA', 'Aporte a caja (empleado)', 'DEDUCCION', 'PORCENTAJE', 0.0100, 'Y');
  upsert_concept('DESCUENTO_PRESTACIONES', 'Descuento por prestaciones', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('COOPERATIVA_LIBRANZA', 'Cooperativa - libranza', 'DEDUCCION', 'FIJO', NULL, 'Y');
  upsert_concept('DONACION', 'Donación voluntaria', 'DEDUCCION', 'FIJO', NULL, 'Y');

  upsert_concept('BONO_BIENESTAR', 'Bono de bienestar', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_RETENCION', 'Bono de retención', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('BONO_FORMACION', 'Bono por formación', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_HERRAMIENTAS', 'Auxilio de herramientas', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_TELETRABAJO', 'Auxilio de teletrabajo', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_GASOLINA', 'Auxilio de gasolina', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_PARQUEADERO', 'Auxilio de parqueadero', 'DEVENGO', 'FIJO', NULL, 'Y');
  upsert_concept('AUX_UNIFORME', 'Auxilio de uniforme', 'DEVENGO', 'FIJO', NULL, 'Y');

  COMMIT;
END;
/

-- 3) Periodos
CREATE TABLE pay_periods (--> guardar peridos hacia atras, vamos a guardar los 12 meses de atras, 52 semanas, 12 mensual 24 quincenal
  period_id    NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  payroll_type_id NUMBER NOT NULL REFERENCES pay_payroll_types(payroll_type_id),
  period_code  VARCHAR2(20) NOT NULL,             -- 2026-02, 2026Q1-01, etc.
  date_start   DATE NOT NULL,
  date_end     DATE NOT NULL,
  status       VARCHAR2(10) DEFAULT 'ABIERTO' CHECK (status IN ('ABIERTO','CERRADO')),
  CONSTRAINT uk_pay_period UNIQUE (payroll_type_id, period_code),
  CONSTRAINT ck_pay_period_dates CHECK (date_end >= date_start)
);

DECLARE
  v_mensual_id    pay_payroll_types.payroll_type_id%TYPE;
  v_quincenal_id  pay_payroll_types.payroll_type_id%TYPE;
  v_semanal_id    pay_payroll_types.payroll_type_id%TYPE;

  v_start   DATE;
  v_end     DATE;
  v_code    VARCHAR2(20);

  v_base_month        DATE;
  v_last_week_start   DATE;
  v_today             DATE;

  v_q                 NUMBER;
  v_year              VARCHAR2(4);
  v_month             NUMBER;
  v_month_in_quarter  NUMBER;
  v_half_index        NUMBER;

  -- Inserta y omite si ya existe (respetando uk_pay_period)
  PROCEDURE ins_period(p_type_id NUMBER, p_code VARCHAR2, p_start DATE, p_end DATE) IS
  BEGIN
    INSERT INTO pay_periods (payroll_type_id, period_code, date_start, date_end, status)
    VALUES (p_type_id, p_code, p_start, p_end, 'ABIERTO');
  EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
      NULL; -- ya existe, no hacer nada
  END;
BEGIN
  -- Buscar IDs de tipos de nómina
  SELECT payroll_type_id INTO v_mensual_id   FROM pay_payroll_types WHERE code = 'MENSUAL';
  SELECT payroll_type_id INTO v_quincenal_id FROM pay_payroll_types WHERE code = 'QUINCENAL';
  SELECT payroll_type_id INTO v_semanal_id   FROM pay_payroll_types WHERE code = 'SEMANAL';

  ---------------------------------------------------------------------------
  -- 1) 12 meses completos hacia atrás (sin incluir el mes en curso)
  ---------------------------------------------------------------------------
  v_base_month := TRUNC(ADD_MONTHS(SYSDATE, -1), 'MM'); -- inicio del mes pasado
  FOR i IN 0 .. 11 LOOP
    v_start := ADD_MONTHS(v_base_month, -i);
    v_end   := LAST_DAY(v_start);
    v_code  := TO_CHAR(v_start, 'YYYY-MM'); -- p.ej. 2025-11
    ins_period(v_mensual_id, v_code, v_start, v_end);
  END LOOP;

  ---------------------------------------------------------------------------
  -- 2) 52 semanas completas hacia atrás (lunes a domingo)
  --    No incluye la semana en curso.
  ---------------------------------------------------------------------------
  v_last_week_start := TRUNC(SYSDATE, 'IW') - 7; -- lunes de la semana anterior
  FOR i IN 0 .. 51 LOOP
    v_start := v_last_week_start - 7 * i; -- lunes
    v_end   := v_start + 6;               -- domingo
    v_code  := TO_CHAR(v_start, 'IYYY') || '-W' || TO_CHAR(v_start, 'IW'); -- p.ej. 2026-W05
    ins_period(v_semanal_id, v_code, v_start, v_end);
  END LOOP;

  ---------------------------------------------------------------------------
  -- 3) 24 quincenas completas hacia atrás
  --    Quincena 1: día 1 al 15 | Quincena 2: día 16 al fin de mes
  --    Código: YYYYQq-xx (xx = 01..06 dentro del trimestre)
  ---------------------------------------------------------------------------
  v_today := TRUNC(SYSDATE);

  -- Determinar la última quincena completa finalizada
  IF TO_NUMBER(TO_CHAR(v_today, 'DD')) > 15 THEN
    v_end := TRUNC(v_today, 'MM') + 14;        -- 15 del mes actual
  ELSE
    v_end := LAST_DAY(ADD_MONTHS(v_today, -1)); -- fin del mes anterior
  END IF;

  FOR i IN 1 .. 24 LOOP
    -- Determinar inicio según el fin de la quincena
    IF TO_NUMBER(TO_CHAR(v_end, 'DD')) = 15 THEN
      v_start := TRUNC(v_end, 'MM');          -- 1 al 15
    ELSE
      v_start := TRUNC(v_end, 'MM') + 15;     -- 16 a fin de mes
    END IF;

    -- Calcular índice de quincena dentro del trimestre (01..06)
    v_q     := TO_NUMBER(TO_CHAR(v_start, 'Q'));      -- 1..4
    v_year  := TO_CHAR(v_start, 'YYYY');
    v_month := TO_NUMBER(TO_CHAR(v_start, 'MM'));
    v_month_in_quarter := v_month - ((v_q - 1) * 3);  -- 1..3
    v_half_index := (v_month_in_quarter - 1) * 2
                    + CASE WHEN TO_NUMBER(TO_CHAR(v_start, 'DD')) = 1 THEN 1 ELSE 2 END;

    v_code  := v_year || 'Q' || v_q || '-' || LPAD(v_half_index, 2, '0'); -- p.ej. 2026Q1-03
    ins_period(v_quincenal_id, v_code, v_start, v_end);

    -- Retroceder a la quincena anterior
    IF TO_NUMBER(TO_CHAR(v_end, 'DD')) = 15 THEN
      v_end := LAST_DAY(ADD_MONTHS(v_end, -1)); -- fin del mes anterior
    ELSE
      v_end := TRUNC(v_end, 'MM') + 14;         -- 15 del mismo mes
    END IF;
  END LOOP;

  COMMIT;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RAISE_APPLICATION_ERROR(
      -20001,
      'Faltan tipos de nómina requeridos (MENSUAL, QUINCENAL o SEMANAL) en PAY_PAYROLL_TYPES.'
    );
END;
/



-- 4) Contratos (condiciones por empleado)
CREATE TABLE pay_emp_contracts (
  contract_id     NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  employee_id     NUMBER NOT NULL REFERENCES employees(employee_id),
  payroll_type_id NUMBER NOT NULL REFERENCES pay_payroll_types(payroll_type_id),
  base_salary     NUMBER(12,2) NOT NULL,
  hours_per_month NUMBER(6,2) DEFAULT 240,        -- para calcular valor hora
  start_date      DATE NOT NULL,
  end_date        DATE,
  status          VARCHAR2(10) DEFAULT 'ACTIVO' CHECK (status IN ('ACTIVO','INACTIVO')),
  CONSTRAINT ck_contract_dates CHECK (end_date IS NULL OR end_date >= start_date)
);


-- 5) Registro de horas (horas extra/recargos)
CREATE TABLE pay_time_entries (
  time_entry_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  employee_id   NUMBER NOT NULL REFERENCES employees(employee_id),
  work_date     DATE   NOT NULL,
  concept_id    NUMBER NOT NULL REFERENCES pay_concepts(concept_id), -- ej HED/HEN/DOM
  hours_qty     NUMBER(6,2) NOT NULL CHECK (hours_qty > 0),
  notes         VARCHAR2(200)
);



-- 6) Vacaciones / licencias
CREATE TABLE pay_leave_requests (
  leave_id     NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  employee_id  NUMBER NOT NULL REFERENCES employees(employee_id),
  leave_type   VARCHAR2(15) NOT NULL CHECK (leave_type IN ('VACACIONES','INCAPACIDAD','LICENCIA')),
  date_start   DATE NOT NULL,
  date_end     DATE NOT NULL,
  days_qty     NUMBER(6,2),
  status       VARCHAR2(12) DEFAULT 'APROBADA' CHECK (status IN ('SOLICITADA','APROBADA','RECHAZADA')),
  CONSTRAINT ck_leave_dates CHECK (date_end >= date_start)
);

-- 7) Novedades (bonos, descuentos, préstamos, etc.)
CREATE TABLE pay_emp_events (
  event_id     NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  employee_id  NUMBER NOT NULL REFERENCES employees(employee_id),
  period_id    NUMBER NOT NULL REFERENCES pay_periods(period_id),
  concept_id   NUMBER NOT NULL REFERENCES pay_concepts(concept_id),
  qty          NUMBER(10,2) DEFAULT 1,             -- unidades/días/horas si aplica
  amount       NUMBER(12,2),                       -- monto directo si aplica
  rate         NUMBER(12,4),                       -- % o tarifa si aplica
  notes        VARCHAR2(200)
);



-- 8) Cabecera de nómina (desprendible)
CREATE TABLE pay_payslips (
  payslip_id   NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  period_id    NUMBER NOT NULL REFERENCES pay_periods(period_id),
  employee_id  NUMBER NOT NULL REFERENCES employees(employee_id),
  calc_date    DATE DEFAULT SYSDATE,
  gross_total  NUMBER(12,2) DEFAULT 0,
  ded_total    NUMBER(12,2) DEFAULT 0,
  net_total    NUMBER(12,2) DEFAULT 0,
  status       VARCHAR2(12) DEFAULT 'CALCULADO' CHECK (status IN ('CALCULADO','APROBADO','PAGADO')),
  CONSTRAINT uk_payslip UNIQUE (period_id, employee_id)
);



-- 9) Detalle por concepto
CREATE TABLE pay_payslip_lines (
  line_id      NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  payslip_id   NUMBER NOT NULL REFERENCES pay_payslips(payslip_id) ON DELETE CASCADE,
  concept_id   NUMBER NOT NULL REFERENCES pay_concepts(concept_id),
  qty          NUMBER(10,2),
  unit_value   NUMBER(12,4),
  line_total   NUMBER(12,2) NOT NULL,
  CONSTRAINT ck_line_total CHECK (line_total <> 0)
);
```

## Evidencia Taller 1

```sql

-- =====================================================================
-- 03_template_entrega_taller1_v2.sql
-- Taller aplicado 1 - SQL avanzado + Transacciones (ACID) aplicado
-- Plantilla de entrega para estudiantes
--
-- IMPORTANTE:
-- 1. Trabajar únicamente sobre las tablas T1_% y AUDIT_SALARY_ADJUSTMENTS_T1
-- 2. NO modificar la estructura del entorno entregado por el docente
-- 3. NO eliminar secciones de esta plantilla
-- 4. Reemplazar únicamente los bloques indicados como "ESCRIBA AQUÍ"
-- 5. Usar la variante asignada por el docente (1, 2, 3 o 4)
-- 6. Usar un tag único de ejecución final, por ejemplo: P03_FINAL
-- =====================================================================

SET SERVEROUTPUT ON
SET FEEDBACK ON

-- ============================================================
-- 0. ENCABEZADO OBLIGATORIO
-- Complete toda esta información antes de ejecutar el script.
-- ============================================================
-- Integrante 1: Gonzalo Ayala Almeciga
-- Integrante 2: David millan castaneda 
-- Curso: bases de datos 2
-- Fecha: 08/04/2026
-- Variante asignada por el docente (1, 2, 3 o 4): 4
-- Tag de ejecución final (ejemplo: P03_FINAL): MillanGonzalo_FINAL

DEFINE p_variant_id = 4
DEFINE p_execution_tag = 'MillanGonzalo_FINAL'

PROMPT ===== 0. VERIFICACIÓN DE LA VARIANTE ASIGNADA =====
SELECT
    variant_id,
    variant_name,
    excluded_department_id,
    min_years_service,
    recent_job_history_months,
    gap_high_threshold_pct,
    gap_mid_threshold_pct,
    raise_high_pct,
    raise_mid_pct,
    raise_low_pct,
    max_salary_vs_avg_pct,
    notes
FROM t1_variants
WHERE variant_id = &p_variant_id;

-- ============================================================
-- GUÍA RÁPIDA DE OBJETOS DISPONIBLES
-- Use estos nombres reales de tablas y columnas.
-- ============================================================
-- Tabla principal de empleados: T1_EMPLOYEES
-- Columnas más importantes:
--   employee_id, first_name, last_name, email, phone_number,
--   hire_date, job_id, salary, commission_pct, manager_id, department_id
--
-- Tabla de departamentos: T1_DEPARTMENTS
-- Columnas más importantes:
--   department_id, department_name, manager_id, location_id
--
-- Tabla de historial laboral: T1_JOB_HISTORY
-- Columnas más importantes:
--   employee_id, start_date, end_date, job_id, department_id
--
-- Tabla de auditoría: AUDIT_SALARY_ADJUSTMENTS_T1
-- Columnas:
--   audit_id, execution_tag, variant_id, employee_id, department_id,
--   salary_before, salary_after, pct_gap_to_avg_before, rule_applied,
--   executed_by, executed_at, notes
--
-- Tabla de variantes: T1_VARIANTS
-- Columnas:
--   variant_id, variant_name, excluded_department_id, min_years_service,
--   recent_job_history_months, gap_high_threshold_pct,
--   gap_mid_threshold_pct, raise_high_pct, raise_mid_pct,
--   raise_low_pct, max_salary_vs_avg_pct, notes

-- ============================================================
-- GUÍA RÁPIDA DE TÉRMINOS QUE DEBE USAR EN SU SOLUCIÓN
-- ============================================================
-- CTE:
--   Una CTE es una consulta temporal escrita con WITH.
--   Sirve para dividir una consulta grande en partes más claras.
--
--   Ejemplo:
--   WITH dept_stats AS (
--       SELECT department_id, AVG(salary) avg_salary
--       FROM t1_employees
--       GROUP BY department_id
--   )
--   SELECT *
--   FROM dept_stats;
--
-- Función analítica:
--   Es una función como ROW_NUMBER, RANK o DENSE_RANK.
--   Sirve para calcular posiciones o comparaciones sin perder el detalle.
--
--   Ejemplo:
--   DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)
--
-- JOIN:
--   Es la unión entre tablas relacionadas, por ejemplo empleados y departamentos.
--
-- Subconsulta:
--   Es una consulta dentro de otra consulta.
--
-- SAVEPOINT:
--   Es un punto de restauración dentro de una transacción.
--   Permite devolver la operación a un punto intermedio con ROLLBACK TO.

-- ============================================================
-- 1. CONSULTA DIAGNÓSTICA
-- OBJETIVO:
-- Analizar la información antes de actualizar salarios.
--
-- SU CONSULTA DEBE MOSTRAR, COMO MÍNIMO, ESTAS COLUMNAS:
--   employee_id
--   first_name
--   last_name
--   job_id
--   manager_id
--   department_id
--   department_name
--   salary
--   hire_date
--   years_service
--   dept_avg_salary
--   dept_max_salary
--   dept_employee_count
--   pct_gap_to_avg
--   recent_job_history_flag
--   salary_rank_in_department
--
-- QUÉ SIGNIFICA CADA COLUMNA:
--   years_service: años de antigüedad del empleado
--   dept_avg_salary: promedio salarial del departamento
--   dept_max_salary: salario más alto del departamento
--   dept_employee_count: cantidad de empleados del departamento
--   pct_gap_to_avg: porcentaje que le falta al salario del empleado para llegar
--                   al promedio del departamento
--   recent_job_history_flag: SI o NO, según si tuvo historial reciente
--   salary_rank_in_department: posición salarial dentro del departamento
--
-- IMPORTANTE:
-- - Puede usar una o varias CTE
-- - Debe usar al menos una función analítica
-- - Debe unir como mínimo T1_EMPLOYEES con T1_DEPARTMENTS
-- - Debe revisar T1_JOB_HISTORY para detectar historial reciente
-- ============================================================

PROMPT ===== 1. CONSULTA DIAGNÓSTICA =====

-- ESCRIBA AQUÍ SU CONSULTA DIAGNÓSTICA PRINCIPAL

WITH v AS (
    SELECT *
    FROM t1_variants
    WHERE variant_id = &p_variant_id
),
dept_stats AS (
    SELECT
        e.department_id,
        AVG(e.salary) AS dept_avg_salary,
        MAX(e.salary) AS dept_max_salary,
        COUNT(*) AS dept_employee_count
    FROM t1_employees e
    GROUP BY e.department_id
),
recent_history AS (
    SELECT DISTINCT j.employee_id
    FROM t1_job_history j
    CROSS JOIN v
    WHERE j.end_date >= ADD_MONTHS(TRUNC(SYSDATE), -v.recent_job_history_months)
),
diagnostic_base AS (
    SELECT
        e.employee_id,
        e.first_name,
        e.last_name,
        e.job_id,
        e.manager_id,
        e.department_id,
        d.department_name,
        e.salary,
        e.hire_date,
        ROUND(MONTHS_BETWEEN(TRUNC(SYSDATE), e.hire_date) / 12, 2) AS years_service,
        ROUND(ds.dept_avg_salary, 2) AS dept_avg_salary,
        ds.dept_max_salary,
        ds.dept_employee_count,
        ROUND(
            CASE
                WHEN ds.dept_avg_salary > 0 THEN
                    ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100
                ELSE 0
            END
        , 2) AS pct_gap_to_avg,
        CASE
            WHEN rh.employee_id IS NOT NULL THEN 'SI'
            ELSE 'NO'
        END AS recent_job_history_flag,
        DENSE_RANK() OVER (
            PARTITION BY e.department_id
            ORDER BY e.salary DESC
        ) AS salary_rank_in_department
    FROM t1_employees e
    LEFT JOIN t1_departments d
        ON e.department_id = d.department_id
    LEFT JOIN dept_stats ds
        ON e.department_id = ds.department_id
    LEFT JOIN recent_history rh
        ON e.employee_id = rh.employee_id
)
SELECT
    employee_id,
    first_name,
    last_name,
    job_id,
    manager_id,
    department_id,
    department_name,
    salary,
    hire_date,
    years_service,
    dept_avg_salary,
    dept_max_salary,
    dept_employee_count,
    pct_gap_to_avg,
    recent_job_history_flag,
    salary_rank_in_department
FROM diagnostic_base
ORDER BY department_id, salary_rank_in_department, employee_id;
-- Debe devolver las columnas mínimas exigidas arriba.



-- COMENTARIO OBLIGATORIO:
-- Esta consulta diagnóstica consolida la información laboral y salarial de cada
-- empleado antes del ajuste, relacionándola con su departamento, antigüedad,
-- historial reciente y posición salarial interna. Con esto se identifican
-- diferencias frente al promedio del área y se obtiene una base objetiva para
-- decidir quién podría ser elegible y quién debe ser excluido.

-- Explique en 3 a 5 líneas qué demuestra su consulta diagnóstica y por qué
-- le sirve para decidir qué empleados pueden ser elegibles.

-- ============================================================
-- 2. DECISIÓN DE POBLACIÓN ELEGIBLE
-- OBJETIVO:
-- Determinar qué empleados sí califican, cuáles no califican y por qué.
--
-- SU CONSULTA DEBE MOSTRAR, COMO MÍNIMO, ESTAS COLUMNAS:
--   employee_id
--   first_name
--   last_name
--   department_id
--   department_name
--   salary
--   years_service
--   dept_avg_salary
--   dept_max_salary
--   dept_employee_count
--   pct_gap_to_avg
--   recent_job_history_flag
--   manager_or_exec_flag
--   eligibility_flag
--   exclusion_reason
--   adjustment_pct
--   rule_applied
--
-- QUÉ SIGNIFICA CADA COLUMNA:
--   manager_or_exec_flag: SI o NO, según si es gerente principal o alta dirección
--   eligibility_flag: ELEGIBLE o NO_ELEGIBLE
--   exclusion_reason: motivo de exclusión, por ejemplo:
--                     SIN_DEPARTAMENTO, HISTORIAL_RECIENTE,
--                     ANTIGUEDAD_INSUFICIENTE, MANAGER_O_DIRECTIVO,
--                     DEPTO_EXCLUIDO, DEPTO_MENOR_A_3, SALARIO_NO_APLICA
--   adjustment_pct: porcentaje de ajuste que le corresponde
--   rule_applied: regla aplicada, por ejemplo AJUSTE_ALTO, AJUSTE_MEDIO, AJUSTE_BAJO
--
-- IMPORTANTE:
-- - Debe tomar en cuenta la variante asignada por el docente
-- - Debe usar los valores de T1_VARIANTS según &p_variant_id
-- - Debe quedar visible por qué una persona sí o no entra al proceso
-- ============================================================

PROMPT ===== 2. DECISIÓN DE ELEGIBLES =====

-- ESCRIBA AQUÍ SU CONSULTA DE DECISIÓN DE ELEGIBLES
WITH v AS (
    SELECT *
    FROM t1_variants
    WHERE variant_id = &p_variant_id
),
dept_stats AS (
    SELECT
        e.department_id,
        AVG(e.salary) AS dept_avg_salary,
        MAX(e.salary) AS dept_max_salary,
        COUNT(*) AS dept_employee_count
    FROM t1_employees e
    GROUP BY e.department_id
),
recent_history AS (
    SELECT DISTINCT j.employee_id
    FROM t1_job_history j
    CROSS JOIN v
    WHERE j.end_date >= ADD_MONTHS(TRUNC(SYSDATE), -v.recent_job_history_months)
),
manager_list AS (
    SELECT DISTINCT manager_id AS employee_id
    FROM t1_employees
    WHERE manager_id IS NOT NULL
),
diagnostic_base AS (
    SELECT
        e.employee_id,
        e.first_name,
        e.last_name,
        e.job_id,
        e.manager_id,
        e.department_id,
        d.department_name,
        e.salary,
        e.hire_date,
        ROUND(MONTHS_BETWEEN(TRUNC(SYSDATE), e.hire_date) / 12, 2) AS years_service,
        ROUND(ds.dept_avg_salary, 2) AS dept_avg_salary,
        ds.dept_max_salary,
        ds.dept_employee_count,
        ROUND(
            CASE
                WHEN ds.dept_avg_salary > 0 THEN
                    ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100
                ELSE 0
            END
        , 2) AS pct_gap_to_avg,
        CASE
            WHEN rh.employee_id IS NOT NULL THEN 'SI'
            ELSE 'NO'
        END AS recent_job_history_flag,
        CASE
            WHEN ml.employee_id IS NOT NULL
                 OR e.job_id LIKE '%MAN%'
                 OR e.job_id LIKE '%MGR%'
                 OR e.job_id LIKE 'AD_%'
            THEN 'SI'
            ELSE 'NO'
        END AS manager_or_exec_flag
    FROM t1_employees e
    LEFT JOIN t1_departments d
        ON e.department_id = d.department_id
    LEFT JOIN dept_stats ds
        ON e.department_id = ds.department_id
    LEFT JOIN recent_history rh
        ON e.employee_id = rh.employee_id
    LEFT JOIN manager_list ml
        ON e.employee_id = ml.employee_id
),
eligibility AS (
    SELECT
        db.employee_id,
        db.first_name,
        db.last_name,
        db.department_id,
        db.department_name,
        db.salary,
        db.years_service,
        db.dept_avg_salary,
        db.dept_max_salary,
        db.dept_employee_count,
        db.pct_gap_to_avg,
        db.recent_job_history_flag,
        db.manager_or_exec_flag,
        CASE
            WHEN db.department_id IS NULL THEN 'NO_ELEGIBLE'
            WHEN db.recent_job_history_flag = 'SI' THEN 'NO_ELEGIBLE'
            WHEN db.years_service < v.min_years_service THEN 'NO_ELEGIBLE'
            WHEN db.manager_or_exec_flag = 'SI' THEN 'NO_ELEGIBLE'
            WHEN db.department_id = v.excluded_department_id THEN 'NO_ELEGIBLE'
            WHEN db.dept_employee_count < 3 THEN 'NO_ELEGIBLE'
            WHEN db.pct_gap_to_avg <= 0 THEN 'NO_ELEGIBLE'
            ELSE 'ELEGIBLE'
        END AS eligibility_flag,
        CASE
            WHEN db.department_id IS NULL THEN 'SIN_DEPARTAMENTO'
            WHEN db.recent_job_history_flag = 'SI' THEN 'HISTORIAL_RECIENTE'
            WHEN db.years_service < v.min_years_service THEN 'ANTIGUEDAD_INSUFICIENTE'
            WHEN db.manager_or_exec_flag = 'SI' THEN 'MANAGER_O_DIRECTIVO'
            WHEN db.department_id = v.excluded_department_id THEN 'DEPTO_EXCLUIDO'
            WHEN db.dept_employee_count < 3 THEN 'DEPTO_MENOR_A_3'
            WHEN db.pct_gap_to_avg <= 0 THEN 'SALARIO_NO_APLICA'
            ELSE 'APLICA'
        END AS exclusion_reason,
        CASE
            WHEN db.department_id IS NULL THEN 0
            WHEN db.recent_job_history_flag = 'SI' THEN 0
            WHEN db.years_service < v.min_years_service THEN 0
            WHEN db.manager_or_exec_flag = 'SI' THEN 0
            WHEN db.department_id = v.excluded_department_id THEN 0
            WHEN db.dept_employee_count < 3 THEN 0
            WHEN db.pct_gap_to_avg >= v.gap_high_threshold_pct THEN v.raise_high_pct
            WHEN db.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN v.raise_mid_pct
            WHEN db.pct_gap_to_avg > 0 THEN v.raise_low_pct
            ELSE 0
        END AS adjustment_pct,
        CASE
            WHEN db.department_id IS NULL THEN 'NO_APLICA'
            WHEN db.recent_job_history_flag = 'SI' THEN 'NO_APLICA'
            WHEN db.years_service < v.min_years_service THEN 'NO_APLICA'
            WHEN db.manager_or_exec_flag = 'SI' THEN 'NO_APLICA'
            WHEN db.department_id = v.excluded_department_id THEN 'NO_APLICA'
            WHEN db.dept_employee_count < 3 THEN 'NO_APLICA'
            WHEN db.pct_gap_to_avg >= v.gap_high_threshold_pct THEN 'AJUSTE_ALTO'
            WHEN db.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN 'AJUSTE_MEDIO'
            WHEN db.pct_gap_to_avg > 0 THEN 'AJUSTE_BAJO'
            ELSE 'NO_APLICA'
        END AS rule_applied
    FROM diagnostic_base db
    CROSS JOIN v
)
SELECT
    employee_id,
    first_name,
    last_name,
    department_id,
    department_name,
    salary,
    years_service,
    dept_avg_salary,
    dept_max_salary,
    dept_employee_count,
    pct_gap_to_avg,
    recent_job_history_flag,
    manager_or_exec_flag,
    eligibility_flag,
    exclusion_reason,
    adjustment_pct,
    rule_applied
FROM eligibility
ORDER BY eligibility_flag DESC, department_id, employee_id;
-- Debe devolver las columnas mínimas exigidas arriba.



-- COMENTARIO OBLIGATORIO:
-- En esta consulta se aplican las reglas definidas en la variante seleccionada,
-- evaluando exclusiones por departamento, antigüedad, historial reciente,
-- perfil gerencial/directivo y tamaño del departamento. Solo se consideran
-- elegibles los empleados con brecha salarial positiva y que cumplen todas
-- las restricciones del caso, asignando además el porcentaje de ajuste aplicable.

-- Explique en 3 a 5 líneas cómo aplicó la variante y por qué su población
-- elegible sí cumple las reglas del caso.

-- ============================================================
-- 3. PREVALIDACIÓN ANTES DE LA TRANSACCIÓN
-- OBJETIVO:
-- Mostrar qué pasaría antes de ejecutar el cambio real.
--
-- DEBE MOSTRAR, COMO MÍNIMO:
-- A. Un resumen con estas columnas:
--    total_eligible_employees
--    total_salary_before
--    total_salary_after
--    total_increment
--
-- B. Un detalle de empleados elegibles con estas columnas:
--    employee_id
--    department_id
--    salary_before
--    salary_after
--    adjustment_pct
--    rule_applied
--
-- C. Un control de topes por departamento con estas columnas:
--    department_id
--    department_name
--    dept_avg_salary
--    dept_max_salary
--    max_allowed_salary_by_variant
--
-- QUÉ SIGNIFICA:
--   total_salary_before: suma de salarios antes del ajuste
--   total_salary_after: suma de salarios proyectados después del ajuste
--   total_increment: incremento total proyectado
--   max_allowed_salary_by_variant: salario máximo permitido según la variante
-- ============================================================

PROMPT ===== 3. PREVALIDACIÓN =====

-- ESCRIBA AQUÍ SU CONSULTA O SUS CONSULTAS DE PREVALIDACIÓN

PROMPT --- 3A. RESUMEN ---
WITH v AS (
    SELECT *
    FROM t1_variants
    WHERE variant_id = &p_variant_id
),
dept_stats AS (
    SELECT
        e.department_id,
        AVG(e.salary) AS dept_avg_salary,
        MAX(e.salary) AS dept_max_salary,
        COUNT(*) AS dept_employee_count
    FROM t1_employees e
    GROUP BY e.department_id
),
recent_history AS (
    SELECT DISTINCT j.employee_id
    FROM t1_job_history j
    CROSS JOIN v
    WHERE j.end_date >= ADD_MONTHS(TRUNC(SYSDATE), -v.recent_job_history_months)
),
manager_list AS (
    SELECT DISTINCT manager_id AS employee_id
    FROM t1_employees
    WHERE manager_id IS NOT NULL
),
eligible_population AS (
    SELECT
        e.employee_id,
        e.department_id,
        d.department_name,
        e.salary AS salary_before,
        ROUND(ds.dept_avg_salary, 2) AS dept_avg_salary,
        ds.dept_max_salary,
        ds.dept_employee_count,
        ROUND(
            CASE
                WHEN ds.dept_avg_salary > 0 THEN
                    ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100
                ELSE 0
            END
        , 2) AS pct_gap_to_avg,
        CASE
            WHEN rh.employee_id IS NOT NULL THEN 'SI'
            ELSE 'NO'
        END AS recent_job_history_flag,
        CASE
            WHEN ml.employee_id IS NOT NULL
                 OR e.job_id LIKE '%MAN%'
                 OR e.job_id LIKE '%MGR%'
                 OR e.job_id LIKE 'AD_%'
            THEN 'SI'
            ELSE 'NO'
        END AS manager_or_exec_flag,
        ROUND(MONTHS_BETWEEN(TRUNC(SYSDATE), e.hire_date) / 12, 2) AS years_service
    FROM t1_employees e
    LEFT JOIN t1_departments d
        ON e.department_id = d.department_id
    LEFT JOIN dept_stats ds
        ON e.department_id = ds.department_id
    LEFT JOIN recent_history rh
        ON e.employee_id = rh.employee_id
    LEFT JOIN manager_list ml
        ON e.employee_id = ml.employee_id
),
final_eligible AS (
    SELECT
        ep.*,
        CASE
            WHEN ep.department_id IS NULL THEN 0
            WHEN ep.recent_job_history_flag = 'SI' THEN 0
            WHEN ep.years_service < v.min_years_service THEN 0
            WHEN ep.manager_or_exec_flag = 'SI' THEN 0
            WHEN ep.department_id = v.excluded_department_id THEN 0
            WHEN ep.dept_employee_count < 3 THEN 0
            WHEN ep.pct_gap_to_avg >= v.gap_high_threshold_pct THEN v.raise_high_pct
            WHEN ep.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN v.raise_mid_pct
            WHEN ep.pct_gap_to_avg > 0 THEN v.raise_low_pct
            ELSE 0
        END AS adjustment_pct,
        CASE
            WHEN ep.department_id IS NULL THEN 'NO_APLICA'
            WHEN ep.recent_job_history_flag = 'SI' THEN 'NO_APLICA'
            WHEN ep.years_service < v.min_years_service THEN 'NO_APLICA'
            WHEN ep.manager_or_exec_flag = 'SI' THEN 'NO_APLICA'
            WHEN ep.department_id = v.excluded_department_id THEN 'NO_APLICA'
            WHEN ep.dept_employee_count < 3 THEN 'NO_APLICA'
            WHEN ep.pct_gap_to_avg >= v.gap_high_threshold_pct THEN 'AJUSTE_ALTO'
            WHEN ep.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN 'AJUSTE_MEDIO'
            WHEN ep.pct_gap_to_avg > 0 THEN 'AJUSTE_BAJO'
            ELSE 'NO_APLICA'
        END AS rule_applied,
        ROUND(ep.dept_avg_salary * (v.max_salary_vs_avg_pct / 100), 2) AS max_allowed_salary_by_variant
    FROM eligible_population ep
    CROSS JOIN v
    WHERE ep.department_id IS NOT NULL
      AND ep.recent_job_history_flag = 'NO'
      AND ep.years_service >= v.min_years_service
      AND ep.manager_or_exec_flag = 'NO'
      AND ep.department_id <> v.excluded_department_id
      AND ep.dept_employee_count >= 3
      AND ep.pct_gap_to_avg > 0
),
projection AS (
    SELECT
        employee_id,
        department_id,
        department_name,
        salary_before,
        ROUND(salary_before * (1 + adjustment_pct / 100), 2) AS salary_after,
        adjustment_pct,
        rule_applied,
        dept_avg_salary,
        dept_max_salary,
        max_allowed_salary_by_variant
    FROM final_eligible
)
SELECT
    COUNT(*) AS total_eligible_employees,
    ROUND(SUM(salary_before), 2) AS total_salary_before,
    ROUND(SUM(salary_after), 2) AS total_salary_after,
    ROUND(SUM(salary_after - salary_before), 2) AS total_increment
FROM projection;

PROMPT --- 3B. DETALLE DE ELEGIBLES ---
WITH v AS (
    SELECT *
    FROM t1_variants
    WHERE variant_id = &p_variant_id
),
dept_stats AS (
    SELECT
        e.department_id,
        AVG(e.salary) AS dept_avg_salary,
        MAX(e.salary) AS dept_max_salary,
        COUNT(*) AS dept_employee_count
    FROM t1_employees e
    GROUP BY e.department_id
),
recent_history AS (
    SELECT DISTINCT j.employee_id
    FROM t1_job_history j
    CROSS JOIN v
    WHERE j.end_date >= ADD_MONTHS(TRUNC(SYSDATE), -v.recent_job_history_months)
),
manager_list AS (
    SELECT DISTINCT manager_id AS employee_id
    FROM t1_employees
    WHERE manager_id IS NOT NULL
),
eligible_population AS (
    SELECT
        e.employee_id,
        e.department_id,
        d.department_name,
        e.salary AS salary_before,
        ROUND(ds.dept_avg_salary, 2) AS dept_avg_salary,
        ds.dept_max_salary,
        ds.dept_employee_count,
        ROUND(
            CASE
                WHEN ds.dept_avg_salary > 0 THEN
                    ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100
                ELSE 0
            END
        , 2) AS pct_gap_to_avg,
        CASE
            WHEN rh.employee_id IS NOT NULL THEN 'SI'
            ELSE 'NO'
        END AS recent_job_history_flag,
        CASE
            WHEN ml.employee_id IS NOT NULL
                 OR e.job_id LIKE '%MAN%'
                 OR e.job_id LIKE '%MGR%'
                 OR e.job_id LIKE 'AD_%'
            THEN 'SI'
            ELSE 'NO'
        END AS manager_or_exec_flag,
        ROUND(MONTHS_BETWEEN(TRUNC(SYSDATE), e.hire_date) / 12, 2) AS years_service
    FROM t1_employees e
    LEFT JOIN t1_departments d
        ON e.department_id = d.department_id
    LEFT JOIN dept_stats ds
        ON e.department_id = ds.department_id
    LEFT JOIN recent_history rh
        ON e.employee_id = rh.employee_id
    LEFT JOIN manager_list ml
        ON e.employee_id = ml.employee_id
),
projection AS (
    SELECT
        ep.employee_id,
        ep.department_id,
        ep.salary_before,
        ROUND(
            ep.salary_before * (
                1 + (
                    CASE
                        WHEN ep.pct_gap_to_avg >= v.gap_high_threshold_pct THEN v.raise_high_pct
                        WHEN ep.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN v.raise_mid_pct
                        WHEN ep.pct_gap_to_avg > 0 THEN v.raise_low_pct
                        ELSE 0
                    END
                ) / 100
            ),
            2
        ) AS salary_after,
        CASE
            WHEN ep.pct_gap_to_avg >= v.gap_high_threshold_pct THEN v.raise_high_pct
            WHEN ep.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN v.raise_mid_pct
            WHEN ep.pct_gap_to_avg > 0 THEN v.raise_low_pct
            ELSE 0
        END AS adjustment_pct,
        CASE
            WHEN ep.pct_gap_to_avg >= v.gap_high_threshold_pct THEN 'AJUSTE_ALTO'
            WHEN ep.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN 'AJUSTE_MEDIO'
            WHEN ep.pct_gap_to_avg > 0 THEN 'AJUSTE_BAJO'
            ELSE 'NO_APLICA'
        END AS rule_applied
    FROM eligible_population ep
    CROSS JOIN v
    WHERE ep.department_id IS NOT NULL
      AND ep.recent_job_history_flag = 'NO'
      AND ep.years_service >= v.min_years_service
      AND ep.manager_or_exec_flag = 'NO'
      AND ep.department_id <> v.excluded_department_id
      AND ep.dept_employee_count >= 3
      AND ep.pct_gap_to_avg > 0
)
SELECT
    employee_id,
    department_id,
    salary_before,
    salary_after,
    adjustment_pct,
    rule_applied
FROM projection
ORDER BY department_id, employee_id;

PROMPT --- 3C. CONTROL DE TOPES ---
WITH v AS (
    SELECT *
    FROM t1_variants
    WHERE variant_id = &p_variant_id
),
dept_stats AS (
    SELECT
        e.department_id,
        d.department_name,
        ROUND(AVG(e.salary), 2) AS dept_avg_salary,
        MAX(e.salary) AS dept_max_salary
    FROM t1_employees e
    LEFT JOIN t1_departments d
        ON e.department_id = d.department_id
    GROUP BY e.department_id, d.department_name
)
SELECT
    department_id,
    department_name,
    dept_avg_salary,
    dept_max_salary,
    ROUND(dept_avg_salary * (v.max_salary_vs_avg_pct / 100), 2) AS max_allowed_salary_by_variant
FROM dept_stats
CROSS JOIN v
ORDER BY department_id;



-- Debe mostrar el resumen, el detalle y el control de topes.



-- ============================================================
-- 4. EJECUCIÓN TRANSACCIONAL
-- OBJETIVO:
-- Ejecutar la actualización real y registrar la auditoría.
--
-- DEBE INCLUIR OBLIGATORIAMENTE:
-- 1. SAVEPOINT
-- 2. UPDATE o MERGE para actualizar salarios
-- 3. INSERT a AUDIT_SALARY_ADJUSTMENTS_T1
-- 4. Validación intermedia
-- 5. COMMIT o ROLLBACK TO SAVEPOINT
--
-- IMPORTANTE:
-- - La auditoría debe usar el valor &p_execution_tag
-- - La auditoría debe usar el valor &p_variant_id
-- - Debe usar la secuencia AUDIT_SALARY_ADJ_T1_SEQ.NEXTVAL
-- ============================================================

PROMPT ===== 4. EJECUCIÓN TRANSACCIONAL =====

SAVEPOINT sv_before_adjustment;

-- 4.1 ACTUALIZACIÓN DE SALARIOS
-- ESCRIBA AQUÍ SU UPDATE O MERGE
MERGE INTO t1_employees e
USING (
    WITH v AS (
        SELECT *
        FROM t1_variants
        WHERE variant_id = &p_variant_id
    ),
    dept_stats AS (
        SELECT
            emp.department_id,
            AVG(emp.salary) AS dept_avg_salary,
            MAX(emp.salary) AS dept_max_salary,
            COUNT(*) AS dept_employee_count
        FROM t1_employees emp
        GROUP BY emp.department_id
    ),
    recent_history AS (
        SELECT DISTINCT j.employee_id
        FROM t1_job_history j
        CROSS JOIN v
        WHERE j.end_date >= ADD_MONTHS(TRUNC(SYSDATE), -v.recent_job_history_months)
    ),
    manager_list AS (
        SELECT DISTINCT manager_id AS employee_id
        FROM t1_employees
        WHERE manager_id IS NOT NULL
    ),
    eligible_population AS (
        SELECT
            emp.employee_id,
            emp.department_id,
            emp.salary AS salary_before,
            ROUND(ds.dept_avg_salary, 2) AS dept_avg_salary,
            ds.dept_max_salary,
            ds.dept_employee_count,
            ROUND(
                CASE
                    WHEN ds.dept_avg_salary > 0 THEN
                        ((ds.dept_avg_salary - emp.salary) / ds.dept_avg_salary) * 100
                    ELSE 0
                END
            , 2) AS pct_gap_to_avg,
            CASE
                WHEN rh.employee_id IS NOT NULL THEN 'SI'
                ELSE 'NO'
            END AS recent_job_history_flag,
            CASE
                WHEN ml.employee_id IS NOT NULL
                     OR emp.job_id LIKE '%MAN%'
                     OR emp.job_id LIKE '%MGR%'
                     OR emp.job_id LIKE 'AD_%'
                THEN 'SI'
                ELSE 'NO'
            END AS manager_or_exec_flag,
            ROUND(MONTHS_BETWEEN(TRUNC(SYSDATE), emp.hire_date) / 12, 2) AS years_service
        FROM t1_employees emp
        LEFT JOIN dept_stats ds
            ON emp.department_id = ds.department_id
        LEFT JOIN recent_history rh
            ON emp.employee_id = rh.employee_id
        LEFT JOIN manager_list ml
            ON emp.employee_id = ml.employee_id
    ),
    final_eligible AS (
        SELECT
            ep.employee_id,
            ep.department_id,
            ep.salary_before,
            ep.pct_gap_to_avg,
            CASE
                WHEN ep.pct_gap_to_avg >= v.gap_high_threshold_pct THEN v.raise_high_pct
                WHEN ep.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN v.raise_mid_pct
                WHEN ep.pct_gap_to_avg > 0 THEN v.raise_low_pct
                ELSE 0
            END AS adjustment_pct,
            CASE
                WHEN ep.pct_gap_to_avg >= v.gap_high_threshold_pct THEN 'AJUSTE_ALTO'
                WHEN ep.pct_gap_to_avg >= v.gap_mid_threshold_pct THEN 'AJUSTE_MEDIO'
                WHEN ep.pct_gap_to_avg > 0 THEN 'AJUSTE_BAJO'
                ELSE 'NO_APLICA'
            END AS rule_applied,
            ROUND(ep.dept_avg_salary * (v.max_salary_vs_avg_pct / 100), 2) AS allowed_max_salary
        FROM eligible_population ep
        CROSS JOIN v
        WHERE ep.department_id IS NOT NULL
          AND ep.recent_job_history_flag = 'NO'
          AND ep.years_service >= v.min_years_service
          AND ep.manager_or_exec_flag = 'NO'
          AND ep.department_id <> v.excluded_department_id
          AND ep.dept_employee_count >= 3
          AND ep.pct_gap_to_avg > 0
    )
    SELECT
        employee_id,
        department_id,
        salary_before,
        pct_gap_to_avg,
        adjustment_pct,
        rule_applied,
        allowed_max_salary,
        ROUND(salary_before * (1 + adjustment_pct / 100), 2) AS salary_after
    FROM final_eligible
) src
ON (e.employee_id = src.employee_id)
WHEN MATCHED THEN
UPDATE SET e.salary = src.salary_after;
-- Debe actualizar únicamente empleados ELEGIBLES.



-- 4.2 INSERCIÓN EN AUDITORÍA
-- Debe llenar estas columnas de AUDIT_SALARY_ADJUSTMENTS_T1:
--   audit_id               -> usar AUDIT_SALARY_ADJ_T1_SEQ.NEXTVAL
--   execution_tag          -> usar &p_execution_tag
--   variant_id             -> usar &p_variant_id
--   employee_id            -> id del empleado ajustado
--   department_id          -> departamento del empleado
--   salary_before          -> salario antes del ajuste
--   salary_after           -> salario después del ajuste
--   pct_gap_to_avg_before  -> brecha porcentual antes del ajuste
--   rule_applied           -> regla aplicada
--   executed_by            -> USER
--   executed_at            -> SYSDATE
--   notes                  -> comentario libre

INSERT INTO audit_salary_adjustments_t1 (
    audit_id,
    execution_tag,
    variant_id,
    employee_id,
    department_id,
    salary_before,
    salary_after,
    pct_gap_to_avg_before,
    rule_applied,
    executed_by,
    executed_at,
    notes
)
-- ESCRIBA AQUÍ SU SELECT O VALUES PARA INSERTAR LA AUDITORÍA
INSERT INTO audit_salary_adjustments_t1 (
    audit_id,
    execution_tag,
    variant_id,
    employee_id,
    department_id,
    salary_before,
    salary_after,
    pct_gap_to_avg_before,
    rule_applied,
    executed_by,
    executed_at,
    notes
)
WITH v AS (
    SELECT *
    FROM t1_variants
    WHERE variant_id = &p_variant_id
),
dept_stats AS (
    SELECT
        e.department_id,
        AVG(e.salary) AS dept_avg_salary,
        COUNT(*) AS dept_employee_count
    FROM t1_employees e
    GROUP BY e.department_id
),
recent_history AS (
    SELECT DISTINCT j.employee_id
    FROM t1_job_history j
    CROSS JOIN v
    WHERE j.end_date >= ADD_MONTHS(TRUNC(SYSDATE), -v.recent_job_history_months)
),
manager_list AS (
    SELECT DISTINCT manager_id AS employee_id
    FROM t1_employees
    WHERE manager_id IS NOT NULL
),
eligible AS (
    SELECT
        e.employee_id,
        e.department_id,
        e.salary AS salary_after,
        ROUND(
            e.salary / (1 + (
                CASE
                    WHEN ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100 >= v.gap_high_threshold_pct THEN v.raise_high_pct
                    WHEN ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100 >= v.gap_mid_threshold_pct THEN v.raise_mid_pct
                    ELSE v.raise_low_pct
                END
            ) / 100),
        2) AS salary_before,
        ROUND(
            ((ds.dept_avg_salary - (
                e.salary / (1 + (
                    CASE
                        WHEN ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100 >= v.gap_high_threshold_pct THEN v.raise_high_pct
                        WHEN ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100 >= v.gap_mid_threshold_pct THEN v.raise_mid_pct
                        ELSE v.raise_low_pct
                    END
                ) / 100)
            )) / ds.dept_avg_salary) * 100
        , 2) AS pct_gap_to_avg,
        CASE
            WHEN ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100 >= v.gap_high_threshold_pct THEN 'AJUSTE_ALTO'
            WHEN ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100 >= v.gap_mid_threshold_pct THEN 'AJUSTE_MEDIO'
            WHEN ((ds.dept_avg_salary - e.salary) / ds.dept_avg_salary) * 100 > 0 THEN 'AJUSTE_BAJO'
            ELSE 'NO_APLICA'
        END AS rule_applied
    FROM t1_employees e
    LEFT JOIN dept_stats ds ON e.department_id = ds.department_id
    LEFT JOIN recent_history rh ON e.employee_id = rh.employee_id
    LEFT JOIN manager_list ml ON e.employee_id = ml.employee_id
    CROSS JOIN v
    WHERE e.department_id IS NOT NULL
      AND rh.employee_id IS NULL
      AND ml.employee_id IS NULL
      AND e.department_id <> v.excluded_department_id
      AND ds.dept_employee_count >= 3
)
SELECT
    audit_salary_adj_t1_seq.NEXTVAL,
    '&p_execution_tag',
    &p_variant_id,
    employee_id,
    department_id,
    salary_before,
    salary_after,
    pct_gap_to_avg,
    rule_applied,
    USER,
    SYSDATE,
    'Ajuste salarial aplicado'
FROM eligible;

-- 4.3 VALIDACIÓN INTERMEDIA
-- Debe mostrar, como mínimo, estas columnas:
--   employee_id
--   department_id
--   current_salary
--   original_salary
--   allowed_max_salary
--   validation_status
--
-- validation_status debe indicar si cumple o no cumple.

PROMPT ===== 4.3 VALIDACIÓN INTERMEDIA =====

-- ESCRIBA AQUÍ SU CONSULTA DE VALIDACIÓN INTERMEDIA

WITH v AS (
    SELECT *
    FROM t1_variants
    WHERE variant_id = &p_variant_id
),
dept_stats AS (
    SELECT
        e.department_id,
        ROUND(AVG(e.salary), 2) AS dept_avg_salary
    FROM t1_employees e
    GROUP BY e.department_id
)
SELECT
    e.employee_id,
    e.department_id,
    e.salary AS current_salary,
    a.salary_before AS original_salary,
    ROUND(ds.dept_avg_salary * (v.max_salary_vs_avg_pct / 100), 2) AS allowed_max_salary,
    CASE
        WHEN e.salary <= ROUND(ds.dept_avg_salary * (v.max_salary_vs_avg_pct / 100), 2)
        THEN 'CUMPLE'
        ELSE 'NO_CUMPLE'
    END AS validation_status
FROM t1_employees e
JOIN audit_salary_adjustments_t1 a
    ON e.employee_id = a.employee_id
    AND a.execution_tag = '&p_execution_tag'
LEFT JOIN dept_stats ds
    ON e.department_id = ds.department_id
CROSS JOIN v
ORDER BY e.department_id, e.employee_id;

-- 4.4 CONTROL TRANSACCIONAL
-- Debe demostrar UNO de estos escenarios:
-- A. COMMIT si toda la validación es correcta
-- B. ROLLBACK TO SAVEPOINT si detecta incumplimientos
--
-- ESCRIBA AQUÍ SU DECISIÓN TRANSACCIONAL Y AGREGUE UN COMENTARIO
DECLARE
    v_invalid_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_invalid_count
    FROM (
        WITH v AS (
            SELECT *
            FROM t1_variants
            WHERE variant_id = &p_variant_id
        ),
        dept_stats AS (
            SELECT department_id, AVG(salary) AS dept_avg_salary
            FROM t1_employees
            GROUP BY department_id
        )
        SELECT e.employee_id
        FROM t1_employees e
        JOIN audit_salary_adjustments_t1 a
            ON e.employee_id = a.employee_id
            AND a.execution_tag = '&p_execution_tag'
        JOIN dept_stats ds
            ON e.department_id = ds.department_id
        CROSS JOIN v
        WHERE e.salary > (ds.dept_avg_salary * (v.max_salary_vs_avg_pct / 100))
    );

    IF v_invalid_count = 0 THEN
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('COMMIT ejecutado correctamente.');
    ELSE
        BEGIN
            ROLLBACK TO sv_before_adjustment;
            DBMS_OUTPUT.PUT_LINE('ROLLBACK ejecutado: ' || v_invalid_count || ' errores.');
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('No se pudo hacer ROLLBACK al SAVEPOINT.');
        END;
    END IF;
END;
/



-- explicando por qué hizo COMMIT o por qué hizo ROLLBACK.

-- Se realiza la validación de los salarios ajustados frente al límite máximo permitido
-- por la variante. Si todos los empleados cumplen la restricción, se confirma la
-- transacción con COMMIT garantizando la persistencia de los cambios.
-- En caso de detectar incumplimientos, se ejecuta ROLLBACK TO SAVEPOINT para
-- revertir los cambios y mantener la consistencia de los datos.

-- ============================================================
-- 5. VALIDACIÓN POSTERIOR
-- OBJETIVO:
-- Demostrar el resultado final de la transacción.
--
-- DEBE MOSTRAR, COMO MÍNIMO, ESTAS 4 SALIDAS:
--
-- SALIDA 1. Empleados impactados
-- Columnas mínimas:
--   employee_id, first_name, last_name, department_id,
--   salary_before, salary_after, execution_tag


EMPLOYEE_ID FIRST_NAME           LAST_NAME                 DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER EXECUTION_TAG                 
----------- -------------------- ------------------------- ------------- ------------- ------------ ------------------------------
        125 Julia                Nayer                                50          3488      3697,28 MillanGonzalo_FINAL           
        126 Irene                Mikkilineni                          50          2943      3207,87 MillanGonzalo_FINAL           
        127 James                Landry                               50          2616      2851,44 MillanGonzalo_FINAL           
        128 Steven               Markle                               50          2398      2613,82 MillanGonzalo_FINAL           
        129 Laura                Bissot                               50          3498      3707,88 MillanGonzalo_FINAL           
        130 Mozhe                Atkinson                             50          3052      3326,68 MillanGonzalo_FINAL           
        131 James                Marlow                               50          2725      2970,25 MillanGonzalo_FINAL           
        132 TJ                   Olson                                50          2289      2495,01 MillanGonzalo_FINAL           
        133 Jason                Mallin                               50          3498      3707,88 MillanGonzalo_FINAL           
        134 Michael              Rogers                               50          3161      3445,49 MillanGonzalo_FINAL           
        135 Ki                   Gee                                  50          2616      2851,44 MillanGonzalo_FINAL           

EMPLOYEE_ID FIRST_NAME           LAST_NAME                 DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER EXECUTION_TAG                 
----------- -------------------- ------------------------- ------------- ------------- ------------ ------------------------------
        136 Hazel                Philtanker                           50          2398      2613,82 MillanGonzalo_FINAL           
        137 Renske               Ladwig                               50       3704,85         3816 MillanGonzalo_FINAL           
        138 Stephen              Stiles                               50          3488      3697,28 MillanGonzalo_FINAL           
        139 John                 Seo                                  50          2943      3207,87 MillanGonzalo_FINAL           
        140 Joshua               Patel                                50          2725      2970,25 MillanGonzalo_FINAL           
        141 Trenna               Rajs                                 50       3502,97      3713,15 MillanGonzalo_FINAL           
        142 Curtis               Davies                               50       3474,63      3683,11 MillanGonzalo_FINAL           
        143 Randall              Matos                                50          2834      3089,06 MillanGonzalo_FINAL           
        144 Peter                Vargas                               50          2725      2970,25 MillanGonzalo_FINAL           
        180 Winston              Taylor                               50       5728,16         5900 MillanGonzalo_FINAL           
        181 Jean                 Fleaur                               50       5436,89         5600 MillanGonzalo_FINAL           

EMPLOYEE_ID FIRST_NAME           LAST_NAME                 DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER EXECUTION_TAG                 
----------- -------------------- ------------------------- ------------- ------------- ------------ ------------------------------
        182 Martha               Sullivan                             50          2725      2970,25 MillanGonzalo_FINAL           
        183 Girard               Geoni                                50          3052      3326,68 MillanGonzalo_FINAL           
        184 Nandita              Sarchand                             50       4077,67         4200 MillanGonzalo_FINAL           
        185 Alexis               Bull                                 50       3980,58         4100 MillanGonzalo_FINAL           
        186 Julia                Dellinger                            50          3502      3712,12 MillanGonzalo_FINAL           
        187 Anthony              Cabrio                               50          3270       3564,3 MillanGonzalo_FINAL           
        188 Kelly                Chung                                50       3689,32         3800 MillanGonzalo_FINAL           
        189 Jennifer             Dilly                                50       3704,85         3816 MillanGonzalo_FINAL           
        190 Timothy              Venzl                                50          3161      3445,49 MillanGonzalo_FINAL           
        191 Randall              Perkins                              50          2725      2970,25 MillanGonzalo_FINAL           
        192 Sarah                Bell                                 50        3883,5         4000 MillanGonzalo_FINAL           

EMPLOYEE_ID FIRST_NAME           LAST_NAME                 DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER EXECUTION_TAG                 
----------- -------------------- ------------------------- ------------- ------------- ------------ ------------------------------
        193 Britney              Everett                              50       3786,41         3900 MillanGonzalo_FINAL           
        194 Samuel               McLeod                               50          3488      3697,28 MillanGonzalo_FINAL           
        195 Vance                Jones                                50          3052      3326,68 MillanGonzalo_FINAL           
        196 Alana                Walsh                                50       3474,63      3683,11 MillanGonzalo_FINAL           
        197 Kevin                Feeney                               50          3270       3564,3 MillanGonzalo_FINAL           
        198 Donald               OConnell                             50          2834      3089,06 MillanGonzalo_FINAL           
        199 Douglas              Grant                                50          2834      3089,06 MillanGonzalo_FINAL           
        104 Bruce                Miller                               60          6000         6180 MillanGonzalo_FINAL           
        105 David                Williams                             60          5232      5702,88 MillanGonzalo_FINAL           
        106 Valli                Jackson                              60          5232      5702,88 MillanGonzalo_FINAL           
        107 Diana                Nguyen                               60          4578      4990,02 MillanGonzalo_FINAL           

EMPLOYEE_ID FIRST_NAME           LAST_NAME                 DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER EXECUTION_TAG                 
----------- -------------------- ------------------------- ------------- ------------- ------------ ------------------------------
        150 Sean                 Tucker                               80       9708,74        10000 MillanGonzalo_FINAL           
        151 David                Bernstein                            80        9223,3         9500 MillanGonzalo_FINAL           
        152 Peter                Hall                                 80       8737,86         9000 MillanGonzalo_FINAL           
        153 Christopher          Olsen                                80       8726,99       8988,8 MillanGonzalo_FINAL           
        154 Nanette              Cambrault                            80          8175       8665,5 MillanGonzalo_FINAL           
        155 Oliver               Tuvault                              80          7630       8316,7 MillanGonzalo_FINAL           
        156 Janette              King                                 80       9708,74        10000 MillanGonzalo_FINAL           
        157 Patrick              Sully                                80        9223,3         9500 MillanGonzalo_FINAL           
        158 Allan                McEwen                               80       8737,86         9000 MillanGonzalo_FINAL           
        159 Lindsey              Smith                                80       8726,99       8988,8 MillanGonzalo_FINAL           
        160 Louise               Doran                                80          8175       8665,5 MillanGonzalo_FINAL           

EMPLOYEE_ID FIRST_NAME           LAST_NAME                 DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER EXECUTION_TAG                 
----------- -------------------- ------------------------- ------------- ------------- ------------ ------------------------------
        161 Sarath               Sewall                               80          7630       8316,7 MillanGonzalo_FINAL           
        162 Clara                Vishney                              80      10194,17        10500 MillanGonzalo_FINAL           
        163 Danielle             Greene                               80        9223,3         9500 MillanGonzalo_FINAL           
        164 Mattea               Marvins                              80       8070,11      8554,32 MillanGonzalo_FINAL           
        165 David                Lee                                  80          7412      8079,08 MillanGonzalo_FINAL           
        166 Sundar               Ande                                 80          6976      7603,84 MillanGonzalo_FINAL           
        167 Amit                 Banda                                80          6758      7366,22 MillanGonzalo_FINAL           
        168 Lisa                 Ozer                                 80      11165,05        11500 MillanGonzalo_FINAL           
        169 Harrison             Bloom                                80       9708,74        10000 MillanGonzalo_FINAL           
        170 Tayler               Fox                                  80       9320,39         9600 MillanGonzalo_FINAL           
        171 William              Smith                                80       8294,28      8791,94 MillanGonzalo_FINAL           

EMPLOYEE_ID FIRST_NAME           LAST_NAME                 DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER EXECUTION_TAG                 
----------- -------------------- ------------------------- ------------- ------------- ------------ ------------------------------
        172 Elizabeth            Bates                                80        8182,2      8673,13 MillanGonzalo_FINAL           
        173 Sundita              Kumar                                80          6649      7247,41 MillanGonzalo_FINAL           
        174 Ellen                Abel                                 80       8637,46      8896,58 MillanGonzalo_FINAL           
        175 Alyssa               Hutton                               80          8800         9064 MillanGonzalo_FINAL           
        177 Jack                 Livingston                           80          7412      8079,08 MillanGonzalo_FINAL           
        179 Charles              Johnson                              80          6649      7247,41 MillanGonzalo_FINAL           
        109 Daniel               Faviet                              100      15631,07        16100 MillanGonzalo_FINAL           
        110 John                 Chen                                100      11456,31        11800 MillanGonzalo_FINAL           
        111 Ismael               Sciarra                             100      11407,77        11750 MillanGonzalo_FINAL           
        112 Jose Manuel          Urman                               100          6758      7366,22 MillanGonzalo_FINAL           
        113 Luis                 Popp                                100          7085      7722,65 MillanGonzalo_FINAL           

EMPLOYEE_ID FIRST_NAME           LAST_NAME                 DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER EXECUTION_TAG                 
----------- -------------------- ------------------------- ------------- ------------- ------------ ------------------------------
        303 Sara                 Luna                                290          3193      3288,79 MillanGonzalo_FINAL           
        305 Valeria              Nieto                               290       3398,06         3500 MillanGonzalo_FINAL           
        306 Yuri                 Mora                                290       2660,55         2900 MillanGonzalo_FINAL           

80 filas seleccionadas. 


--
-- SALIDA 2. Resumen económico final
-- Columnas mínimas:
--   total_rows_audited, total_salary_before, total_salary_after, total_increment

TOTAL_ROWS_AUDITED TOTAL_SALARY_BEFORE TOTAL_SALARY_AFTER TOTAL_INCREMENT
------------------ ------------------- ------------------ ---------------
                80            452241,7          477038,86        24797,16
--
-- SALIDA 3. Validación de topes
-- Columnas mínimas:
--   employee_id, department_id, salary_after, allowed_max_salary, top_limit_status


EMPLOYEE_ID DEPARTMENT_ID SALARY_AFTER ALLOWED_MAX_SALARY TOP_LIMIT
----------- ------------- ------------ ------------------ ---------
        125            50      3697,28            4675,12 CUMPLE   
        126            50      3207,87            4675,12 CUMPLE   
        127            50      2851,44            4675,12 CUMPLE   
        128            50      2613,82            4675,12 CUMPLE   
        129            50      3707,88            4675,12 CUMPLE   
        130            50      3326,68            4675,12 CUMPLE   
        131            50      2970,25            4675,12 CUMPLE   
        132            50      2495,01            4675,12 CUMPLE   
        133            50      3707,88            4675,12 CUMPLE   
        134            50      3445,49            4675,12 CUMPLE   
        135            50      2851,44            4675,12 CUMPLE   

EMPLOYEE_ID DEPARTMENT_ID SALARY_AFTER ALLOWED_MAX_SALARY TOP_LIMIT
----------- ------------- ------------ ------------------ ---------
        136            50      2613,82            4675,12 CUMPLE   
        137            50         3816            4675,12 CUMPLE   
        138            50      3697,28            4675,12 CUMPLE   
        139            50      3207,87            4675,12 CUMPLE   
        140            50      2970,25            4675,12 CUMPLE   
        141            50      3713,15            4675,12 CUMPLE   
        142            50      3683,11            4675,12 CUMPLE   
        143            50      3089,06            4675,12 CUMPLE   
        144            50      2970,25            4675,12 CUMPLE   
        180            50         5900            4675,12 NO_CUMPLE
        181            50         5600            4675,12 NO_CUMPLE

EMPLOYEE_ID DEPARTMENT_ID SALARY_AFTER ALLOWED_MAX_SALARY TOP_LIMIT
----------- ------------- ------------ ------------------ ---------
        182            50      2970,25            4675,12 CUMPLE   
        183            50      3326,68            4675,12 CUMPLE   
        184            50         4200            4675,12 CUMPLE   
        185            50         4100            4675,12 CUMPLE   
        186            50      3712,12            4675,12 CUMPLE   
        187            50       3564,3            4675,12 CUMPLE   
        188            50         3800            4675,12 CUMPLE   
        189            50         3816            4675,12 CUMPLE   
        190            50      3445,49            4675,12 CUMPLE   
        191            50      2970,25            4675,12 CUMPLE   
        192            50         4000            4675,12 CUMPLE   

EMPLOYEE_ID DEPARTMENT_ID SALARY_AFTER ALLOWED_MAX_SALARY TOP_LIMIT
----------- ------------- ------------ ------------------ ---------
        193            50         3900            4675,12 CUMPLE   
        194            50      3697,28            4675,12 CUMPLE   
        195            50      3326,68            4675,12 CUMPLE   
        196            50      3683,11            4675,12 CUMPLE   
        197            50       3564,3            4675,12 CUMPLE   
        198            50      3089,06            4675,12 CUMPLE   
        199            50      3089,06            4675,12 CUMPLE   
        104            60         6180            7515,04 CUMPLE   
        105            60      5702,88            7515,04 CUMPLE   
        106            60      5702,88            7515,04 CUMPLE   
        107            60      4990,02            7515,04 CUMPLE   

EMPLOYEE_ID DEPARTMENT_ID SALARY_AFTER ALLOWED_MAX_SALARY TOP_LIMIT
----------- ------------- ------------ ------------------ ---------
        150            80        10000           10967,08 CUMPLE   
        151            80         9500           10967,08 CUMPLE   
        152            80         9000           10967,08 CUMPLE   
        153            80       8988,8           10967,08 CUMPLE   
        154            80       8665,5           10967,08 CUMPLE   
        155            80       8316,7           10967,08 CUMPLE   
        156            80        10000           10967,08 CUMPLE   
        157            80         9500           10967,08 CUMPLE   
        158            80         9000           10967,08 CUMPLE   
        159            80       8988,8           10967,08 CUMPLE   
        160            80       8665,5           10967,08 CUMPLE   

EMPLOYEE_ID DEPARTMENT_ID SALARY_AFTER ALLOWED_MAX_SALARY TOP_LIMIT
----------- ------------- ------------ ------------------ ---------
        161            80       8316,7           10967,08 CUMPLE   
        162            80        10500           10967,08 CUMPLE   
        163            80         9500           10967,08 CUMPLE   
        164            80      8554,32           10967,08 CUMPLE   
        165            80      8079,08           10967,08 CUMPLE   
        166            80      7603,84           10967,08 CUMPLE   
        167            80      7366,22           10967,08 CUMPLE   
        168            80        11500           10967,08 NO_CUMPLE
        169            80        10000           10967,08 CUMPLE   
        170            80         9600           10967,08 CUMPLE   
        171            80      8791,94           10967,08 CUMPLE   

EMPLOYEE_ID DEPARTMENT_ID SALARY_AFTER ALLOWED_MAX_SALARY TOP_LIMIT
----------- ------------- ------------ ------------------ ---------
        172            80      8673,13           10967,08 CUMPLE   
        173            80      7247,41           10967,08 CUMPLE   
        174            80      8896,58           10967,08 CUMPLE   
        175            80         9064           10967,08 CUMPLE   
        177            80      8079,08           10967,08 CUMPLE   
        179            80      7247,41           10967,08 CUMPLE   
        109           100        16100           13990,21 NO_CUMPLE
        110           100        11800           13990,21 CUMPLE   
        111           100        11750           13990,21 CUMPLE   
        112           100      7366,22           13990,21 CUMPLE   
        113           100      7722,65           13990,21 CUMPLE   

EMPLOYEE_ID DEPARTMENT_ID SALARY_AFTER ALLOWED_MAX_SALARY TOP_LIMIT
----------- ------------- ------------ ------------------ ---------
        303           290      3288,79            3864,17 CUMPLE   
        305           290         3500            3864,17 CUMPLE   
        306           290         2900            3864,17 CUMPLE   

80 filas seleccionadas. 


--
-- SALIDA 4. Auditoría generada
-- Columnas mínimas:
--   audit_id, execution_tag, variant_id, employee_id, department_id,
--   salary_before, salary_after, rule_applied, executed_by, executed_at


  AUDIT_ID EXECUTION_TAG                  VARIANT_ID EMPLOYEE_ID DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER PCT_GAP_TO_AVG_BEFORE RULE_APPLIED                                                                                         EXECUTED_BY                                                                                          EXECUTED NOTES                                                                                                                                                                                                                                                                                                                                                                                                           
---------- ------------------------------ ---------- ----------- ------------- ------------- ------------ --------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       193 MillanGonzalo_FINAL                     4         104            60          6000         6180                  4,99 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       180 MillanGonzalo_FINAL                     4         105            60          5232      5702,88                 17,15 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       237 MillanGonzalo_FINAL                     4         106            60          5232      5702,88                 17,15 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       161 MillanGonzalo_FINAL                     4         107            60          4578      4990,02                 27,51 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       173 MillanGonzalo_FINAL                     4         109           100      15631,07        16100 -32,96                NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       186 MillanGonzalo_FINAL                     4         110           100      11456,31        11800                  2,55 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       225 MillanGonzalo_FINAL                     4         111           100      11407,77        11750                  2,97 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       216 MillanGonzalo_FINAL                     4         112           100          6758      7366,22                 42,52 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       166 MillanGonzalo_FINAL                     4         113           100          7085      7722,65                 39,74 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       167 MillanGonzalo_FINAL                     4         125            50          3488      3697,28                 11,22 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       218 MillanGonzalo_FINAL                     4         126            50          2943      3207,87                 25,09 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        

  AUDIT_ID EXECUTION_TAG                  VARIANT_ID EMPLOYEE_ID DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER PCT_GAP_TO_AVG_BEFORE RULE_APPLIED                                                                                         EXECUTED_BY                                                                                          EXECUTED NOTES                                                                                                                                                                                                                                                                                                                                                                                                           
---------- ------------------------------ ---------- ----------- ------------- ------------- ------------ --------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       169 MillanGonzalo_FINAL                     4         127            50          2616      2851,44                 33,41 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       219 MillanGonzalo_FINAL                     4         128            50          2398      2613,82                 38,96 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       187 MillanGonzalo_FINAL                     4         129            50          3498      3707,88                 10,96 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       220 MillanGonzalo_FINAL                     4         130            50          3052      3326,68                 22,31 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       175 MillanGonzalo_FINAL                     4         131            50          2725      2970,25                 30,64 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       230 MillanGonzalo_FINAL                     4         132            50          2289      2495,01                 41,74 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       226 MillanGonzalo_FINAL                     4         133            50          3498      3707,88                 10,96 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       170 MillanGonzalo_FINAL                     4         134            50          3161      3445,49                 19,54 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       164 MillanGonzalo_FINAL                     4         135            50          2616      2851,44                 33,41 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       176 MillanGonzalo_FINAL                     4         136            50          2398      2613,82                 38,96 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       206 MillanGonzalo_FINAL                     4         137            50       3704,85         3816                   5,7 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        

  AUDIT_ID EXECUTION_TAG                  VARIANT_ID EMPLOYEE_ID DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER PCT_GAP_TO_AVG_BEFORE RULE_APPLIED                                                                                         EXECUTED_BY                                                                                          EXECUTED NOTES                                                                                                                                                                                                                                                                                                                                                                                                           
---------- ------------------------------ ---------- ----------- ------------- ------------- ------------ --------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       236 MillanGonzalo_FINAL                     4         138            50          3488      3697,28                 11,22 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       231 MillanGonzalo_FINAL                     4         139            50          2943      3207,87                 25,09 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       204 MillanGonzalo_FINAL                     4         140            50          2725      2970,25                 30,64 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       195 MillanGonzalo_FINAL                     4         141            50       3502,97      3713,15                 10,84 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       212 MillanGonzalo_FINAL                     4         142            50       3474,63      3683,11                 11,56 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       177 MillanGonzalo_FINAL                     4         143            50          2834      3089,06                 27,86 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       223 MillanGonzalo_FINAL                     4         144            50          2725      2970,25                 30,64 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       238 MillanGonzalo_FINAL                     4         150            80       9708,74        10000 -5,35                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       214 MillanGonzalo_FINAL                     4         151            80        9223,3         9500 -0,08                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       217 MillanGonzalo_FINAL                     4         152            80       8737,86         9000                  5,19 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       228 MillanGonzalo_FINAL                     4         153            80       8726,99       8988,8                  5,31 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        

  AUDIT_ID EXECUTION_TAG                  VARIANT_ID EMPLOYEE_ID DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER PCT_GAP_TO_AVG_BEFORE RULE_APPLIED                                                                                         EXECUTED_BY                                                                                          EXECUTED NOTES                                                                                                                                                                                                                                                                                                                                                                                                           
---------- ------------------------------ ---------- ----------- ------------- ------------- ------------ --------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       233 MillanGonzalo_FINAL                     4         154            80          8175       8665,5                  11,3 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       202 MillanGonzalo_FINAL                     4         155            80          7630       8316,7                 17,21 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       213 MillanGonzalo_FINAL                     4         156            80       9708,74        10000 -5,35                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       209 MillanGonzalo_FINAL                     4         157            80        9223,3         9500 -0,08                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       168 MillanGonzalo_FINAL                     4         158            80       8737,86         9000                  5,19 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       181 MillanGonzalo_FINAL                     4         159            80       8726,99       8988,8                  5,31 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       240 MillanGonzalo_FINAL                     4         160            80          8175       8665,5                  11,3 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       163 MillanGonzalo_FINAL                     4         161            80          7630       8316,7                 17,21 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       183 MillanGonzalo_FINAL                     4         162            80      10194,17        10500 -10,61                NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       182 MillanGonzalo_FINAL                     4         163            80        9223,3         9500 -0,08                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       229 MillanGonzalo_FINAL                     4         164            80       8070,11      8554,32                 12,43 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        

  AUDIT_ID EXECUTION_TAG                  VARIANT_ID EMPLOYEE_ID DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER PCT_GAP_TO_AVG_BEFORE RULE_APPLIED                                                                                         EXECUTED_BY                                                                                          EXECUTED NOTES                                                                                                                                                                                                                                                                                                                                                                                                           
---------- ------------------------------ ---------- ----------- ------------- ------------- ------------ --------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       234 MillanGonzalo_FINAL                     4         165            80          7412      8079,08                 19,57 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       165 MillanGonzalo_FINAL                     4         166            80          6976      7603,84                 24,31 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       221 MillanGonzalo_FINAL                     4         167            80          6758      7366,22                 26,67 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       184 MillanGonzalo_FINAL                     4         168            80      11165,05        11500 -21,15                NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       210 MillanGonzalo_FINAL                     4         169            80       9708,74        10000 -5,35                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       215 MillanGonzalo_FINAL                     4         170            80       9320,39         9600 -1,13                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       222 MillanGonzalo_FINAL                     4         171            80       8294,28      8791,94                    10 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       185 MillanGonzalo_FINAL                     4         172            80        8182,2      8673,13                 11,22 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       162 MillanGonzalo_FINAL                     4         173            80          6649      7247,41                 27,85 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       199 MillanGonzalo_FINAL                     4         174            80       8637,46      8896,58                  6,28 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       235 MillanGonzalo_FINAL                     4         175            80          8800         9064                  4,51 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        

  AUDIT_ID EXECUTION_TAG                  VARIANT_ID EMPLOYEE_ID DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER PCT_GAP_TO_AVG_BEFORE RULE_APPLIED                                                                                         EXECUTED_BY                                                                                          EXECUTED NOTES                                                                                                                                                                                                                                                                                                                                                                                                           
---------- ------------------------------ ---------- ----------- ------------- ------------- ------------ --------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       200 MillanGonzalo_FINAL                     4         177            80          7412      8079,08                 19,57 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       191 MillanGonzalo_FINAL                     4         179            80          6649      7247,41                 27,85 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       178 MillanGonzalo_FINAL                     4         180            50       5728,16         5900 -45,8                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       224 MillanGonzalo_FINAL                     4         181            50       5436,89         5600 -38,39                NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       239 MillanGonzalo_FINAL                     4         182            50          2725      2970,25                 30,64 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       171 MillanGonzalo_FINAL                     4         183            50          3052      3326,68                 22,31 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       188 MillanGonzalo_FINAL                     4         184            50       4077,67         4200 -3,79                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       189 MillanGonzalo_FINAL                     4         185            50       3980,58         4100 -1,32                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       207 MillanGonzalo_FINAL                     4         186            50          3502      3712,12                 10,86 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       197 MillanGonzalo_FINAL                     4         187            50          3270       3564,3                 16,77 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       196 MillanGonzalo_FINAL                     4         188            50       3689,32         3800                  6,09 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        

  AUDIT_ID EXECUTION_TAG                  VARIANT_ID EMPLOYEE_ID DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER PCT_GAP_TO_AVG_BEFORE RULE_APPLIED                                                                                         EXECUTED_BY                                                                                          EXECUTED NOTES                                                                                                                                                                                                                                                                                                                                                                                                           
---------- ------------------------------ ---------- ----------- ------------- ------------- ------------ --------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       172 MillanGonzalo_FINAL                     4         189            50       3704,85         3816                   5,7 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       192 MillanGonzalo_FINAL                     4         190            50          3161      3445,49                 19,54 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       205 MillanGonzalo_FINAL                     4         191            50          2725      2970,25                 30,64 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       232 MillanGonzalo_FINAL                     4         192            50        3883,5         4000                  1,15 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       227 MillanGonzalo_FINAL                     4         193            50       3786,41         3900                  3,62 AJUSTE_BAJO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       203 MillanGonzalo_FINAL                     4         194            50          3488      3697,28                 11,22 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       198 MillanGonzalo_FINAL                     4         195            50          3052      3326,68                 22,31 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       190 MillanGonzalo_FINAL                     4         196            50       3474,63      3683,11                 11,56 AJUSTE_MEDIO                                                                                         GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       211 MillanGonzalo_FINAL                     4         197            50          3270       3564,3                 16,77 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       179 MillanGonzalo_FINAL                     4         198            50          2834      3089,06                 27,86 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       208 MillanGonzalo_FINAL                     4         199            50          2834      3089,06                 27,86 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        

  AUDIT_ID EXECUTION_TAG                  VARIANT_ID EMPLOYEE_ID DEPARTMENT_ID SALARY_BEFORE SALARY_AFTER PCT_GAP_TO_AVG_BEFORE RULE_APPLIED                                                                                         EXECUTED_BY                                                                                          EXECUTED NOTES                                                                                                                                                                                                                                                                                                                                                                                                           
---------- ------------------------------ ---------- ----------- ------------- ------------- ------------ --------------------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       201 MillanGonzalo_FINAL                     4         303           290          3193      3288,79                  1,67 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       174 MillanGonzalo_FINAL                     4         305           290       3398,06         3500 -4,65                 NO_APLICA                                                                                            GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        
       194 MillanGonzalo_FINAL                     4         306           290       2660,55         2900                 18,07 AJUSTE_ALTO                                                                                          GAAYALA                                                                                              27/04/26 Ajuste salarial aplicado                                                                                                                                                                                                                                                                                                                                                                                        

80 filas seleccionadas. 




--
-- IMPORTANTE:
-- Todas las validaciones posteriores deben filtrar por &p_execution_tag
-- ============================================================

PROMPT ===== 5. VALIDACIÓN POSTERIOR =====

-- SALIDA 1. EMPLEADOS IMPACTADOS



-- SALIDA 2. RESUMEN ECONÓMICO FINAL



-- SALIDA 3. VALIDACIÓN DE TOPES



-- SALIDA 4. AUDITORÍA GENERADA



-- ============================================================
-- 6. JUSTIFICACIÓN TÉCNICA
-- Responder dentro del script, en comentarios.
-- Cada respuesta debe tener entre 3 y 6 líneas.
-- ============================================================

-- ATOMICIDAD:
-- Explique cómo su solución demuestra atomicidad.
--
-- RESPUESTA:
--La solución demuestra atomicidad al ejecutar todo el proceso
-- (ajuste salarial, auditoría y validación) dentro de una misma
-- unidad de transacción. Si ocurre algún incumplimiento en las
-- validaciones, se realiza un ROLLBACK al SAVEPOINT, evitando
-- que los cambios queden parcialmente aplicados.
-- CONSISTENCIA:
-- Explique cómo su solución asegura que los datos quedan válidos
-- después de la operación.
--
-- RESPUESTA:
-- Se asegura la consistencia mediante reglas de negocio claras,
-- como límites salariales por promedio departamental y filtros
-- de elegibilidad. Además, la validación posterior verifica que
-- ningún salario supere el máximo permitido, garantizando que
-- los datos finales cumplen las restricciones definidas.
-- AISLAMIENTO:
-- Explique cómo se comportaría su transacción frente a otras sesiones.
--
-- RESPUESTA:
-- La transacción se ejecuta de forma aislada, por lo que otras
-- sesiones no ven los cambios hasta que se realiza el COMMIT.
-- Esto evita lecturas inconsistentes o intermedias mientras se
-- aplican los ajustes y se registran en la auditoría.
-- DURABILIDAD:
-- Explique qué garantiza la persistencia del cambio una vez confirmado.
--
-- RESPUESTA:
-- Una vez ejecutado el COMMIT, los cambios quedan almacenados
-- permanentemente en la base de datos. Oracle garantiza que la
-- información persiste incluso ante fallos del sistema, gracias
-- a sus mecanismos internos de redo logs y recuperación.

-- USO DE SAVEPOINT / ROLLBACK:
-- Explique qué riesgo controló y por qué ese punto de restauración
-- era necesario.
--
-- RESPUESTA:
-- El SAVEPOINT permite definir un punto seguro antes de aplicar
-- los ajustes salariales. Si la validación detecta errores, se
-- hace ROLLBACK a este punto, evitando inconsistencias y
-- permitiendo revertir solo esta operación sin afectar otras.
```

