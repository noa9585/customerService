using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using Repository.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataContext
{
    public class Database : DbContext, IContext
    {
        public DbSet<ChatMessage> ChatMessages { get; set; }

        public DbSet<ChatSession> ChatSessions { get; set; }

        public DbSet<Representative> Representatives { get; set; }

        public DbSet<Customer> Customers { get; set; }


        public DbSet<Topic> Topics { get; set; }

        public void save()
        {
           SaveChanges();   
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=SQL;Database=DBCustomerService1;Trusted_Connection=True;TrustServerCertificate=True");
        }
    }
}
