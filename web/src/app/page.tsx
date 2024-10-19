import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import Feature from "@/components/ui/feature";
import { Activity, ArrowUpDown, ShieldCheck, Timer, Workflow } from "lucide-react";
import LandingImage from "@/assets/images/landing page.png";
import Image from 'next/image'
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex flex-col h-full md:px-32 pt-12 pb-24 px-8
      w-full items-center text-center gap-12"
    >
      <div className="flex flex-col gap-6 items-center h-[100svh]">
        <Typography className="max-w-2xl" variant="h1">
        Instant Access to Doctors for You and Your Loved Ones
        </Typography>
        <Typography className="max-w-2xl" variant="h5">
        Connect with doctors instantly. Manage appointments, prescriptions, and your relatives' health.
        <span> All in one place.</span>
        </Typography>
        

        <div className="relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <Link href="/dashboard/home">
            <Button className="bg-blue-700">
              {`Get Started`}
            </Button>
            </Link>
          </div>
          <Image
            width={1024}
            height={532}
            alt="hero image"
            src={LandingImage}
            layout="responsive"
            className="pt-32 md:pt-24 lg:pt-0 max-w-7xl mx-auto"
          />
        </div>
      </div>
      <div className="flex flex-col md:gap-36 gap-24 items-center">
        <div className="flex flex-col gap-12 items-center">
          <Typography className="max-w-2xl" variant="h1">
          Quick care, less hassle
          </Typography>
          <div className="flex md:flex-row flex-col gap-12">
            <Feature
              icon={<Timer size={24} />}
              headline="Get care quickly"
              description="Schedule doctor consultations and manage healthcare needs efficiently — everything you need is organized and accessible."
            />
            <Feature
              icon={<ArrowUpDown size={24} />}
              headline="Centralized medical records"
              description="Store and manage all medical records conveniently, ensuring quick access when you need it."
            />
            <Feature
              icon={<Activity size={24} />}
              headline="Flexible for your needs"
              description="Easily set up consultations and manage appointments and medications, all in one platform."
            />
            <Feature
              icon={<ShieldCheck size={24} />}
              headline="Secure and reliable"
              description="Your data is safe with us. We prioritize security to protect your personal and health information."
            />
          </div>
        </div>
        {/* <div className="flex flex-col gap-6 max-w-2xl items-center">
          <Typography className="max-w-2xl" variant="h1">
            Instant setup, no custom code
          </Typography>
          <Typography className="max-w-2xl" variant="p">
            Quickly link new on-call tickets to similar past
            incidents and their solutions. All directly in
            Slack the moment an incident happens.
          </Typography>
        </div> */}
        <div className="flex flex-col gap-6 items-center">
          <Typography className="max-w-2xl" variant="h1">
            Get in touch
          </Typography>
          <div>Book a demo, or hop on a call</div>
          <Button variant="ghost">
            {`Book now`}
          </Button>
        </div>
      </div>
    </div>
  );
}
