using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.interfaces
{
    public interface IRepository<T>
    {
        List<T> GetAll();
        T GetById(int id);
        T AddItem(T item);
        void UpdateItem(int id ,T item);
        void DeleteItem(int id);
    }
}
