import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import Feature from "@/components/ui/feature";
import { ArrowUpDown, Timer, Workflow } from "lucide-react";
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
          Information you need during on-call emergencies
        </Typography>
        <Typography className="max-w-2xl" variant="h5">
          Quickly link new on-call tickets to similar past
          incidents and their solutions. All directly in
          Slack the moment an incident happens.
        </Typography>

        <div className="relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <Link href="/auth/doctor-signup">
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
            Quick solutions, less stress
          </Typography>
          <div className="flex md:flex-row flex-col gap-12">
            <Feature
              icon={<Timer size={24} />}
              headline="Fix emergencies fast"
              description="Save 20-30 minutes per on-call ticket - no more searching for relevant issues and runbooks"
            />
            <Feature
              icon={<ArrowUpDown size={24} />}
              headline="Universally compatible"
              description="Works with PagerDuty, Jira, or custom Slack alerts—Pandem integrates with any system"
            />
            <Feature
              icon={<Workflow size={24} />}
              headline="Secure for your org"
              description="We keep your data safe by taking top security measures."
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 max-w-2xl items-center">
          <Typography className="max-w-2xl" variant="h1">
            Instant setup, no custom code
          </Typography>
          <Typography className="max-w-2xl" variant="p">
            Quickly link new on-call tickets to similar past
            incidents and their solutions. All directly in
            Slack the moment an incident happens.
          </Typography>
        </div>
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
