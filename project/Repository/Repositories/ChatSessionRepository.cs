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
            await _context.SaveAsync();
        }

        public async Task<List<ChatSession>> GetAll()
        {
            return await _context.ChatSessions.ToListAsync();
        }
        public async Task<List<ChatSession>> GetAllWaiting()
        {
            return await _context.ChatSessions.Where(x => x.statusChat == SessionStatus.Waiting).OrderBy(x => x.EstimatedWaitTime).ToListAsync();
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
            var existingSession = await GetById(id);
            existingSession.SessionID = item.SessionID;
            existingSession.Messages = item.Messages;
            existingSession.StartTimestamp = item.StartTimestamp;
            existingSession.ServiceStartTimestamp = item.ServiceStartTimestamp;
            existingSession.EndTimestamp = item.EndTimestamp;
            existingSession.status = item.status;
            existingSession.statusChat = item.statusChat;
            existingSession.IDCustomer = item.IDCustomer;
            existingSession.IDRepresentative = item.IDRepresentative;
            existingSession.IDTopic = item.IDTopic;
            existingSession.EstimatedWaitTime = item.EstimatedWaitTime;
            await _context.SaveAsync();
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






