using Models;
using Data;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddScoped<DonsDbContext>(provider =>
        {
            var optionsBuilder = new DbContextOptionsBuilder<DonsDbContext>()
                .UseInMemoryDatabase("Data Source=village.db");
            return new DonsDbContext(optionsBuilder.Options);
        });

        // TODO: convert to local sqllite db... 
        // builder.Services.AddDbContext<DonsDbContext>(options => options.UseSqlite(builder.Configuration["WebAPIConnection"]));





        var app = builder.Build();


        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            Console.WriteLine("\n\n\n\nDevelopment environment is up and running!\n\n\n");
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}