using System;
using System.Collections.Generic;
using System.Linq;
using Repository.Entities;
using Repository.interfaces; // וודאי שזה השם המדויק של ה-Namespace
using Service1.Dto.TopicDto;
using Service1.Interface;
using AutoMapper;

namespace Service1.Services
{
    public class TopicService : ITopicService
    {
        private readonly IRepository<Topic> _repository;
        private readonly IMapper _mapper;
        // הזרקת ה-Repository דרך הבנאי
        public TopicService(IRepository<Topic> repository, IMapper mapper) // עדכון הבנאי
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<TopicDto>> GetAll()
        {
            var topics = await _repository.GetAll();
            return _mapper.Map<List<TopicDto>>(topics);
        }

        public async Task<TopicDto> GetById(int id)
        {
            var t =await _repository.GetById(id);
            if (t == null) return null;
            return _mapper.Map<TopicDto>(t);
        }

        public async Task<TopicDto> AddTopic(string name, double average, double priority)
        {
            var newTopic = new Topic
            {
                NameTopic = name,
                AverageTreatTime = average,
                priorityTopics = priority,
                StatusTopic = true ,// ברירת מחדל
                totalSessionsCount=0
            };

            var savedTopic =await _repository.AddItem(newTopic);

            return _mapper.Map<TopicDto>(savedTopic);
        }

        public async Task UpdateTopic(int id, string name, double average, double priority)
        {
            var existing = await _repository.GetById(id);
            if (existing != null)
            {
                existing.NameTopic = name;
                existing.AverageTreatTime = average;
                existing.priorityTopics = priority;
               await _repository.UpdateItem(id, existing);
            }
        }

        public async Task DeleteTopic(int id)
        {
           await _repository.DeleteItem(id);
        }

      
    }
}