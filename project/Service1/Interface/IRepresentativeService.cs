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
        List<RepresentativeDto> GetAll();
        RepresentativeDto GetById(int id);
        RepresentativeDto AddRepresentative(string name,string email, string passward);
        void UpdateRepresentative(int id,string name, string email, string passward);
        void DeleteRepresentative(int id);
        RepresentativeDto Login(RepresentativeLoginDto loginDto);
        RepresentativeDto Register(RepresentativeRegisterDto registerDto);
        void Logout(int id);
        void ToggleBreak(int id);
        void ReturnFromBreak(int id);
        bool HasOnlineRepresentatives();
    }
}
