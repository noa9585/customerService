using Repository.Entities;
using Repository.interfaces;

namespace Repository.Repositories
{
    public class TopicRepository : IRepository<Topic>
    {
        private readonly IContext _context;
        public TopicRepository(IContext context)
        {
            this._context = context;
        }
        public Topic AddItem(Topic item)
        {
            _context.Topics.Add(item);
            _context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            _context.Topics.Remove(GetById(id));
            _context.save();
        }

        public List<Topic> GetAll()
        {
            return _context.Topics.ToList();
        }

        public Topic GetById(int id)
        {
            return _context.Topics.ToList().FirstOrDefault(x => x.IDTopics == id);
        }

        public void UpdateItem(int id, Topic item)
        {
            var topic = GetById(id);
            topic.IDTopics = item.IDTopics;
            topic.NameTopic = item.NameTopic;
            topic.AverageTreatTime = item.AverageTreatTime;
            topic.priorityTopics = item.priorityTopics;
            topic.StatusTopic = item.StatusTopic;
            _context.save();
        }
    }
}
