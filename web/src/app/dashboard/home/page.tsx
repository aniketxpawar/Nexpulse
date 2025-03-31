"use client"
import Calendar from "@/components/common/calendar"
import { useEffect, useState } from "react";
import axios from "axios"
import { cardio } from 'ldrs'
import moment from 'moment'; // Import moment
import { doctorPic } from "@/assets/defaultProfiles"
import MyTUICalendar from "@/components/common/calendar"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLinkIcon, Trash2 } from "lucide-react";
import { RiRadioButtonLine } from "react-icons/ri"
import { MdPeople } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-dropdown-menu"
import Prescription from "@/components/Prescription"

const defaultProfilePic = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngitem.com%2Fpimgs%2Fm%2F551-5510463_default-user-image-png-transparent-png.png&f=1&nofb=1&ipt=a1e0abf157ee5d0b0dad35a4ccc2ae43b90d9ee39fd38cc09f9e5a917c90eaad&ipo=images'
const defaultDoctorPic = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fmale-user-icons-2%2F500%2Fmuser-dr1-512.png&f=1&nofb=1&ipt=878bb4538e54a271464416c1b1c567df2f7338c4a0e060d628bea1a41aff23cc&ipo=images"

cardio.register()

export default function DashboardPage() {
  const userId = (() => localStorage.getItem('userId'))()
  
  const getDoctor = async () => {
    const res = await axios.post('http://localhost:4000/user/get-doctor', {
      doctorId: userId,
      userId: userId
    })
    setDoctor(res.data.doctor)
  }
  
  const getAppointments = async () => {
    const res = await axios.get(`http://localhost:4000/appointment/getAppointments/${userId}`)
    setUpcomingAppointments(res.data)
    setLoading(false)
  }
  
  const [doctor, setDoctor] = useState()
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [schedules, setSchedules] = useState([])
  
  useEffect(() => {
    getDoctor()
    getAppointments()
  }, [])

  // New function using moment to format dates
  function formatAppointmentTime(dateString, durationMinutes = 30) {
    const startTime = moment(dateString);
    const endTime = moment(dateString).add(durationMinutes, 'minutes');
    
    return {
      start: startTime.format('YYYY-MM-DDTHH:mm:ss'),
      end: endTime.format('YYYY-MM-DDTHH:mm:ss')
    };
  }

  useEffect(() => {
    const newSchedule = upcomingAppointments.map((appointment, index) => {
      const timeSlot = formatAppointmentTime(appointment.appointmentDate);
      return {
        id: appointment.id,
        calendarId: index + 1,
        title: `Appointment with ${appointment.patient.user.fullName}`,
        body: `<a class='bg-blue-700 p-2 rounded-md text-white' href='${appointment.link}' target='_blank'>Join now</a>`,
        category: "time",
        start: timeSlot.start,
        end: timeSlot.end,
      };
    });
    console.log("new", newSchedule);
    setSchedules(newSchedule);
  }, [upcomingAppointments]);
  
  // Function to generate time slots using moment
  function generateTimeSlots(
    start: string,
    end: string,
    day: string
  ): { start: number; end: number }[] {
    // Find the next occurrence of the given weekday
    let referenceDate = moment().day(day);
    if (moment().isAfter(referenceDate, "day")) {
      referenceDate = referenceDate.add(7, "days"); // Move to next week's day if needed
    }
    
    // Set start and end times on that day
    const startTime = referenceDate.clone().set({
      hour: parseInt(start.split(":")[0]),
      minute: parseInt(start.split(":")[1]),
      second: 0,
      millisecond: 0,
    });
    
    const endTime = referenceDate.clone().set({
      hour: parseInt(end.split(":")[0]),
      minute: parseInt(end.split(":")[1]),
      second: 0,
      millisecond: 0,
    });
    
    // Generate slots
    const slots: { start: number; end: number }[] = [];
    let slot = startTime.clone();
    
    while (slot.isBefore(endTime)) {
      let slotEnd = slot.clone().add(30, "minutes"); // Create a 30-minute slot
      slots.push({ start: slot.unix(), end: slotEnd.unix() });
      slot = slotEnd;
    }
    
    return slots;
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen pb-28 overflow-y-auto">
      {
        loading ? <div className='flex items-center justify-center w-full h-[80svh]'>
          <l-cardio
            size="150"
            stroke="10"
            speed="1"
            color="skyblue"
          ></l-cardio>
        </div> :
          <div className="p-2 md:p-10 rounded-2xl border border-neutral-200 bg-white flex flex-col lg:flex-row w-full gap-4">
            <div className="w-full lg:w-3/4">
              <h1 className="font-bold mb-2 text-3xl">Welcome Back Dr. {doctor?.user.fullName}!</h1>
              <GreetCard doctor={doctor} upcoming={upcomingAppointments?.length} />
              <PatientList upcomingAppointments={upcomingAppointments} />
            </div>
            <div className="w-1/3 invisible lg:visible">
              <div className="p-5 border rounded-xl shadow-lg">
                <PastPatients doctorName={doctor?.user.fullName}/>
              </div>
            </div>
          </div>}
    </div>
  );
}

function GreetCard({ doctor, upcoming }: { doctor: any; upcoming: number }) {
  return <div className="bg-blue-500 mb-5 relative rounded-xl h-[35vh] px-7 p-4 text-white shadow-lg flex items-center justify-between">
    <div className="flex flex-col justify-between gap-7">

      <div>
        <h1 className="text-4xl font-extrabold mb-5">Upcoming Visits</h1>
        <h1 className="text-5xl font-extrabold">{upcoming}</h1>
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
      </div>
    </div>
    <img className="h-64 w-64 object-cover rounded-xl" src={doctor?.user?.profilePic ? doctor?.user?.profilePic : doctorPic} alt="" />
  </div>
}

function PatientList({ upcomingAppointments }: { upcomingAppointments: any }) {
  // Updated to use moment
  function formatDateTime(dateString: Date) {
    return moment(dateString).format('ddd MMM D YYYY, h:mm A');
  }
  
  return <div className="bg-white rounded-xl p-4 shadow-lg border">
    <h1 className="font-bold text-2xl pb-4">Upcoming Appointments</h1>
    <div className="grid grid-cols-1 gap-4 min-h-[40svh] max-h-[60svh] overflow-y-scroll">
      {
        upcomingAppointments.length === 0 ? <h1 className="text-center font-extrabold text-gray-400 text-3xl">No upcoming appointments</h1> :
        upcomingAppointments.map((appointment) => (
          <div key={appointment.id} className='flex items-center gap-5 border-t pt-3'>
            <img src={appointment.patient.profilePic ? appointment.patient.profilePic : defaultProfilePic} alt={appointment.patient.fullName} className='w-36 h-36 object-contain rounded-lg' />
            <div className='w-full flex justify-between items-center'>
              <div>
                <h1 className='text-xl font-bold'>{appointment.patient.user.fullName}</h1>
                <h2 className='flex items-center gap-2 mt-2'><IoCalendar /> {formatDateTime(appointment.appointmentDate)}</h2>
                <h2>{appointment.type == 'online' ?
                  <span className='flex items-center gap-2'><RiRadioButtonLine /> Online Appointment</span> :
                  <span className='flex items-center gap-2'><MdPeople /> Clinic Appointment</span>}</h2>
                <h2 className='mt-2'>Health Concerns: {appointment.healthConcern}</h2>
              </div>
              <a href={`http://localhost:3000/patient-profile/${appointment.patient.userId}`} target="_blank" className='text-white text-sm bg-blue-500 px-4 rounded-lg py-2 flex gap-2 items-center'>
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

function PastPatients({doctorName}) {
  const [pastAppointments, setPastAppointments] = useState([])
  
  const getPastAppointments = async () => {
    const res = await axios.post(`http://localhost:4000/appointment/getPastAppointments/${localStorage.getItem('userId')}`, {
      date: moment().format() // Using moment format instead of toISOString
    })
    console.log(res.data);
    setPastAppointments(res.data.appointments)
  }
  
  useEffect(() => {
    getPastAppointments()
  }, [])

  // Updated to use moment
  const formatDateTime = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY, h:mm A');
  };
  
  return (
    <div className="">
      <h1 className="font-bold text-2xl pb-4">Past Appointments</h1>
      <div className="grid grid-cols-1 gap-4 max-h-[102svh] overflow-y-scroll">
        {
          pastAppointments.length === 0 ? <h1 className="text-center font-extrabold text-gray-400 text-3xl">No past appointments</h1> :
          pastAppointments.map((appointment) => (
            <div key={appointment.id} className='flex items-center gap-5 border-t pt-3 h-56'>
              <img src={defaultProfilePic} alt={appointment.patient.user.fullName} className='w-32 h-32 object-contain rounded-lg' />
              <div className='w-full flex flex-col justify-between items-center'>
                <div className="w-full">
                  <h1 className='text-xl font-bold flex gap-2'>
                    {appointment.patient.user.fullName}

                    <a href={`http://localhost:3000/patient-profile/${appointment.patient.userId}`} target="_blank" className='text-blue-500'>
                    <ExternalLinkIcon className="text-blue-500" />
                    </a>
                  </h1>
                  <h2 className='flex items-center gap-2 mt-2'><IoCalendar /> {
                    formatDateTime(appointment.appointmentDate)
                  }</h2>
                  <h2>{appointment.type == 'online' ?
                    <span className='flex items-center gap-2'><RiRadioButtonLine /> Online Appointment</span> :
                    <span className='flex items-center gap-2'><MdPeople /> Clinic Appointment</span>}</h2>
                </div>

                {
                  appointment.medicalRecords.length > 0 ?
                    <Dialog>
                    <DialogTrigger className="w-full">
                      <button className='mt-3 text-white text-sm bg-blue-500 text-center justify-center px-4 rounded-lg py-2 flex gap-2 items-center w-full'>
                      View Prescription
                        <FaExternalLinkAlt />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="mx-auto p-6 overflow-y-scroll h-[90vh]">
                      
                      <Prescription date={appointment.appointmentDate} prescriptionDetails={appointment.medicalRecords[0]} PatientName={appointment.patient.user.fullName} DoctorName={doctorName}/>
                    </DialogContent>
                  </Dialog> :
                    <Dialog>
                    <DialogTrigger className="w-full">
                      <button className='mt-3 text-white text-sm bg-blue-500 text-center justify-center px-4 rounded-lg py-2 flex gap-2 items-center w-full'>
                        Add Prescription
                        <FaExternalLinkAlt />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="mx-auto p-6 overflow-y-scroll h-[90vh]">
                      
                      <PrescriptionForm DoctorName={doctorName} healthConcern={appointment.healthConcern} doctorId={appointment.doctorId} patientId={appointment.patient.id} appointmentId={appointment.id} Date={formatDateTime(appointment.appointmentDate)} PatientName={appointment.patient.user.fullName}/>
                    </DialogContent>
                  </Dialog>
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

function PrescriptionForm({DoctorName, PatientName, doctorId, patientId, appointmentId, Date, healthConcern}) {
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", frequency: "" }]);
  const [instructions, setInstructions] = useState("");
  const [newHealthConcern, setNewHealthConcern] = useState(healthConcern);
  const [file, setFile] = useState(null);

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage:"", frequency: "" }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updatedMedicines = medicines.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setMedicines(updatedMedicines);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("patientId", patientId);
    formData.append("appointmentId", appointmentId);
    formData.append("healthConcern", healthConcern);
    formData.append("prescription", JSON.stringify(medicines));
    formData.append("instructions", instructions);
    if (file) {
      formData.append("image", file);
    }

    try {
      console.log("Form data:", file);
      const response = await fetch("http://localhost:4000/medical/createRecord", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Prescription submitted successfully!");
      } else {
        alert("Failed to submit prescription.");
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
    }
  };

  return (
    <div className="w-[60svw] mx-auto p-6">
      <Card className="p-6 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Medical Prescription</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
          <div>
          <Label className="text-sm text-gray-500 ">Doctor Name</Label>
          <Input placeholder="Patient Name" value={`Dr. ${DoctorName}`} disabled className="w-full " />
          </div>
          <div>
          <Label className="text-sm text-gray-500">Date</Label>
          <Input value={Date} disabled className="w-full p-2" />
          </div>
          <div>
          <Label className="text-sm text-gray-500">Patient Name</Label>
          <Input placeholder="Doctor Name" value={PatientName} disabled className="w-full " />
          </div>
          <div>
          <Label className="text-sm text-gray-500">Health Concern</Label>
          <Input placeholder="Health Concern" defaultValue={healthConcern} onChange={(e) => setNewHealthConcern(e.target.value)} className="w-full p-2" />
          </div>
          </div>

          <h3 className="text-xl font-medium mt-4">Medicines</h3>
          {medicines.map((med, index) => (
            <div key={index} className="flex w-full gap-2 items-center">
              <div className="w-2/3">
                <Input
                  placeholder="Medicine Name"
                  value={med.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-1/3">
                <Input
                  placeholder="Dosage (e.g., 500mg)"
                  value={med.dosage}
                  onChange={(e) => handleChange(index, "dosage", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-1/3">
                <Input
                  placeholder="Frequency (e.g., 3x a day)"
                  value={med.frequency}
                  onChange={(e) => handleChange(index, "frequency", e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="button" onClick={() => removeMedicine(index)} className="bg-red-500 hover:bg-red-600 w-1/12 text-white p-1 rounded">
                <Trash2 className="text-sm" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addMedicine} className="w-full bg-blue-600 hover:bg-blue-700">+ Add Medicine</Button>

          <textarea placeholder="Additional Instructions" onChange={(e) => setInstructions(e.target.value)} className="w-full p-2 border rounded-md" />

          <h3 className="text-xl font-medium mt-4">Upload Prescription</h3>

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              {
                file && <h1 className="font-bold underline">{file.name}</h1>
              }
              
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white p-2 mt-4 rounded-lg">Submit Prescription</Button>
        </form>
      </Card>
    </div>
  );
}