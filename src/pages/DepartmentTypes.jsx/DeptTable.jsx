import Table from "./TypeTable";

const DeptTable = ({ departments, handleEdit }) => {
  const employmentTypes = [
    {
      type: "Full-time",
      jobs: 10,
    },
    {
      type: "Contract",
      jobs: 2,
    },
    {
      type: "Part-time",
      jobs: 1,
    },
    {
      type: "Internship",
      jobs: 1,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-[1.6fr_1fr] mt-1 ">
      <Table
        title="Departments"
        tableType="department"
        data={departments}
        handleEdit={handleEdit}
      />
      <Table
        title="Employment Types"
        tableType="employment"
        data={employmentTypes}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default DeptTable;