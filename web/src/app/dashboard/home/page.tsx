import Calendar from "@/components/common/calendar"
const defaultProfilePic = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngitem.com%2Fpimgs%2Fm%2F551-5510463_default-user-image-png-transparent-png.png&f=1&nofb=1&ipt=a1e0abf157ee5d0b0dad35a4ccc2ae43b90d9ee39fd38cc09f9e5a917c90eaad&ipo=images'
const defaultDoctorPic = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fmale-user-icons-2%2F500%2Fmuser-dr1-512.png&f=1&nofb=1&ipt=878bb4538e54a271464416c1b1c567df2f7338c4a0e060d628bea1a41aff23cc&ipo=images"
import { RiRadioButtonLine } from "react-icons/ri"
import { MdPeople } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";



export default function DashboardPage() {
  const currentDate = new Date();
currentDate.setMinutes(currentDate.getMinutes() + 30);

const schedule = [
  {
    id: 1,
    title: "Appointment with John Doe",
    body: "link: https://meet.google.com/xyz",
    category: "time",
    start: new Date().toISOString(),
    end: currentDate.toISOString(),
  }
]
  return (
    <div className="flex flex-1 flex-col min-h-screen pb-28 overflow-y-auto"> {/* Adjusted for dynamic height */}
      <div className="p-2 md:p-10 rounded-2xl border border-neutral-200 bg-white flex flex-col lg:flex-row w-full gap-4">
        <div className="w-full lg:w-3/4">
          <h1 className="font-bold mb-2 text-3xl">Welcome Back Dr. Manish Gupta!</h1>
          <GreetCard />
          <PatientList />
        </div>
        <div className="w-1/3 invisible lg:visible"> {/* Removed fixed height */}
          <h1 className="text-2xl font-bold mb-3">Your today's schedule</h1>
          <div className="p-5 border rounded-xl">
            <Calendar prop="day" schedule={schedule}/>
          </div>
        </div>
      </div>
    </div>
  );
}

const upcomingAppointments = [
  {
    id: 1,
    patient: {
      id: 1,
      fullName: "John Doe",
      profilePic: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fget.pxhere.com%2Fphoto%2Fman-person-people-portrait-professional-profession-smiling-senior-citizen-elder-face-happy-980074.jpg&f=1&nofb=1&ipt=b77b8f418c6655181f0249507e7cd22ed8f54f43382c81e48e43843351200a2f&ipo=images",
    },
    problems: "Fever, Headache",
    link: "",
    type: "online",
    time: "10th March 2022, 10:00 AM",
  },
  {
    id: 2,
    patient: {
      id: 2,
      fullName: "John Doe",
      profilePic: "",
    },
    problems: "Fever, Headache",
    link: "",
    type: "offline",
    time: "10th March 2022, 10:00 AM",
  },
  {
    id: 1,
    patient: {
      id: 2,
      fullName: "John Doe",
      profilePic: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fget.pxhere.com%2Fphoto%2Fman-person-people-portrait-professional-profession-smiling-senior-citizen-elder-face-happy-980074.jpg&f=1&nofb=1&ipt=b77b8f418c6655181f0249507e7cd22ed8f54f43382c81e48e43843351200a2f&ipo=images",
    },
    problems: "Fever, Headache",
    link: "",
    type: "online",
    time: "10th March 2022, 10:00 AM",
  },
  {
    id: 2,
    patient: {
      id: 3,
      fullName: "John Doe",
      profilePic: "",
    },
    problems: "Fever, Headache",
    link: "",
    type: "offline",
    time: "10th March 2022, 10:00 AM",
  },
  {
    id: 3,
    patient: {
      id: 1,
      fullName: "John Doe",
      profilePic: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fget.pxhere.com%2Fphoto%2Fman-person-people-portrait-professional-profession-smiling-senior-citizen-elder-face-happy-980074.jpg&f=1&nofb=1&ipt=b77b8f418c6655181f0249507e7cd22ed8f54f43382c81e48e43843351200a2f&ipo=images",
    },
    problems: "Fever, Headache",
    link: "",
    type: "online",
    time: "10th March 2022, 10:00 AM",
  },
  {
    id: 4,
    patient: {
      id: 2,
      fullName: "John Doe",
      profilePic: "",
    },
    problems: "Fever, Headache",
    link: "",
    type: "offline",
    time: "10th March 2022, 10:00 AM",
  },

]
function GreetCard() {
  return <div className="bg-blue-500 mb-5 relative rounded-xl h-[35vh] px-7 p-4 text-white shadow-lg flex items-center justify-between">
    <div className="flex flex-col justify-between gap-7">

      <div>
        <h1 className="text-4xl font-extrabold mb-5">Visits For Today</h1>
        <h1 className="text-5xl font-extrabold">34</h1>
      </div>

      <div className="flex gap-3">
        <div className="px-4 py-2 rounded-xl bg-blue-400">
          <h1 className="text-xl font-extrabold mb-2">Visits This Week</h1>
          <h1 className="text-xl font-extrabold">120</h1>
        </div>


        <div className="px-4 py-2 rounded-xl bg-blue-400">
          <h1 className="text-xl font-extrabold mb-2">Visits This Month</h1>
          <h1 className="text-xl font-extrabold">120</h1>
        </div>

        <div className="px-4 py-2 rounded-xl bg-blue-400">
          <h1 className="text-xl font-extrabold mb-2">New Patients</h1>
          <h1 className="text-xl font-extrabold">7</h1>
        </div>
      </div>
    </div>
    <img className="h-[28svh] absolute right-8 bottom-0" src={'https://hinduja-prod-assets.s3.ap-south-1.amazonaws.com/s3fs-public/2022-03/Ashit%20Hegde.png?VersionId=sMzNgniTwhILR5tHFw4YmC7peaecIHJZ'} alt="" /> {/* Corrected to vh */}
  </div>
}

function PatientList() {
  return <div className="bg-white rounded-xl p-4 shadow-lg border">
    <h1 className="font-bold text-2xl pb-4">Upcoming Appointments</h1>
    <div className="grid grid-cols-1 gap-4 h-[60svh] overflow-y-scroll">
      {
        upcomingAppointments.map((appointment) => (
          <div key={appointment.id} className='flex items-center gap-5 border-t pt-3'>
            <img src={appointment.patient.profilePic ? appointment.patient.profilePic : defaultProfilePic} alt={appointment.patient.fullName} className='w-36 h-36 object-contain rounded-lg' />
            <div className='w-full flex justify-between items-center'>
              <div>
                <h1 className='text-xl font-bold'>{appointment.patient.fullName}</h1>
                <h2 className='flex items-center gap-1 mt-2'><IoCalendar /> {appointment.time}</h2>
                <h2>{appointment.type == 'online' ?
                  <span className='flex items-center gap-2'><RiRadioButtonLine /> Online Appointment</span> :
                  <span className='flex items-center gap-2'><MdPeople /> Clinic Appointment</span>}</h2>
                <h2 className='mt-2'>Problems Faced: {appointment.problems}</h2>
              </div>
              <a href={appointment.link} className='text-white text-sm bg-blue-500 px-4 rounded-lg py-2 flex gap-2 items-center'>
                Patient Profile
                <FaExternalLinkAlt />
              </a>
              {
                appointment.type === 'online' ?
                  <a href={appointment.link} className='text-white text-sm bg-blue-500 px-4 rounded-lg py-2 flex gap-2 items-center'>
                    Join Meeting
                    <FaExternalLinkAlt />
                  </a> :
                  <h1 className='text-gray-400 font-semibold text-sm'>Offline Appointment</h1>
              }
            </div>
          </div>
        ))
      }
    </div>
  </div>
}

function PatientCard() {
  return <div className="bg-white rounded-xl p-4 border shadow-sm">
    <h1 className="font-bold text-xl">Patient Name</h1>
    <p className="text-sm">Age: 25</p>
    <p className="text-sm">
      <span className="font-bold">Last Visit:</span> 12th March 2022
    </p>
  </div>
}