import Table from "./TypeTable";

const DeptTable = () => {

  const departments = [
    { name: "Engineering", roles: 6 },
    { name: "Design", roles: 2 },
    { name: "People Ops", roles: 3 },
    { name: "Analytics", roles: 1 },
    { name: "Marketing", roles: 2 },
  ];

  const employmentTypes = [
    { type: "Full-time", jobs: 10 },
    { type: "Contract", jobs: 2 },
    { type: "Part-time", jobs: 1 },
    { type: "Internship", jobs: 1 },
  ];

  return (
    <div className="flex gap-6 w-full items-stretch">
    <div className="w-[55%] flex">
  <Table
    title="Departments"
    tableType="department"
    data={departments}
  />
</div>

<div className="w-[45%] flex">
  <Table
    title="Employment Types"
    tableType="employment"
    data={employmentTypes}
  />
</div>
</div>
  );
};

export default DeptTable;