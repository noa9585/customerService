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
        Task<List<ChatSession>> GetAllWaiting();
        Task<List<ChatSession>> GetAllActive();
        Task<ChatSession> GetNextWaitingSession();


    }
}
