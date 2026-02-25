using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.interfaces
{
    public interface IContext
    {
        public DbSet<ChatMessage> ChatMessages { get; set; }

        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<Representative> Representatives { get; set; }
        public DbSet<Customer> Customers { get; set; }

        public DbSet<Topic> Topics { get; set; }


        public void save();
    }
}
