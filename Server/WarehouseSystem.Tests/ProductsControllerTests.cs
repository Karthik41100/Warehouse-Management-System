using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WarehouseSystem.Api.Controllers;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Application.Interfaces;
using WarehouseSystem.Domain.Entities;

namespace WarehouseSystem.Tests
{
    [TestFixture]
    public class ProductsControllerTests
    {
        private Mock<IProductService> _mockService;
        private Mock<IValidator<ProductDto>> _mockValidator;
        private ProductsController _controller;

        [SetUp]
        public void Setup()
        {
            _mockService = new Mock<IProductService>();
            _mockValidator = new Mock<IValidator<ProductDto>>();

            _controller = new ProductsController(_mockService.Object, _mockValidator.Object);
        }
        [Test]
        public async Task GetProducts_Should_Return_200_With_List()
        {
            _mockService.Setup(s => s.GetAllProducts(1, 10, null))
                .ReturnsAsync(new List<Product>
                {
                    new Product {Name = "PS5", Price = 500}
                });

            var result = await _controller.GetProducts(1, 10);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            var returnedProducts = okResult!.Value as List<Product>;

            Assert.That(returnedProducts!.Count, Is.EqualTo(1));
            Assert.That(returnedProducts[0].Name, Is.EqualTo("PS5"));
        }
    }
}
