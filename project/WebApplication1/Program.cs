using DataContext;
using Service1.Interface;
using Service1.Services;
using Repository.interfaces;
using Repository.Entities;
using Repository.Repositories;

var builder = WebApplication.CreateBuilder(args);

// --- 1. הוספת שירותים למערכת (Services) ---

builder.Services.AddControllers();

// רישום ה-DbContext לחיבור למסד הנתונים
builder.Services.AddDbContext<Database>();
builder.Services.AddScoped<IContext, Database>();

// --- רישום Topic ---
builder.Services.AddScoped<IRepository<Topic>, TopicRepository>();
builder.Services.AddScoped<ITopicService, TopicService>();

// --- רישום Customer ---
builder.Services.AddScoped<IRepository<Customer>, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

// --- רישום Representative ---
builder.Services.AddScoped<IRepository<Representative>, RepresentativeRepository>();
builder.Services.AddScoped<IRepresentativeService, RepresentativeService>();

// --- רישום ChatSession ---
// חשוב: הרישומים האלו מאפשרים ל-Service לקבל את ה-Repositories בבנאי (Constructor)
builder.Services.AddScoped<IRepository<ChatSession>, ChatSessionRepository>();
builder.Services.AddScoped<IChatSessionService, ChatSessionService>();

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