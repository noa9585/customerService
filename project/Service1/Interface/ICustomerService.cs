using Service1.Dto.CustomerDto;
using Service1.Dto.RepresentativeDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service1.Interface
{
    public interface ICustomerService
    {
        Task<List<CustomerChatDto>> GetAll();
        Task<CustomerChatDto> GetById(int id);
        Task<CustomerRegisterDto> GetByIdToUpdate(int id);
        Task<CustomerChatDto> AddCustomer(string name, string email, string password);
        Task UpdateCustomer(int id, string name, string email, string password);
        Task DeleteCustomer(int id);
        Task<CustomerChatDto> Login(CustomerLoginDto customerLoginDto);
        Task<CustomerChatDto> Register(CustomerRegisterDto registerDto);
        Task Logout(int id);

    }
}
