"use client";
import { useWebRTC } from '@/hooks/useWebRTC';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';

export default function VideoCallPage() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const {
    isConnected,
    localStream,
    remoteStreams,
    error,
    startMedia,
    stopMedia
  } = useWebRTC(roomId, userName);

  const handleJoin = () => {
    if (roomId && userName) {
      setIsJoined(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {!isJoined ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Input
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <Input
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Button onClick={handleJoin} className="w-full">
                Join Room
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => startMedia('audio')}>
              <Mic className="w-4 h-4" />
            </Button>
            <Button onClick={() => startMedia('video')}>
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Video */}
            {localStream && (
              <video
                ref={el => {
                  if (el) el.srcObject = localStream;
                }}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video bg-gray-900 rounded-lg"
              />
            )}

            {/* Remote Videos */}
            {Array.from(remoteStreams).map(([peerId, stream]) => (
              <video
                key={peerId}
                ref={el => {
                  if (el) el.srcObject = stream;
                }}
                autoPlay
                playsInline
                className="w-full aspect-video bg-gray-900 rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}