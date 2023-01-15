import client from 'amqplib';
import { FollowRequest, UnfollowRequest } from '../models/Follow';
import { Message, MessageAndUserUUIDs } from '../models/Message';
import { User } from '../models/User';

export default class CloudAMQPEventBroker {
    private connection: any;
    private channels: any = {};
    private databaseConnection: any;

    constructor(databaseConnection: any) {
        this.databaseConnection = databaseConnection;
    }

    private getChannel = async (exchangeName: string) => {
        if(!this.channels[exchangeName]) {
            this.channels[exchangeName] = await this.connection.createChannel();
            this.channels[exchangeName].assertExchange(exchangeName, 'topic', {durable: false});
        }
        return this.channels[exchangeName];
    }

    public connect = async () => {
        this.connection = await client.connect(process.env.CLOUDAMQP_URL as string);

        this.listenToMessagesExchange();
    }

    public listenToMessagesExchange = async () => {
        const exchange = 'messages';
        const channel = await this.getChannel(exchange);

        await channel.assertQueue('users_message-created');
        await channel.bindQueue('users_message-created', exchange, 'message.created');
        await channel.consume('users_message-created', async (msg: any) => {
            if(msg.content) {
                const message: Message = JSON.parse(msg.content);
                this.createdMessageEvent(message);
            }
        }, {noAck: true});
    }

    private createdMessageEvent = async (message: Message) => {
        const exchange = 'users';
        const channel = await this.getChannel(exchange);

        const users = await this.databaseConnection.getFollowers(message.user_uuid);

        if(users !== undefined) {
            const messageAndUserUUIDs: MessageAndUserUUIDs = {
                message: message,
                user_uuids: users.map((user: User) => user.uuid)
            }

            const serializedMessageAndUserUUIDs = JSON.stringify(messageAndUserUUIDs);
            channel.publish(exchange, 'message.created', Buffer.from(serializedMessageAndUserUUIDs));
        }
    }

    public createdUserEvent = async (createdUserPromise: Promise<User | undefined>) => {
        const exchange = 'users';
        const channel = await this.getChannel(exchange);

        const user = await createdUserPromise;

        if(user !== undefined) {
            const serializedUser = JSON.stringify(user);
            channel.publish(exchange, 'user.created', Buffer.from(serializedUser));
        }
    }    

    public followEvent = async (followedUserPromise: Promise<User | undefined>, followRequest: FollowRequest) => {
        const exchange = 'users';
        const channel = await this.getChannel(exchange);

        const user = await followedUserPromise;

        if(user !== undefined) {
            const serializedFollowRequest = JSON.stringify(followRequest);
            channel.publish(exchange, 'user.followed', Buffer.from(serializedFollowRequest));
        }
    }

    public unfollowEvent = async (unfollowedUserPromise: Promise<User | undefined>, unfollowRequest: UnfollowRequest) => {
        const exchange = 'users';
        const channel = await this.getChannel(exchange);

        const user = await unfollowedUserPromise;

        if(user !== undefined) {
            const serializedUnfollowRequest = JSON.stringify(unfollowRequest);
            channel.publish(exchange, 'user.unfollowed', Buffer.from(serializedUnfollowRequest));
        }

    }


}