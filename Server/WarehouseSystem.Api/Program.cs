using FluentValidation;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WarehouseSystem.Api.Middleware;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Application.Interfaces;
using WarehouseSystem.Application.Services;
using WarehouseSystem.Infrastructure.Data;

var builder = WebApplication.CreateBuilder();

// ==============================
// 1. CONFIGURATION (Services)
// ==============================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        );
});

//Add Controllers

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddValidatorsFromAssemblyContaining<ProductDto>();

//Configure Swagger(The UI) to support Jwt Lock Icon

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// D. Configure Database (SQL Server)
// It reads "DefaultConnection" from appsettings.json

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
    b => b.MigrationsAssembly("WarehouseSystem.Infrastructure")));

// E. Dependency Injection (Register your Custom Services)
// "When a Controller asks for IAuthService, give them AuthService"

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

// Configure JWT Token

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
            .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

// ==============================
// 2. MIDDLEWARE PIPELINE (Order Matters!)
// ==============================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        context.Database.Migrate();
    }

    catch (Exception ex)
    {
        logger.LogError(ex, "database failed at startup");
    }
}

//Configure Development Environment

if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Warehouse API V1");
        c.RoutePrefix = string.Empty; // serve swagger at "/"
    });
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

//Enable CORS (Must be before Auth)

app.UseCors("AllowReactApp");

// Turns on security

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();