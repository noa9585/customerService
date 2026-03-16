using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.interfaces
{
    public interface IRepresentativeRepository : IRepository<Representative>
    {
        Task<List<Representative>> GetAllPending();
    }

}
