using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service1.Dto.CustomerDto;

namespace Service1.Interface
{
    public interface ICustomerService
    {
        List<CustomerChatDto> GetAll();
        CustomerChatDto GetById(int id);
        CustomerChatDto AddCustomer(string name, string email, string password);
        void UpdateCustomer(string name, string email);
        void DeleteCustomer(int id);
    }
}
