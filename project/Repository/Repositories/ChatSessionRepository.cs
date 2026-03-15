using Repository.Entities;
using Repository.interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace Repository.Repositories
{
    public class ChatSessionRepository : IChatSessionRepository
    {
        private readonly IContext _context;
        public ChatSessionRepository(IContext context)
        {
            this._context = context;
        }
        public async Task<ChatSession> AddItem(ChatSession item)
        {
             await _context.ChatSessions.AddAsync(item);

           await _context.SaveAsync();
            return item;
        }

        public async Task DeleteItem(int id)
        {
            var item = await GetById(id);
            if (item != null)
             {
                 _context.ChatSessions.Remove(item);
             }
            _context.SaveAsync();
        }

        public async Task<List<ChatSession>> GetAll()
        {
            return await _context.ChatSessions.ToListAsync();
        }
        public async Task<List<ChatSession>> GetAllWaiting()
        {
            return await _context.ChatSessions.Where(x => x.statusChat == SessionStatus.Waiting).OrderBy(x=>x.EstimatedWaitTime).ToListAsync();
        }
        public async Task<List<ChatSession>> GetAllActive()
        {
            return await _context.ChatSessions.Where(x => x.statusChat == SessionStatus.Active).OrderBy(x => x.SessionID).ToListAsync();
        }

        public async Task<ChatSession> GetById(int id)
        {
            return await _context.ChatSessions.FirstOrDefaultAsync(x => x.SessionID == id);
        }

        public async Task UpdateItem(int id, ChatSession item)
        {
            var chses =await GetById(id);
            chses.SessionID = item.SessionID;
            chses.Messages = item.Messages;
            chses.StartTimestamp = item.StartTimestamp;
            chses.ServiceStartTimestamp = item.ServiceStartTimestamp;
            chses.EndTimestamp = item.EndTimestamp;
            chses.status=item.status;
            chses.statusChat=item.statusChat;
            chses.IDCustomer = item.IDCustomer;
            chses.IDRepresentative = item.IDRepresentative;
            chses.IDTopic = item.IDTopic;
            chses.EstimatedWaitTime = item.EstimatedWaitTime;
            _context.SaveAsync();
        }

        public async Task<ChatSession> GetNextWaitingSession()
        {
            return await _context.ChatSessions
                .Where(cs => cs.statusChat == SessionStatus.Waiting)
                .OrderBy(cs => cs.EstimatedWaitTime) 
                .FirstOrDefaultAsync();
        }
    }
}






