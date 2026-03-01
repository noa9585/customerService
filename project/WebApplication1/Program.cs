using DataContext;
using Service1.Interface;
using Service1.Services;
using Repository.interfaces;
using Repository.Entities;
using Repository.Repositories; // וודאי שזה ה-Namespace של ה-TopicRepository שלך

var builder = WebApplication.CreateBuilder(args);

// --- 1. הוספת שירותים למערכת (Services) ---

builder.Services.AddControllers();

// רישום ה-DbContext לחיבור למסד הנתונים
builder.Services.AddDbContext<Database>();
builder.Services.AddScoped<IContext, Database>();

// רישום ה-Repository - מקשר בין ה-Interface למימוש שלו
builder.Services.AddScoped<IRepository<Topic>, TopicRepository>();
// רישום ה-Service - מקשר בין ה-Interface למימוש הלוגיקה
builder.Services.AddScoped<ITopicService, TopicService>();

builder.Services.AddScoped<IRepository<Customer>, CustomerRepository>();
// רישום ה-Service - מקשר בין ה-Interface למימוש הלוגיקה
builder.Services.AddScoped<ICustomerService, CustomerService>();

builder.Services.AddScoped<IRepository<ChatMessage>, ChatMessageRepository>();
// רישום ה-Service - מקשר בין ה-Interface למימוש הלוגיקה
builder.Services.AddScoped<IChatMessageService, ChatMessageService>();


// רישום ה-Repository - מקשר בין ה-Interface למימוש שלו
builder.Services.AddScoped<IRepository<Representative>, RepresentativeRepository>();
// רישום ה-Service - מקשר בין ה-Interface למימוש הלוגיקה
builder.Services.AddScoped<IRepresentativeService, RepresentativeService>();
// הגדרות Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 2. בניית האפליקציה (Build) ---

var app = builder.Build();

// --- 3. הגדרת הצינורות (Pipeline / Middleware) ---

// שימוש ב-Swagger בסביבת פיתוח
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// הרצת השרת
app.Run();