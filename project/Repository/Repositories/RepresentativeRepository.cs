using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using Repository.interfaces;
namespace Repository.Repositories
{
    public class RepresentativeRepository : IRepresentativeRepository
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
                item.StatusRepr = false;
                //_context.Representatives.Remove(item);
                await _context.SaveAsync();
            }
        }

        public async Task<List<Representative>> GetAll()
        {
            return await _context.Representatives.Where(r=>r.StatusRepr).Include(x => x.LHours).ToListAsync();
        }

        public async Task<Representative> GetById(int id)
        {
            return await _context.Representatives.Include(x => x.LHours).FirstOrDefaultAsync(x => x.IDRepresentative == id&&x.StatusRepr);
        }

        public async Task UpdateItem(int id, Representative item)
        {
            var representative = await GetById(id);
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
            await _context.SaveAsync();
        }
        public async Task<List<Representative>> GetAllPending()
        {
            return await _context.Representatives.Where(r => r.Role=="Waiting").Include(x => x.LHours).ToListAsync();

        }
    }
}
