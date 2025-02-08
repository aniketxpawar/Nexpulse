import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';

interface WebRTCState {
  isConnected: boolean;
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  error: string | null;
}

export const useWebRTC = (roomId: string, userName: string) => {
  const [state, setState] = useState<WebRTCState>({
    isConnected: false,
    localStream: null,
    remoteStreams: new Map(),
    error: null
  });

  const socket = useRef<Socket | null>(null);
  const device = useRef<mediasoupClient.Device | null>(null);
  const producerTransport = useRef<mediasoupClient.Transport | null>(null);
  const consumerTransport = useRef<mediasoupClient.Transport | null>(null);
  const producers = useRef(new Map());
  const consumers = useRef(new Map());

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3016', {
      secure: true,
      rejectUnauthorized: false
    });

    // Connect to room
    const connectToRoom = async () => {
      try {
        // Create room
        await new Promise((resolve, reject) => {
          socket.current?.emit('createRoom', { room_id: roomId }, resolve);
        });

        // Join room
        await new Promise((resolve, reject) => {
          socket.current?.emit('join', { room_id: roomId, name: userName }, resolve);
        });

        // Get router RTP capabilities
        const routerRtpCapabilities = await new Promise((resolve) => {
          socket.current?.emit('getRouterRtpCapabilities', null, resolve);
        });

        // Load device
        device.current = new mediasoupClient.Device();
        await device.current.load({ routerRtpCapabilities });

        // Create transports
        await createTransports();

        setState(prev => ({ ...prev, isConnected: true }));
      } catch (error) {
        setState(prev => ({ ...prev, error: 'Failed to connect to room' }));
      }
    };

    connectToRoom();

    return () => {
      socket.current?.disconnect();
    };
  }, [roomId, userName]);

  const createTransports = async () => {
    // Create producer transport
    const producerTransportParams = await new Promise((resolve) => {
      socket.current?.emit('createWebRtcTransport', {}, resolve);
    });

    producerTransport.current = device.current!.createSendTransport(producerTransportParams);

    // Add transport event handlers
    producerTransport.current.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await new Promise((resolve, reject) => {
          socket.current?.emit('connectTransport', {
            transport_id: producerTransport.current!.id,
            dtlsParameters
          }, resolve);
        });
        callback();
      } catch (error) {
        errback(error);
      }
    });

    producerTransport.current.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const { producer_id } = await new Promise((resolve) => {
          socket.current?.emit('produce', {
            producerTransportId: producerTransport.current!.id,
            kind,
            rtpParameters
          }, resolve);
        });
        callback({ id: producer_id });
      } catch (error) {
        errback(error);
      }
    });

    // Create consumer transport (similar to producer transport)
    // ... Add consumer transport creation code
  };

  // Add methods to handle media
  const startMedia = async (type: 'audio' | 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: type === 'audio' ? true : false,
        video: type === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : false
      });

      const track = type === 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];
      const producer = await producerTransport.current!.produce({ track });
      
      producers.current.set(type, producer);
      setState(prev => ({ ...prev, localStream: stream }));
    } catch (error) {
      setState(prev => ({ ...prev, error: `Failed to start ${type}` }));
    }
  };

  const stopMedia = async (type: 'audio' | 'video') => {
    const producer = producers.current.get(type);
    if (producer) {
      producer.close();
      producers.current.delete(type);
      
      if (state.localStream) {
        state.localStream.getTracks().forEach(track => track.stop());
      }
      
      setState(prev => ({ ...prev, localStream: null }));
    }
  };

  return {
    ...state,
    startMedia,
    stopMedia
  };
};