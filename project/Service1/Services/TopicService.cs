using System;
using System.Collections.Generic;
using System.Linq;
using Repository.Entities;
using Repository.interfaces; // וודאי שזה השם המדויק של ה-Namespace
using Service1.Dto.TopicDto;
using Service1.Interface;

namespace Service1.Services
{
    public class TopicService : ITopicService
    {
        private readonly IRepository<Topic> _repository;

        // הזרקת ה-Repository דרך הבנאי
        public TopicService(IRepository<Topic> repository)
        {
            _repository = repository;
        }

        public List<TopicDto> GetAll()
        {
            var topics = _repository.GetAll();
            // מיפוי מרשימת ישויות לרשימת DTO
            return topics.Select(t => new TopicDto
            {
                IDTopic = t.IDTopic,
                NameTopic = t.NameTopic,
                AverageTreatTime = t.AverageTreatTime,
                priorityTopics = t.priorityTopics,
                StatusTopic = t.StatusTopic,
                totalSessionsCount=t.totalSessionsCount
            }).ToList();
        }

        public TopicDto GetById(int id)
        {
            var t = _repository.GetById(id);
            if (t == null) return null;

            return new TopicDto
            {
                IDTopic = t.IDTopic,
                NameTopic = t.NameTopic,
                AverageTreatTime = t.AverageTreatTime,
                priorityTopics = t.priorityTopics,
                StatusTopic = t.StatusTopic,
                totalSessionsCount=t.totalSessionsCount
            };
        }

        public TopicDto AddTopic(string name, double average, int priority)
        {
            var newTopic = new Topic
            {
                NameTopic = name,
                AverageTreatTime = average,
                priorityTopics = priority,
                StatusTopic = true ,// ברירת מחדל
                totalSessionsCount=0
            };

            var savedTopic = _repository.AddItem(newTopic);

            return new TopicDto
            {
                IDTopic = savedTopic.IDTopic,
                NameTopic = savedTopic.NameTopic,
                AverageTreatTime = savedTopic.AverageTreatTime,
                priorityTopics = savedTopic.priorityTopics,
                StatusTopic = savedTopic.StatusTopic,
                totalSessionsCount=savedTopic.totalSessionsCount
            };
        }

        public void UpdateTopic(int id, string name, double average, int priority)
        {
            var existing = _repository.GetById(id);
            if (existing != null)
            {
                existing.NameTopic = name;
                existing.AverageTreatTime = average;
                existing.priorityTopics = priority;
                _repository.UpdateItem(id, existing);
            }
        }

        public void DeleteTopic(int id)
        {
            _repository.DeleteItem(id);
        }

      
    }
}