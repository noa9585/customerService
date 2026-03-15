using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using Repository.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class CustomerRepository:IRepository<Customer>
    {
        private readonly IContext _context;
        public CustomerRepository(IContext context)
        {
            this._context = context;
        }

        public async Task<Customer> AddItem(Customer item)
        {
            await _context.Customers.AddAsync(item);

            _context.SaveAsync();
            return item;
        }
        public async Task DeleteItem(int id)
        {
            var item =await GetById(id);
            if(item != null)
            {
                _context.Customers.Remove(item);
                await _context.SaveAsync();
            }
               
        }
        public async Task<List<Customer>> GetAll()
        {
            return await _context.Customers.ToListAsync();
        }
        public async Task<Customer> GetById(int id)
        {
            return await _context.Customers.FirstOrDefaultAsync(x => x.IDCustomer == id);
        }
        public async Task UpdateItem(int id, Customer item)
        {
            var cust = await GetById(id);
           cust.IDCustomer = item.IDCustomer;
            cust.NameCust = item.NameCust;
            cust.EmailCust = item.EmailCust;
            cust.PasswordCust = item.PasswordCust;
            cust.StatusCust = item.StatusCust;
            cust.Role = item.Role; 
            cust.IsOnline = item.IsOnline;
            _context.SaveAsync();
        }
    }
}












