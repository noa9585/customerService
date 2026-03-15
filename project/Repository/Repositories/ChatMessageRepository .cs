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
            if (item == null)
            {
                _context.ChatMessages.Remove(item);
            }
            await _context.SaveAsync();
        }


        public async Task<List<ChatMessage>> GetAll()
        {
            return await _context.ChatMessages.ToListAsync();
        }

        public async Task<ChatMessage> GetById(int id)
        {
            return await _context.ChatMessages.FirstOrDefaultAsync(x => x.MessageID == id);
        }

        public async Task UpdateItem(int id, ChatMessage item)
        {
            var chmes = await GetById(id);
            chmes.MessageID = item.MessageID;
            chmes.IDSession = item.IDSession;
            chmes.Message = item.Message;
            chmes.Timestamp = item.Timestamp;
            chmes.IDSend = item.IDSend;
            chmes.MessageType = item.MessageType;
            chmes.StatusMessage = item.StatusMessage;

            _context.SaveAsync();
        }
        public async Task<List<ChatMessage>> GetMessagesBySessionId(int sessionId)
        {
            return await _context.ChatMessages
                .Where(m => m.IDSession == sessionId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }
    }
}
