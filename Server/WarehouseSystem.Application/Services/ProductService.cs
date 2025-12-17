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
        public async Task<IEnumerable<Product>> GetAllProducts(int pageNumber, int pageSize, string?searchTerm)
        {
            var query = _context.Products.AsQueryable();

            if(!string.IsNullOrEmpty(searchTerm))
            {
                query.Where(p => p.Name.Contains(searchTerm));
            }
            return await query
                .OrderBy(p => p.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        public async Task<Product> AddProduct(ProductDto productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price,
                Quantity = productDto.StockQuantity,
                RowVersion = new byte[0]
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> GetProductById(int id)
        {
            return await _context.Products.FindAsync(id);
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
    }
}
