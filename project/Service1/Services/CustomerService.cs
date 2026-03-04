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
                IDCustomer = t.IDCustomer,
                NameCust = t.NameCust,
                EmailCust = t.EmailCust,
                Role=t.Role,
            }).ToList();
        }

        public CustomerChatDto GetById(int id)
        {
            var t = _repository.GetById(id);
            if (t == null) return null;

            return new CustomerChatDto
            {
                IDCustomer= t.IDCustomer,
                NameCust = t.NameCust,
                EmailCust = t.EmailCust,
                Role=t.Role,
            };
        }

        public CustomerChatDto AddCustomer(string name, string email, string password)

        {
            var newCustomer = new Customer
            {
                NameCust = name,
                EmailCust = email,
                PasswordCust = password,
                StatusCust = true, // ברירת מחדל
                Role= "Customer",
            };

            var saveCustomer = _repository.AddItem(newCustomer);

            return new CustomerChatDto
            {
                IDCustomer=saveCustomer.IDCustomer,
                NameCust = saveCustomer.NameCust,
                EmailCust = saveCustomer.EmailCust,
                Role=saveCustomer.Role,

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

        public CustomerChatDto Login(CustomerLoginDto customerLoginDto)
        {
            // שליפת כל הלקוחות מה-Repository
            var customer = _repository.GetAll()
                .FirstOrDefault(c => c.EmailCust == customerLoginDto.EmailCust && c.PasswordCust == customerLoginDto.PasswordCust);

            // אם לא נמצא לקוח מתאים
            if (customer == null) return null;

            // החזרת הנתונים בפורמט DTO
            return new CustomerChatDto
            {
                IDCustomer = customer.IDCustomer,
                NameCust = customer.NameCust,
                EmailCust = customer.EmailCust,
                Role=customer.Role,
                
            };
        }
        public CustomerChatDto Register(CustomerRegisterDto registerDto)
        {
            // 1. בדיקה אם האימייל כבר תפוס
            var existingCustomer = _repository.GetAll()
                .FirstOrDefault(c => c.EmailCust == registerDto.EmailCust);

            if (existingCustomer != null)
            {
                throw new Exception("משתמש עם אימייל זה כבר קיים במערכת");
            }

            // 2. יצירת ישות לקוח חדשה מה-DTO
            var newCustomer = new Customer
            {
                NameCust = registerDto.NameCust,
                EmailCust = registerDto.EmailCust,
                PasswordCust = registerDto.PasswordCust,
                StatusCust = true, // לקוח פעיל כברירת מחדל
                Role = "Customer" // הגדרת תפקיד כפי שסיכמנו
            };

            // 3. שמירה בבסיס הנתונים
            var savedCustomer = _repository.AddItem(newCustomer);

            // 4. החזרת DTO ללא הסיסמה
            return new CustomerChatDto
            {
                IDCustomer = savedCustomer.IDCustomer,
                NameCust = savedCustomer.NameCust,
                EmailCust = savedCustomer.EmailCust
            };
        }
    }
}