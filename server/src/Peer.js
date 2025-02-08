module.exports = class Peer {
  constructor(socket_id, name) {
    this.id = socket_id
    this.name = name
    this.transports = new Map()
    this.consumers = new Map()
    this.producers = new Map()
  }

  addTransport(transport) {
    this.transports.set(transport.id, transport)
  }

  async createProducer(producerTransportId, rtpParameters, kind) {
    let producer = await this.transports.get(producerTransportId).produce({
      kind,
      rtpParameters
    })

    this.producers.set(producer.id, producer)

    producer.on('transportclose', () => {
      console.log('Producer transport close')
      producer.close()
      this.producers.delete(producer.id)
    })

    return producer
  }

  getProducer(producer_id) {
    return this.producers.get(producer_id)
  }

  closeProducer(producer_id) {
    try {
      this.producers.get(producer_id).close()
    } catch(e) {
      console.warn(e)
    }

    this.producers.delete(producer_id)
  }

  async createConsumer(consumer_transport_id, producer_id, rtpCapabilities) {
    let consumerTransport = this.transports.get(consumer_transport_id)
    let consumer = null

    try {
      consumer = await consumerTransport.consume({
        producerId: producer_id,
        rtpCapabilities,
        paused: false // see note above about always starting paused
      })
    } catch (error) {
      console.error('Consume failed', error)
      return
    }

    this.consumers.set(consumer.id, consumer)

    consumer.on('transportclose', () => {
      console.log('Consumer transport close')
      this.consumers.delete(consumer.id)
    })

    return {
      consumer,
      params: {
        producerId: producer_id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused
      }
    }
  }

  closeConsumer(consumer_id) {
    try {
      this.consumers.get(consumer_id).close()
    } catch(e) {
      console.warn(e)
    }

    this.consumers.delete(consumer_id)
  }

  close() {
    this.transports.forEach((transport) => transport.close())
  }

  removeConsumer(consumer_id) {
    this.consumers.delete(consumer_id)
  }
}
