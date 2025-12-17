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
    public class ProductServiceTest
    {
        private AppDbContext _context;
        private ProductService _service;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            _service = new ProductService(_context);
        }
        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }
        [Test]
        public async Task AddProduct_Should_Save_Product_To_Database()
        {
            var productDto = new ProductDto
            {
                Name = "Laptop",
                Price = 2000,
                StockQuantity = 5
            };

            var result = await _service.AddProduct(productDto);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo("Laptop"));
            Assert.That(result.Id, Is.GreaterThan(0));

            var count = await _context.Products.CountAsync();
            Assert.That(count, Is.EqualTo(1));
        }
    }
}
