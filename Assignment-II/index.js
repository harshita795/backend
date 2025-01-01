const express = require("express");
const app = express();
const { sequelize } = require("./lib/index.js");
const {
  department,
  role,
  employee,
  employeeDepartment,
  employeeRole,
} = require("./models/index.js");

app.use(express.json());

app.get("/seed_db", async (req, res) => {
  await sequelize.sync({ force: true });

  const departments = await department.bulkCreate([
    { name: "Engineering" },
    { name: "Marketing" },
  ]);

  const roles = await role.bulkCreate([
    { title: "Software Engineer" },
    { title: "Marketing Specialist" },
    { title: "Product Manager" },
  ]);

  const employees = await employee.bulkCreate([
    { name: "Rahul Sharma", email: "rahul.sharma@example.com" },
    { name: "Priya Singh", email: "priya.singh@example.com" },
    { name: "Ankit Verma", email: "ankit.verma@example.com" },
  ]);

  // Associate employees with departments and roles using create method on junction models
  await employeeDepartment.create({
    employeeId: employees[0].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[0].id,
    roleId: roles[0].id,
  });

  await employeeDepartment.create({
    employeeId: employees[1].id,
    departmentId: departments[1].id,
  });
  await employeeRole.create({
    employeeId: employees[1].id,
    roleId: roles[1].id,
  });

  await employeeDepartment.create({
    employeeId: employees[2].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[2].id,
    roleId: roles[2].id,
  });

  return res.json({ message: "Database seeded!" });
});

// Helper function to get employee's associated departments
async function getEmployeeDepartments(employeeId) {
  const employeeDepartments = await employeeDepartment.findAll({
    where: { employeeId },
  });

  let departmentData;
  for (let empDep of employeeDepartments) {
    departmentData = await department.findOne({
      where: { id: empDep.departmentId },
    });
  }

  return departmentData;
}

// Helper function to get employee's associated roles
async function getEmployeeRoles(employeeId) {
  const employeeRoles = await employeeRole.findAll({
    where: { employeeId },
  });

  let roleData;
  for (let empRole of employeeRoles) {
    roleData = await role.findOne({
      where: { id: empRole.roleId },
    });
  }

  return roleData;
}

// Helper function to get employee details with associated departments and roles
async function getEmployeeDetails(employeeData) {
  const department = await getEmployeeDepartments(employeeData.id);
  const role = await getEmployeeRoles(employeeData.id);

  return {
    ...employeeData.dataValues,
    department,
    role,
  };
}

app.get("/employees", async (req, res) => {
  try {
    const employees = await employee.findAll();
    const employeeDetails = [];

    for (let emp of employees) {
      const details = await getEmployeeDetails(emp);
      employeeDetails.push(details);
    }

    res.status(200).json({ employees: employeeDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const thisEmployee = await employee.findOne({
      where: { id },
    });

    const details = await getEmployeeDetails(thisEmployee);

    res.status(200).json({ employee: details });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/employees/department/:departmentId", async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const empDeptRecords = await employeeDepartment.findAll({
      where: { departmentId },
    });

    const employees = [];

    for (const empDept of empDeptRecords) {
      const employeeData = await employee.findOne({
        where: { id: empDept.employeeId },
      });

      if (employeeData) {
        const details = await getEmployeeDetails(employeeData);
        employees.push(details);
      }
    }
    res.status(200).json({ employees: employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/employees/role/:roleId", async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const empRoleRecord = await employeeRole.findAll({
      where: { roleId },
    });

    const employees = [];

    for (const empRole of empRoleRecord) {
      const employeeData = await employee.findOne({
        where: { id: empRole.employeeId },
      });

      if (employeeData) {
        const details = await getEmployeeDetails(employeeData);
        employees.push(details);
      }
    }

    res.status(200).json({ employees: employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/employees/sort-by-name", async (req, res) => {
  try {
    const inOrder = req.query.order || "ASC";
    const employees = await employee.findAll({
      order: [["name", inOrder]],
    });

    const employeeDetails = [];

    for (let emp of employees) {
      const details = await getEmployeeDetails(emp);
      console.log(emp);
      employeeDetails.push(details);
    }

    res.status(200).json({ employees: employeeDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});
