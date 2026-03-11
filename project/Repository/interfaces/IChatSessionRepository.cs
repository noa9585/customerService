using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Repository.interfaces
{
    public interface IChatSessionRepository : IRepository<ChatSession>
    {
        List<ChatSession> GetAllWaiting();
        List<ChatSession> GetAllActive();
        ChatSession GetNextWaitingSession();


    }
}
