using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Entities;
using Service1.Interface;
using Repository.interfaces; // וודאי שזה השם המדויק של ה-Namespace
using Service1.Dto.RepresentativeDto;
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

        public List<RepresentativeChatDto> GetAll()
        {
            var representatives = _repository.GetAll();
            // מיפוי מרשימת ישויות לרשימת DTO
            return representatives.Select(r => new RepresentativeChatDto
            {
                EmailRepr = r.EmailRepr,
                NameRepr = r.NameRepr
            }).ToList();
        }

        public RepresentativeChatDto GetById(int id)
        {
            var r = _repository.GetById(id);
            if (r == null) return null;

            return new RepresentativeChatDto
            {
                EmailRepr = r.EmailRepr,
                NameRepr = r.NameRepr
            };
        }

        public RepresentativeChatDto AddRepresentative(string name, string email, string passward)
        {
            var newRepresentative = new Representative
            {
                NameRepr = name,
                EmailRepr = email,
                PasswordRepr = passward,
                ScoreForMonth = 0,
                entryHourRepr = new TimeOnly(),
                exitHourRepr = new TimeOnly(),
                StatusRepr = true
            };

            var savedRepresentative = _repository.AddItem(newRepresentative);

            return new RepresentativeChatDto
            {
                EmailRepr = savedRepresentative.EmailRepr,
                NameRepr = savedRepresentative.NameRepr
            };
        }

        public void UpdateRepresentative(int id, string name, string email, string passward)
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
