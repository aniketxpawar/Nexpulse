"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function PrescriptionForm() {
  const [medicines, setMedicines] = useState([{ name: "", frequency: "" }]);

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", frequency: "" }]);
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

  return (
    <div className="w-[60svw] mx-auto p-6">
      <Card className="p-6 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Medical Prescription</h2>
        <form className="space-y-4">
          <Input placeholder="Patient Name" className="w-full p-2" />
          <Input placeholder="Doctor Name" className="w-full p-2" />
          <Input type="date" className="w-full p-2" />

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
                  value={med.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
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

          <textarea placeholder="Additional Instructions" className="w-full p-2 border rounded-md" />


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
              <input id="dropzone-file" type="file" className="hidden" />
            </label>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white p-2 mt-4 rounded-lg">Submit Prescription</Button>
        </form>
      </Card>
    </div>
  );
}