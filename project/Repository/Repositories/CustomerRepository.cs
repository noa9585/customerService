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

        public Customer AddItem(Customer item)
        {
            _context.Customers.Add(item);

            _context.save();
            return item;
        }
        public void DeleteItem(int id)
        {
            _context.Customers.Remove(GetById(id));
            _context.save();
        }
        public List<Customer> GetAll()
        {
            return _context.Customers.ToList();
        }
        public Customer GetById(int id)
        {
            return _context.Customers.ToList().FirstOrDefault(x => x.IDCustomer == id);
        }
        public void UpdateItem(int id, Customer item)
        {
            var cust = GetById(id);
           cust.IDCustomer = item.IDCustomer;
            cust.NameCust = item.NameCust;
            cust.EmailCust = item.EmailCust;
            cust.PasswordCust = item.PasswordCust;
            cust.StatusCust = item.StatusCust;
            _context.save();
        }
    }
}












