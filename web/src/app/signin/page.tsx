import SignInForm from "@/components/auth/SignInForm";


export default function Signin() {
  return (
    <div className="min-h-[80svh] min-w-7xl mx-auto flex items-center justify-center h-full ">
      <SignInForm type="patient"/>
    </div>
  );
}
