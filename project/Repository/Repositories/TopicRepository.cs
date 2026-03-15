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
            await _context.SaveAsync();
            return item;
        }

        public async Task DeleteItem(int id)
        {
            var itemToDelete = await GetById(id);
            if (itemToDelete != null)
            {
                _context.Topics.Remove(itemToDelete);

                await _context.SaveAsync();
            }
        }

        public async Task<List<Topic>> GetAll()
        {
            return await _context.Topics.ToListAsync();
        }

        public async Task<Topic> GetById(int id)
        {
            return await _context.Topics.FirstOrDefaultAsync(x => x.IDTopic == id);
        }

        public async Task UpdateItem(int id, Topic item)
        {
            var topic = await GetById(id);
            topic.IDTopic = item.IDTopic;
            topic.NameTopic = item.NameTopic;
            topic.AverageTreatTime = item.AverageTreatTime;
            topic.priorityTopics = item.priorityTopics;
            topic.StatusTopic = item.StatusTopic;
            topic.totalSessionsCount = item.totalSessionsCount;
            _context.SaveAsync();
        }
    }
}


