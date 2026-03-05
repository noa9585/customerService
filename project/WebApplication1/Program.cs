using DataContext;
using Repository.Entities;
using Repository.interfaces;
using Repository.Repositories;
using Service1.Interface;
using Service1.Logic;
using Service1.Services;
using WebApplication1.BackgroundServices;

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

builder.Services.AddScoped<IRepository<ChatMessage>, ChatMessageRepository>();
// רישום ה-Service - מקשר בין ה-Interface למימוש הלוגיקה
builder.Services.AddScoped<IChatMessageService, ChatMessageService>();


// רישום ה-Repository - מקשר בין ה-Interface למימוש שלו
// --- רישום Representative ---
builder.Services.AddScoped<IRepository<Representative>, RepresentativeRepository>();
builder.Services.AddScoped<IRepresentativeService, RepresentativeService>();
// --- רישום Representative ---
builder.Services.AddScoped<IRepository<ChatMessage>, ChatMessageRepository>();
builder.Services.AddScoped<IChatMessageService, ChatMessageService>();

// --- רישום ChatSession ---
// חשוב: הרישומים האלו מאפשרים ל-Service לקבל את ה-Repositories בבנאי (Constructor)
builder.Services.AddScoped<IRepository<ChatSession>, ChatSessionRepository>();
builder.Services.AddScoped<IChatSessionService, ChatSessionService>();

// הוספה לפני השורה var app = builder.Build();
builder.Services.AddSingleton<IChatQueueManager, ChatQueueManager>();
builder.Services.AddHostedService<QueueUpdateWorker>();

// הגדרות Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 2. בניית האפליקציה (Build) ---
// --- הגדרת CORS לאישור כניסה מה-React ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174") // כתובות ה-React שלך
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
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