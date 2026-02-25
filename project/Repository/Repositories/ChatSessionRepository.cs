using Repository.Entities;
using Repository.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class ChatSessionRepository : IRepository<ChatSession>
    {
        private readonly IContext _context;
        public ChatSessionRepository(IContext context)
        {
            this._context = context;
        }
        public ChatSession AddItem(ChatSession item)
        {
            _context.ChatSessions.ToList().Add(item);

            _context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            _context.ChatSessions.ToList().Remove(GetById(id));
            _context.save();
        }

        public List<ChatSession> GetAll()
        {
            return _context.ChatSessions.ToList();
        }

        public ChatSession GetById(int id)
        {
            return _context.ChatSessions.ToList().FirstOrDefault(x => x.SessionID == id);
        }

        public void UpdateItem(int id, ChatSession item)
        {
            var chses = GetById(id);
            chses.Messages = item.Messages;
            chses.ChatStatus = item.ChatStatus;
            chses.StartTimestamp = item.StartTimestamp;
            chses.EndTimestamp = item.EndTimestamp;
            chses.Subject = item.Subject;
            chses.ChatStatus = item.ChatStatus;
            chses.IDCustomer = item.IDCustomer;
            chses.IDRepresentative = item.IDRepresentative;
            _context.save();
        }
    }
}
