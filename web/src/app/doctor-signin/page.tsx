import SignInForm from "@/components/auth/SignInForm";


export default function DoctorSignin() {
  return (
    <div className="min-h-[80svh] min-w-7xl mx-auto flex items-center justify-center h-full ">
      <SignInForm type="Doctor"/>
    </div>
  );
}
