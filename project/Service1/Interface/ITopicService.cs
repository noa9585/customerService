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
        List<TopicDto> GetAll();
        TopicDto GetById(int id);
        TopicDto AddTopic(string name,double avrage,int priority);
        void UpdateTopic(int id, string name, double avrage, int priority,int totalSessionsCount);
        void DeleteTopic(int id);
    }
}
