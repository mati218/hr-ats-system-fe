import Table from "./TypeTable";

const DeptTable = ({ departments, handleEdit }) => {

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
          handleEdit={handleEdit}
        />
      </div>

      <div className="w-[45%] flex">
        <Table
          title="Employment Types"
          tableType="employment"
          data={employmentTypes}
          handleEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default DeptTable;