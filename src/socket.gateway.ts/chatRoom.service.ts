// @Injectable()
// export class ChatRoomService {
//     private chatRoomList: Record<string, chatRoomListDTO>;
//     // private readonly fcm: admin.messaging.Messaging;
//     constructor(
        
//     ) {
//         this.chatRoomList = {
//             'room: lobby': {
//                 roomId: 'room: lobby',
//                 roomuuID: 'NoOne',
//                 roomName: '로비',
//                 cheifId: null,
//             }, 
//         };
//         // admin.initializeApp({
//         //     credential: admin.credential.cert('/root/chatNestcode/chatting-app-da5a5-firebase-adminsdk-cpyu9-fc9ce42d9f.json'),
//         //     projectId: 'chatting-app-da5a5',
//         // });
//     //     this.fcm = admin.messaging();
//      }


    
//     getChatRoomList(): Record<string, chatRoomListDTO> {
//         return this.chatRoomList;
//     }

// }