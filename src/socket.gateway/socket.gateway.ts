// import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";

// @WebSocketGateway( {
//     cors: {
//         origin: 'http://kdh.supomarket.com',
//     },
// })

// export class ChatBackEndGateway
//     implements OnGatewayConnection, OnGatewayDisconnect
// {
//     // constructor(private readonly ChatRoomService: ChatRoomService,) {}

//     @WebSocketServer()
//     server: Server;
//     users: number = 0;
//     //소켓 연결시 유저목록에 추가
//     public handleConnection(client: Socket): void {
        
//         console.log('socketsocketsocketsocketsocketsocket')
//         console.log('connected', client.id);
//         client.leave(client.id);
//         client.data.roomId = `room:lobby`;
//         client.join('room:lobby');
//         this.users = this.users + 1;
//         console.log('접속자 수: ' + this.users);
//     }

//     //소켓 연결 해제시 유저목록에서 제거
//     public handleDisconnect(client: Socket): void {
//         const { roomId } = client.data;
//         if (
//             roomId != 'room:lobby' &&
//             !this.server.sockets.adapter.rooms.get(roomId)
//         ) {
//             // this.server.emit(
//             //     'getChatRoomList',
//             //     this.ChatRoomService.getChatRoomList(),
//             // );
//         }
//         this.users = this.users - 1;
//         console.log('접속자 수: ' + this.users);
//         console.log('disonnected', client.id);
//     }
    
//     @SubscribeMessage('sendUsers')
//     sendUsers(client: Socket): void {
//         console.log('신호 받음');
//         client.emit('getMessages', {
//             userNum: this.users.toString,
//         });
//         console.log('신호 갔음 나이스: ' + this.users);
//     }
// }