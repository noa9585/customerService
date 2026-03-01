using Repository.Entities;
using Repository.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class ChatMessageRepository : IRepository<ChatMessage>
    {
        private readonly IContext _context;
        public ChatMessageRepository (IContext context)
        {
            this._context = context;
        }
        public ChatMessage AddItem(ChatMessage item)

        {
            _context.ChatMessages.Add(item);

            _context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            _context.ChatMessages.Remove(GetById(id));
            _context.save();
        }


        public List<ChatMessage> GetAll()
        {
            return _context.ChatMessages.ToList();
        }

        public ChatMessage GetById(int id)
        {
            return _context.ChatMessages.ToList().FirstOrDefault(x => x.MessageID == id);
        }

        public void UpdateItem(int id, ChatMessage item)
        {
            var chmes = GetById(id);
            chmes.MessageID = item.MessageID;
            chmes.Message= item.Message;
            chmes.Timestamp = item.Timestamp;
            chmes.IDSend = item.IDSend;
            chmes.MessageType= item.MessageType;
            chmes.StatusMessage= item.StatusMessage;
            chmes.IDRepresentative = item.IDRepresentative;
            chmes.IDCustomer = item.IDCustomer;
            _context.save();
        }
    }
}
