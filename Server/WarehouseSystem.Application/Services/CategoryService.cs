using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Application.Interfaces;
using WarehouseSystem.Infrastructure.Data;

namespace WarehouseSystem.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;
        public CategoryService(AppDbContext context)
        {
           _context = context;
        }
        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            return await _context.Categories
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                    
                }).
                ToListAsync();
        }
    }
}
