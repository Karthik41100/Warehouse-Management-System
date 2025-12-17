using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Domain.Entities;

namespace WarehouseSystem.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProducts(int pageNumber, int pageSize, string? searchTerm);
        Task<Product> AddProduct(ProductDto productDto);
        Task<Product?> GetProductById(int id);
        Task UpdateProduct(int id, ProductDto productDto);
        Task DeleteProduct(int id);
    }
}
