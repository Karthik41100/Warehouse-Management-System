using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Application.Services;
using WarehouseSystem.Infrastructure.Data;

namespace WarehouseSystem.Tests
{
    [TestFixture]
    public class ProductServiceIntegrationTests
    {
        private AppDbContext _context;
        private ProductService _service;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer("Server=KARTHIKRAJ;Database=WarehouseRealDB;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=True")
                .Options;

            _context = new AppDbContext(options);
            _service = new ProductService(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context?.Dispose();
        }
        [Test]
        public async Task AddProduct_Should_Insert_Row_Into_Real_Sql_Server()
        {
            var newProduct = new ProductDto
            {
                Name = "Integration Test Tv",
                Price = 500,
                StockQuantity = 10
            };

            await _service.AddProduct(newProduct);

            var productInDb = await _context.Products
                .FirstOrDefaultAsync(p => p.Name == "Integration Test TV");

            Assert.That(productInDb, Is.Not.Null, "Product was not found in database!");

            Assert.That(productInDb.Price, Is.EqualTo(500), "Price did not match!");

            if(productInDb != null)
            {
                _context.Products.Remove(productInDb);
                await _context.SaveChangesAsync();
            }
        }
    }
}
