import Calendar from "@/components/common/calendar"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col min-h-screen pb-28"> {/* Adjusted for dynamic height */}
      <div className="p-2 md:p-10 rounded-2xl border border-neutral-200 bg-white grid grid-cols-3 w-full">
        <div className="col-span-2">
          <h1 className="font-bold mb-2 text-3xl">Welcome Back Dr. Ashit V. Hegde!</h1>
          <GreetCard />
          <PatientList/>
        </div>
        <div className="px-5"> {/* Removed fixed height */}
          <h1 className="text-2xl font-bold mb-">Your today's schedule</h1>
          <div className="p-5 border rounded-xl">
            <Calendar prop="day"/>
          </div>
        </div>
      </div>
    </div>
  );
}
  
  function GreetCard() {
    return <div className="bg-blue-500 mb-5 relative rounded-xl h-[30vh] px-7 p-4 text-white shadow-lg flex items-center justify-between"> {/* Corrected to vh */}
      <div className="flex flex-col justify-between gap-7">

      <div>
       <h1 className="text-4xl font-extrabold mb-5">Visits For Today</h1>
       <h1 className="text-6xl font-extrabold">34</h1>
       </div>

       <div className="flex gap-7">
        <div className="px-4 py-3 rounded-xl bg-blue-400">
        <h1 className="text-xl font-extrabold mb-2">Visits This Week</h1>
        <h1 className="text-2xl font-extrabold">120</h1>
        </div>


        <div className="px-4 py-3 rounded-xl bg-blue-400">
        <h1 className="text-xl font-extrabold mb-2">Visits This Month</h1>
        <h1 className="text-2xl font-extrabold">120</h1>
        </div>

        <div className="px-4 py-3 rounded-xl bg-blue-400">
        <h1 className="text-xl font-extrabold mb-2">New Patients</h1>
        <h1 className="text-2xl font-extrabold">7</h1>
        </div>
       </div>

      </div>
      <img className="h-[28svh] absolute right-8 bottom-0" src="https://hinduja-prod-assets.s3.ap-south-1.amazonaws.com/s3fs-public/2022-03/Ashit%20Hegde.png?VersionId=sMzNgniTwhILR5tHFw4YmC7peaecIHJZ" alt="" /> {/* Corrected to vh */}
    </div>
  }

  function PatientList() {
    return <div className="bg-white rounded-xl p-4 shadow-lg border">
      <h1 className="font-bold text-2xl">Patient List</h1>
      <div className="grid grid-cols-3 gap-4 mt-5">
        <PatientCard />
        <PatientCard />
        <PatientCard />
        <PatientCard />
        <PatientCard />
      </div>
    </div>
  }

  function PatientCard() {
    return <div className="bg-white rounded-xl p-4 shadow-md">
      <h1 className="font-bold text-xl">Patient Name</h1>
      <p className="text-sm">Age: 25</p>
      <p className = "text-sm"> 
        <span className="font-bold">Last Visit:</span> 12th March 2022
      </p>
    </div>
  }