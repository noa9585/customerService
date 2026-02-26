using Repository.Entities;
using Repository.interfaces;
using Service1.Dto.CustomerDto;
using Service1.Interface;

namespace Service1.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IRepository<Customer> _repository;

        // הזרקת ה-Repository דרך הבנאי
        public CustomerService(IRepository<Customer> repository)
        {
            _repository = repository;
        }

        public List<CustomerChatDto> GetAll()
        {
            var customers = _repository.GetAll();
            // מיפוי מרשימת ישויות לרשימת DTO
            return customers.Select(t => new CustomerChatDto
            {
                IDCustomers = t.IDCustomers,
                NameCust = t.NameCust,
                EmailCust = t.EmailCust,
            }).ToList();
        }

        public CustomerChatDto GetById(int id)
        {
            var t = _repository.GetById(id);
            if (t == null) return null;

            return new CustomerChatDto
            {
                IDCustomers= t.IDCustomers,
                NameCust = t.NameCust,
                EmailCust = t.EmailCust,
            };
        }

        public CustomerChatDto AddCustomer(string name, string email, string password)

        {
            var newCustomer = new Customer
            {
                NameCust = name,
                EmailCust = email,
                PasswordCust = password,
                StatusCust = true // ברירת מחדל
            };

            var saveCustomer = _repository.AddItem(newCustomer);

            return new CustomerChatDto
            {
                NameCust = saveCustomer.NameCust,
                EmailCust = saveCustomer.EmailCust,

            };
        }

        public void UpdateCustomer(int id, string name, string email, string PasswordCust)
        {
            var existing = _repository.GetById(id);
            if (existing != null)
            {
                existing.NameCust = name;
                existing.EmailCust = email;
                existing.PasswordCust = PasswordCust;

                _repository.UpdateItem(id, existing);
            }
        }

        public void DeleteCustomer(int id)
        {
            _repository.DeleteItem(id);
        }


    }
}