import ProfileForm from "@/components/doctor-signup/ProfileForm"

const ProfileSettings = () => {
  return (
    <div className="max-w-7xl mx-auto my-16">
      <h1 className="text-3xl font-bold mb-7">Profile Settings</h1>
      <div>
        <ProfileForm/>
      </div>
    </div>
  )
}

export default ProfileSettings