using Repository.Entities;
using Repository.interfaces;
using Service1.Dto.CustomerDto;
using Service1.Dto.RepresentativeDto;
using Service1.Interface;

namespace Service1.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IRepository<Customer> _repository;
        private readonly ITokenService _tokenService;

        // הזרקת ה-Repository ו-TokenService דרך הבנאי
        public CustomerService(IRepository<Customer> repository, ITokenService tokenService)
        {
            _repository = repository;
            _tokenService = tokenService;
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
                Role = t.Role,
                isOnline = t.IsOnline,
            }).ToList();
        }

        public CustomerChatDto GetById(int id)
        {
            var t = _repository.GetById(id);
            if (t == null) return null;

            return new CustomerChatDto
            {
                IDCustomer = t.IDCustomer,
                NameCust = t.NameCust,
                EmailCust = t.EmailCust,
                Role = t.Role,
                isOnline = t.IsOnline,
            };
        }


        public CustomerRegisterDto GetByIdToUpdate(int id)
        {
            var r = _repository.GetById(id);
            if (r == null) return null;

            return new CustomerRegisterDto
            {
                EmailCust = r.EmailCust,
                NameCust = r.NameCust,
                PasswordCust = r.PasswordCust,
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
                IsOnline=false, // ברירת מחדל
                Role = "Customer",
            };

            var saveCustomer = _repository.AddItem(newCustomer);


            return new CustomerChatDto
            {
                IDCustomer = saveCustomer.IDCustomer,
                NameCust = saveCustomer.NameCust,
                EmailCust = saveCustomer.EmailCust,
                Role = saveCustomer.Role,
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
            var customer = _repository.GetById(id);
            if (customer != null)
            {
                customer.StatusCust = false;
                _repository.UpdateItem(id, customer);
            }
            // _repository.DeleteItem(id);
        }

        public CustomerChatDto Login(CustomerLoginDto customerLoginDto)
        {
            // שליפת כל הלקוחות מה-Repository
            var customer = _repository.GetAll()
                .FirstOrDefault(c => c.EmailCust == customerLoginDto.EmailCust && c.PasswordCust == customerLoginDto.PasswordCust);

            // אם לא נמצא לקוח מתאים
            if (customer == null) return null;
            customer.IsOnline = true; // סימון הלקוח כפעיל כרגע במערכת
                _repository.UpdateItem(customer.IDCustomer, customer);
            // יצירת DTO והוספת טוקן
            return new CustomerChatDto
            {
                IDCustomer = customer.IDCustomer,
                NameCust = customer.NameCust,
                EmailCust = customer.EmailCust,
                Role = customer.Role,
                isOnline = customer.IsOnline,
                Token = _tokenService.GenerateTokenForCustomer(customer)
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
                IsOnline = true, //  מקוון כברירת מחדל
                Role = "Customer" // הגדרת תפקיד
            };

            // 3. שמירה בבסיס הנתונים
            var savedCustomer = _repository.AddItem(newCustomer);

            // 4. יצירת DTO והוספת טוקן
            return new CustomerChatDto
            {
                IDCustomer = savedCustomer.IDCustomer,
                NameCust = savedCustomer.NameCust,
                EmailCust = savedCustomer.EmailCust,
                Role = savedCustomer.Role,
                isOnline = savedCustomer.IsOnline,
                Token = _tokenService.GenerateTokenForCustomer(savedCustomer)
            };
        }
        public void Logout(int id)
        {
            var customer = _repository.GetById(id);
            if (customer != null)
            {
                // סימון הלקוח כלא פעיל כרגע במערכת
                customer.IsOnline = false;
                _repository.UpdateItem(id, customer);
            }
        }
    }
}