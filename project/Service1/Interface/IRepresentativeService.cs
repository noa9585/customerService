using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service1.Dto.RepresentativeDto;
namespace Service1.Interface
{
    public interface IRepresentativeService
    {
      Task  <List<RepresentativeDto>> GetAll();
       Task <RepresentativeDto> GetById(int id);
        Task<RepresentativeUpdateDto> GetByIdToUpdate(int id);
        Task<RepresentativeDto> AddRepresentative(string name,string email, string passward);
        Task UpdateRepresentative(int id,string name, string email, string passward);
        Task DeleteRepresentative(int id);
        Task<RepresentativeDto> Login(RepresentativeLoginDto loginDto);
        Task<RepresentativeDto> Register(RepresentativeRegisterDto registerDto);
        Task Logout(int id);
        Task ToggleBreak(int id);
        Task ReturnFromBreak(int id);
        Task<bool>  HasOnlineRepresentatives();
    }
}
