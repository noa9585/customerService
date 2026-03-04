using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using Repository.interfaces;
namespace Repository.Repositories
{
    public class RepresentativeRepository : IRepository<Representative>
    {
        private readonly IContext _context;
        public RepresentativeRepository(IContext context)
        {
            this._context = context;
        }
        public Representative AddItem(Representative item)
        {
            _context.Representatives.Add(item);

            _context.save();
            return item;
        }


        public void DeleteItem(int id)
        {
            var item = GetById(id);
            if (item != null)
            {
                _context.Representatives.Remove(item);
                _context.save();
            }
        }

        public List<Representative> GetAll()
        {
            // שימוש ב-Include כדי לוודא שרשימת השעות נטענת מה-DB
            return _context.Representatives
                           .Include(x => x.LHours)
                           .ToList();
        }

        public Representative GetById(int id)
        {

            // חיפוש ישירות ב-DB עם טעינת השעות, ללא ToList מקדים
            return _context.Representatives.Include(x => x.LHours).FirstOrDefault(x => x.IDRepresentative == id);
            //return _context.Representatives.ToList().FirstOrDefault(x => x.IDRepresentative == id);
        }

        public void UpdateItem(int id, Representative item)
        {
            var representative = GetById(id);
            //representative.IDRepresentative = item.IDRepresentative;
            representative.ScoreForMonth = item.ScoreForMonth;
            representative.NameRepr = item.NameRepr;
            representative.EmailRepr = item.EmailRepr;
            representative.PasswordRepr = item.PasswordRepr;
            representative.entryHourRepr = item.entryHourRepr;
            representative.exitHourRepr = item.exitHourRepr;
            representative.StatusRepr = item.StatusRepr;
            representative.IsBusy= item.IsBusy;
            representative.IsOnline=item.IsOnline;
            representative.Role = item.Role; 
            representative.LHours = item.LHours;
            _context.save();
        }
    }
}
