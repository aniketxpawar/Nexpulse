import { Card } from "@/components/ui/card";


// {
//     "id": 6,
//     "patientId": 1,
//     "doctorId": 1,
//     "appointmentId": 30,
//     "healthConcern": "Acne",
//     "prescription": "[{\"name\":\"Tretinoin\",\"dosage\":\"twice a week at night\"}]",
//     "instructions": "",
//     "image": "https://res.cloudinary.com/dtixbndcf/image/upload/v1739687375/medical_records/mi2h0qbxjozgv6ug4a6a.png",
//     "createdAt": "2025-02-16T06:29:38.327Z"
// }


const Prescription = ({ date, prescriptionDetails, PatientName, DoctorName}) => {
  const { doctorId, patientId, healthConcern, prescription, createdAt, image } = prescriptionDetails;

  // Parse the prescription JSON string
  const medicines = prescription ? JSON.parse(prescription) : [];

  return (
    <div className="w-[60svw] mx-auto p-6">
      <Card className="p-6 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Medical Prescription</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 font-medium">Doctor Name:</p>
            <p className="text-lg">Dr. {DoctorName}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Patient Name:</p>
            <p className="text-lg">{PatientName}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Date:</p>
            <p className="text-lg">{new Date(date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Health Concern:</p>
            <p className="text-lg">{healthConcern}</p>
          </div>
        </div>

        <h3 className="text-xl font-medium mt-4">Medicines</h3>
        <ul className="list-disc list-inside mt-2">
          {medicines.length > 0 ? (
            medicines.map((med, index) => (
              <li key={index} className="text-lg">
                <span className="font-semibold">{med.name}</span> - {med.dosage}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No medicines prescribed.</p>
          )}
        </ul>

        {image && (
          <div className="mt-6">
            <h3 className="text-xl font-medium">Prescription Image</h3>
            <img src={image} alt="Prescription" className="w-full rounded-lg mt-2" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Prescription;
