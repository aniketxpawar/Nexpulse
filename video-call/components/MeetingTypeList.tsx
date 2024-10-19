'use client'

import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactDatePicker from 'react-datepicker';
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { Textarea } from "./ui/textarea";


const MeetingTypeList = () => {

    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>(undefined);
    const router = useRouter()
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
      dateTime: new Date(),
      description: '',
      link: ''
    });

    const [callDetails, setCallDetails] = useState<Call>();
    const {toast} = useToast();

    const createMeeting = async () => {
        if(!client || !user) return;
        try {

          if(!values.dateTime) {
          toast({title: "PLease select a date and time"})
          return;
          }

          const id = crypto.randomUUID();
          const call = client.call('default', id);
          if(!call) throw new Error('Call not created');
          const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
          const description = values.description || 'Instant Meeting';
          await call.getOrCreate({
            data: {
              starts_at: startsAt,
              custom: {
                description,
              },
            },
          });
          setCallDetails(call);
          if (!values.description) {
            router.push(`/meeting/${call.id}`);
          }
          toast({title: "Meeting Created"})

        

        } catch (error) {
          console.log(error);
          toast({title: "Failed to create meeting"})
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className="flex items-center justify-center gap-5">
       <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className="bg-orange-1"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      {!callDetails ? (
        <MeetingModal
        isOpen= {meetingState === 'isScheduleMeeting'}
        onClose = {() => setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
     >
      <div className="flex flex-col gap-2.5">
        <label className="text-base text-normal leading-[22px] text-sky-2">Add a description</label>
        <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible-ring-offset-0" onChange={(e) => {
          setValues({...values,description: e.target.value})
        }} />
      </div>
      <div className="flex w-full flex-col gap-2.5">
      <label className="text-base text-normal leading-[22px] text-sky-2">Select Date and Time</label>
      <ReactDatePicker
      selected={values.dateTime}
      onChange={(date) => setValues({...values, dateTime: date!})}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="MMMM d, yyyy h:mm aa"
      className="w-full rounded bg-dark-3 p-2 focus:outline-none"
       />
      </div>
     </MeetingModal>
      ):(
        <MeetingModal
            isOpen= {meetingState === 'isScheduleMeeting'}
            onClose = {() => setMeetingState(undefined)}
            title="Meeting Created"
            className="text-center"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast({title: 'Link copied'});
              
            }}
            image={'/icons/checked.svg'}
            buttonIcon="/icons/copy.svg"
            buttonText="Copy Meeting Link"
         />
      )}
        <MeetingModal
            isOpen= {meetingState === 'isInstantMeeting'}
            onClose = {() => setMeetingState(undefined)}
            title="Instant Meeting"
            className="text-center"
            buttonText="Start Meeting"
            handleClick={createMeeting}
         />
         <MeetingModal
            isOpen= {meetingState === 'isJoiningMeeting'}
            onClose = {() => setMeetingState(undefined)}
            title="Type the link here"
            className="text-center"
            buttonText="Join Meeting"
            handleClick={()=>router.push(values.link)}
         >
          <Input placeholder="Meeting Link" className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => setValues({...values, link:e.target.value})}/>
         </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
