using Microsoft.AspNetCore.SignalR;

namespace Service1.Hubs
{
    public class ChatHub : Hub
    {
        // פונקציה שמאפשרת למשתמש להצטרף ל"חדר" ספציפי לפי ה-ID של השיחה
        public async Task JoinChat(int sessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId.ToString());
        }

        // פונקציה שהשרת יפעיל כדי לשלוח הודעה לכל מי שנמצא בחדר
        public async Task SendMessageToGroup(int sessionId, object message)
        {
            await Clients.Group(sessionId.ToString()).SendAsync("ReceiveMessage", message);
        }
    }
}