using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Application.Interfaces;
using WarehouseSystem.Domain.Entities;
using WarehouseSystem.Infrastructure.Data;

namespace WarehouseSystem.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;
        public ProductService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ProductDto>> GetAllProducts(int pageNumber, int pageSize, string?searchTerm)
        {
            var query = _context.Products
                .AsQueryable();

            if(!string.IsNullOrEmpty(searchTerm))
            {
               query = query.Where(p => p.Name.Contains(searchTerm));
            }
            return await query
                .OrderBy(p => p.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    StockQuantity = p.Quantity,
                    CategoryId = p.CategoryId ?? 0,

                    CategoryName = p.Category != null ? p.Category.Name : "Uncategorized"
                })
                .ToListAsync();
        }
        public async Task<Product> AddProduct(ProductDto productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price,
                Quantity = productDto.StockQuantity,
                RowVersion = new byte[0],
                CategoryId = productDto.CategoryId
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<ProductDto?> GetProductById(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    StockQuantity = p.Quantity,

                    CategoryId = p.CategoryId ?? 0,
                    CategoryName = p.Category != null ? p.Category.Name : "Uncategorized"
                })
                .FirstOrDefaultAsync();
        }
        public async Task UpdateProduct(int id, ProductDto productDto)
        {
            var existing = await _context.Products.FindAsync(id);

            if(existing != null)
            {
                existing.Name = productDto.Name;
                existing.Price = productDto.Price;
                existing.Quantity = productDto.StockQuantity;

                await _context.SaveChangesAsync();
            }
        }
        public async Task DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalProducts = await _context.Products.CountAsync();

            var totalValue = await _context.Products.SumAsync(p => p.Price * p.Quantity);

            var lowStock = await _context.Products.CountAsync(p => p.Quantity < 10);

            return new DashboardStatsDto
            {
                TotalProducts = totalProducts,
                TotalInventoryValue = totalValue,
                LowStockCount = lowStock
            };
        }
    }
}
