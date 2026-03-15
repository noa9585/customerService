using Repository.Entities;
using Repository.interfaces;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Repository.Repositories
{
    public class TopicRepository : IRepository<Topic>
    {
        private readonly IContext _context;
        public TopicRepository(IContext context)
        {
            this._context = context;
        }
        public async Task<Topic> AddItem(Topic item)
        {
            await _context.Topics.AddAsync(item);
            await _context.save();
            return  item;
        }

        public async void DeleteItem(int id)
        {
            _context.Topics.Remove(GetById(id));
           await _context.save();
        }

        public async Task<List<Topic>> GetAll()
        {
            return await _context.Topics.ToListAsync();
        }

        public Topic GetById(int id)
        {
            return _context.Topics.ToList().FirstOrDefault(x => x.IDTopic == id);
        }

        public void UpdateItem(int id, Topic item)
        {
            var topic = GetById(id);
            topic.IDTopic = item.IDTopic;
            topic.NameTopic = item.NameTopic;
            topic.AverageTreatTime = item.AverageTreatTime;
            topic.priorityTopics = item.priorityTopics;
            topic.StatusTopic = item.StatusTopic;
            topic.totalSessionsCount = item.totalSessionsCount;
            _context.save();
        }
    }
}


