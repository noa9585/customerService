using Repository.Entities;
using Repository.interfaces; // וודאי שזה השם המדויק של ה-Namespace
using Service1.Dto.RepresentativeDto;
using Service1.Dto.TopicDto;
using Service1.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Service1.Services
{
    public class RepresentativeService : IRepresentativeService
    {

        private readonly IRepository<Representative> _repository;

        // הזרקת ה-Repository דרך הבנאי
        public RepresentativeService(IRepository<Representative> repository)
        {
            _repository = repository;
        }

        public List<RepresentativeDto> GetAll()
        {
            var representatives = _repository.GetAll();
            // מיפוי מרשימת ישויות לרשימת DTO
            return representatives.Select(r => new RepresentativeDto
            {
                IDRepresentative = r.IDRepresentative,
                EmailRepr = r.EmailRepr,
                NameRepr = r.NameRepr,
                entryHourRepr = r.entryHourRepr,
                exitHourRepr = r.exitHourRepr,
                IsBusy = r.IsBusy,
                IsOnline = r.IsOnline,
                ScoreForMonth = r.ScoreForMonth,
                StatusRepr = r.StatusRepr                
            }).ToList();
        }
    

        public RepresentativeDto GetById(int id)
        {
            var r = _repository.GetById(id);
            if (r == null) return null;

            return new RepresentativeDto
            {
                IDRepresentative = r.IDRepresentative,
                EmailRepr = r.EmailRepr,
                NameRepr = r.NameRepr,
                entryHourRepr = r.entryHourRepr,
                exitHourRepr = r.exitHourRepr,
                IsBusy = r.IsBusy,
                IsOnline = r.IsOnline,
                ScoreForMonth = r.ScoreForMonth,
                StatusRepr = r.StatusRepr
            };
        }

        public RepresentativeRegisterDto AddRepresentative(string name, string email, string passward)
        {
            var newRepresentative = new Representative
            {
                NameRepr = name,
                EmailRepr = email,
                PasswordRepr = passward,
                ScoreForMonth = 0,
                entryHourRepr = new TimeOnly(),
                exitHourRepr = new TimeOnly(),
                StatusRepr = true,
                IsOnline=false,
                IsBusy=false
            };

            var savedRepresentative = _repository.AddItem(newRepresentative);
            Console.WriteLine(savedRepresentative.IDRepresentative);
            return new RepresentativeRegisterDto
            {
                EmailRepr = savedRepresentative.EmailRepr,
                NameRepr = savedRepresentative.NameRepr,
                PasswordRepr= savedRepresentative.PasswordRepr,
            };
        }


        public void UpdateRepresentative(int id,string name, string email, string passward)
        {
            var existing = _repository.GetById(id);
            if (existing != null)
            {
                existing.EmailRepr = email;
                existing.NameRepr = name;
                existing.PasswordRepr = passward;           
                _repository.UpdateItem(id, existing);
            }
        }

   
       


        public void DeleteRepresentative(int id)
        {
            _repository.DeleteItem(id);
        }
    }
}
