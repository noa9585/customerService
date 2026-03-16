using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Interface
{
    public interface IAIScoreService
    {
        Task<int> AnalyzeAndScoreAsync(List<ChatMessage> messages);
    }
}
