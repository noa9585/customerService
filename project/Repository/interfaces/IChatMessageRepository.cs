using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.interfaces
{
    public interface IChatMessageRepository: IRepository<ChatMessage>
    {
        List<ChatMessage> GetMessagesBySessionId(int sessionId);
    }
}
