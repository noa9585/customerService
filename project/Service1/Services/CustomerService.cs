using Repository.Entities;
using Repository.interfaces;
using Service1.Dto.CustomerDto;
using Service1.Dto.RepresentativeDto;
using Service1.Interface;
using AutoMapper;
namespace Service1.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IRepository<Customer> _repository;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        // הזרקת ה-Repository ו-TokenService דרך הבנאי
        public CustomerService(IRepository<Customer> repository, ITokenService tokenService, IMapper mapper)
        {
            _repository = repository;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        public async Task<List<CustomerChatDto>> GetAll()
        {
            var customers = await _repository.GetAll();
            // מיפוי מרשימת ישויות לרשימת DTO
            return _mapper.Map<List<CustomerChatDto>>(customers);
        }

        public async Task <CustomerChatDto> GetById(int id)
        {
            var t =await _repository.GetById(id);
            if (t == null) return null;

            return _mapper.Map<CustomerChatDto>(t);
        }


        public async Task <CustomerRegisterDto> GetByIdToUpdate(int id)
        {
            var r =await _repository.GetById(id);
            if (r == null) return null;

           return _mapper.Map<CustomerRegisterDto>(r);
        }
        public async Task <CustomerChatDto> AddCustomer(string name, string email, string password)

        {

            var newCustomer = _mapper.Map<Customer>(new CustomerRegisterDto
            {
                NameCust = name,
                EmailCust = email,
                PasswordCust = password,
            });
            newCustomer.StatusCust = true; // ברירת מחדל
            newCustomer.IsOnline = false; // ברירת מחדל
            newCustomer.Role = "Customer";
            var saveCustomer =await _repository.AddItem(newCustomer);
           return _mapper.Map<CustomerChatDto>(saveCustomer);
        }

        public async Task UpdateCustomer(int id, string name, string email, string PasswordCust)
        {
            var existing = await _repository.GetById(id);
            if (existing != null)
            {
                existing.NameCust = name;
                existing.EmailCust = email;
                existing.PasswordCust = PasswordCust;
               await _repository.UpdateItem(id, existing);
            }
        }

        public async Task DeleteCustomer(int id)
        {
            var customer = await _repository.GetById(id);
            if (customer != null)
            {
                customer.StatusCust = false;
                await _repository.UpdateItem(id, customer);
            }
            // _repository.DeleteItem(id);
        }

        public async Task<CustomerChatDto> Login(CustomerLoginDto customerLoginDto)
        {
            // שליפת כל הלקוחות מה-Repository
            var customer = (await _repository.GetAll())
                .FirstOrDefault(c => c.EmailCust == customerLoginDto.EmailCust && c.PasswordCust == customerLoginDto.PasswordCust);

            // אם לא נמצא לקוח מתאים
            if (customer == null) return null;
            customer.IsOnline = true; // סימון הלקוח כפעיל כרגע במערכת
               await _repository.UpdateItem(customer.IDCustomer, customer);

            var customerDto = _mapper.Map<CustomerChatDto>(customer);
            customerDto.Token = _tokenService.GenerateTokenForCustomer(customer);
            return customerDto;

        }
        public async Task <CustomerChatDto> Register(CustomerRegisterDto registerDto)
        {
            // 1. בדיקה אם האימייל כבר תפוס
            var existingCustomer =(await _repository.GetAll())
                .FirstOrDefault(c => c.EmailCust == registerDto.EmailCust);

            if (existingCustomer != null)
            {
                throw new Exception("משתמש עם אימייל זה כבר קיים במערכת");
            }

            var newCustomer = _mapper.Map<Customer>(registerDto);
            // 2. יצירת ישות לקוח חדשה מה-DTO
            newCustomer.StatusCust = true;
            newCustomer.IsOnline = true;
            newCustomer.Role = "Customer";

            // 3. שמירה בבסיס הנתונים
            var savedCustomer =await _repository.AddItem(newCustomer);
            var resultDto = _mapper.Map<CustomerChatDto>(savedCustomer);
            resultDto.Token = _tokenService.GenerateTokenForCustomer(savedCustomer);
            // 4. יצירת DTO והוספת טוקן
            return resultDto;
        }
        public async Task Logout(int id)
        {
            var customer = await _repository.GetById(id);
            if (customer != null)
            {
                // סימון הלקוח כלא פעיל כרגע במערכת
                customer.IsOnline = false;
               await _repository.UpdateItem(id, customer);
            }
        }
    }
}