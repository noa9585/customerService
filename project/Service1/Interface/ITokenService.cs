using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Service1.Interface
{
    public interface ITokenService
    {
        string GenerateTokenForCustomer(Repository.Entities.Customer customer);
        string GenerateTokenForRepresentative(Repository.Entities.Representative representative);
    }
}



