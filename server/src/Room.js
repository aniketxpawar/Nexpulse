const config = require('./config')

class Room {
    constructor(room_id, worker, io) {
        this.id = room_id
        this.worker = worker
        this.io = io
        this.peers = new Map()
        this.router = null
        this.setupMediasoupRouter()
    }

    async setupMediasoupRouter() {
        try {
            this.router = await this.worker.createRouter({ mediaCodecs: config.mediasoup.router.mediaCodecs })
        } catch (error) {
            console.error('Error creating router:', error)
        }
    }

    addPeer(peer) {
        this.peers.set(peer.id, peer)
    }

    async createWebRtcTransport(peer_id) {
        const { maxIncomingBitrate, initialAvailableOutgoingBitrate } = config.mediasoup.webRtcTransport

        const transport = await this.router.createWebRtcTransport({
            listenIps: config.mediasoup.webRtcTransport.listenIps,
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
            initialAvailableOutgoingBitrate
        })

        if (maxIncomingBitrate) {
            try {
                await transport.setMaxIncomingBitrate(maxIncomingBitrate)
            } catch (error) {
                console.error('Error setting maxIncomingBitrate:', error)
            }
        }

        transport.on('dtlsstatechange', dtlsState => {
            if (dtlsState === 'closed') {
                transport.close()
            }
        })

        // Store the transport in the peer object
        this.peers.get(peer_id).addTransport(transport)

        return {
            params: {
                id: transport.id,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates,
                dtlsParameters: transport.dtlsParameters
            }
        }
    }

    async connectPeerTransport(peer_id, transport_id, dtlsParameters) {
        if (!this.peers.has(peer_id)) return

        const peer = this.peers.get(peer_id)
        const transport = peer.transports.get(transport_id)

        if (!transport) {
            console.error(`Transport ${transport_id} not found for peer ${peer_id}`)
            return
        }

        await transport.connect({ dtlsParameters })
    }

    async produce(peer_id, producerTransportId, rtpParameters, kind) {
        // Get the peer from the peers map
        const peer = this.peers.get(peer_id)
        
        // Create the producer
        const producer = await peer.createProducer(producerTransportId, rtpParameters, kind)

        // Inform all other peers about the new producer
        this.broadcastNewProducer(peer_id, producer.id)

        return producer.id
    }

    broadcastNewProducer(peer_id, producer_id) {
        for (const otherPeer of this.peers.values()) {
            if (otherPeer.id !== peer_id) {
                this.io.to(otherPeer.id).emit('newProducers', [{
                    producer_id,
                    producer_socket_id: peer_id
                }])
            }
        }
    }

    // ... other methods (getRtpCapabilities, getProducerListForPeer, etc.) ...
}

module.exports = Room
