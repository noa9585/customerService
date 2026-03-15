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
        public async Task<Representative> AddItem(Representative item)
        {
            await _context.Representatives.AddAsync(item);
            await _context.SaveAsync();
            return item;
        }


        public async Task DeleteItem(int id)
        {
            var item = await GetById(id);
            if (item != null)
            {
                _context.Representatives.Remove(item);
                _context.SaveAsync();
            }
        }

        public async Task<List<Representative>> GetAll()
        {
            // שימוש ב-Include כדי לוודא שרשימת השעות נטענת מה-DB
            return await _context.Representatives.Include(x => x.LHours).ToListAsync();
        }

        public async Task<Representative> GetById(int id)
        {
            return await _context.Representatives.Include(x => x.LHours).FirstOrDefaultAsync(x => x.IDRepresentative == id);
        }

        public async Task UpdateItem(int id, Representative item)
        {
            var representative = await GetById(id);
            //representative.IDRepresentative = item.IDRepresentative;
            representative.ScoreForMonth = item.ScoreForMonth;
            representative.NameRepr = item.NameRepr;
            representative.EmailRepr = item.EmailRepr;
            representative.PasswordRepr = item.PasswordRepr;
            representative.entryHourRepr = item.entryHourRepr;
            representative.exitHourRepr = item.exitHourRepr;
            representative.StatusRepr = item.StatusRepr;
            representative.IsBusy = item.IsBusy;
            representative.IsOnline = item.IsOnline;
            representative.Role = item.Role;
            representative.LHours = item.LHours;
            _context.SaveAsync();
        }
    }
}
