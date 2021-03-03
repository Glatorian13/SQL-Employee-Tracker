INSERT INTO department(dept_name) VALUES('Sales'), ('Service'), ('Office');
INSERT INTO emp_role(title, salary, department_id) VALUES
('Sales Manager', 45000.00, 1),
('Sales Consultant', 35000.00, 1),
('Service Manager', 42000.00,2),
('Technician', 37000.00, 2),
('Service Advisor', 35000.00, 2),
('Customer Care Rep', 32500.00, 3),
('Owner', 25000.00, 3),
('Accountant', 40000.00, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
('Olivia', 'Norton', 7, null),
('Zach', 'Larson', 1, 1),
('Joe', 'Salazar', 2, 2),
('Hubert', 'Rogers', 3, 1),
('Sandra', 'Harmon', 4, 4);