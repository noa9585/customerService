using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service1.Dto.TopicDto;
//using Service1.Dto.TopicAddDto;
namespace Service1.Interface
{
    public interface ITopicService
    {
        Task<List<TopicDto>> GetAll();
        Task<TopicDto> GetById(int id);
        Task<TopicDto> AddTopic(string name, double avrage, double priority);
        Task UpdateTopic(int id, string name, double avrage, double priority);
        Task DeleteTopic(int id);
    }
}
