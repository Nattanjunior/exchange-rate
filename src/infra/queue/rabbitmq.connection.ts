import amqp, { Channel, Connection } from 'amqplib';

export class RabbitMQConnection {
  private static connection: Connection;
  private static channel: Channel;

  static async getChannel(): Promise<Channel> {
    if (!this.channel) {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL as string);
      this.channel = await this.connection.createChannel();
    }

    return this.channel;
  }
}
