using Repository.Entities;
using Repository.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Repository.Repositories
{
    public class ChatMessageRepository : IChatMessageRepository
    {
        private readonly IContext _context;
        public ChatMessageRepository(IContext context)
        {
            this._context = context;
        }

        public async Task<ChatMessage> AddItem(ChatMessage item)

        {
            await _context.ChatMessages.AddAsync(item);
            await _context.SaveAsync();
            return item;
        }

        public async Task DeleteItem(int id)
        {
            var item = await GetById(id);
            if (item != null)
            {
                item.StatusMessage = false;
                //_context.ChatMessages.Remove(item);
            }
            await _context.SaveAsync();
        }

        public async Task<List<ChatMessage>> GetAll()
        {
            return await _context.ChatMessages.Where(x => x.StatusMessage == true).ToListAsync();
        }

        public async Task<ChatMessage> GetById(int id)
        {
            return await _context.ChatMessages.FirstOrDefaultAsync(x => x.MessageID == id && x.StatusMessage == true);
        }

        public async Task UpdateItem(int id, ChatMessage item)
        {
            var existingMessage = await GetById(id);
            existingMessage.MessageID = item.MessageID;
            existingMessage.IDSession = item.IDSession;
            existingMessage.Message = item.Message;
            existingMessage.Timestamp = item.Timestamp;
            existingMessage.IDSend = item.IDSend;
            existingMessage.MessageType = item.MessageType;
            existingMessage.StatusMessage = item.StatusMessage;
            await _context.SaveAsync();
        }
        public async Task<List<ChatMessage>> GetMessagesBySessionId(int sessionId)
        {
            return await _context.ChatMessages
                .Where(m => m.IDSession == sessionId && m.StatusMessage == true)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }
    }
}
