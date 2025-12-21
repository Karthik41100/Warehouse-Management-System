using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Application.Interfaces;
using WarehouseSystem.Domain.Entities;

namespace WarehouseSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _product;
        private readonly IValidator<ProductDto> _validator;

        public ProductsController(IProductService product, IValidator<ProductDto> validator)
        {
            _product = product;
            _validator = validator;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetProducts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5, [FromQuery] string? searchTerm = null)
        {
             var products = await _product.GetAllProducts(pageNumber, pageSize, searchTerm);

            return Ok(products);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _product.GetProductById(id);

            if (product == null) return NotFound();

            return Ok(product);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddProducts(ProductDto productDto)
        {
            var validationResult = await _validator.ValidateAsync(productDto);

            if(!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var newProducts = await _product.AddProduct(productDto);
            return Ok(newProducts);
        }
        [HttpPut("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> UpdateProducts(int id, ProductDto productDto)
        {
            var existing = await _product.GetProductById(id);

            if (existing == null) return NotFound();

            await _product.UpdateProduct(id, productDto);

            return NoContent();
        }
        [HttpDelete("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> DeleteProducts(int id)
        {
            var product = await _product.GetProductById(id);
            if (product == null) return NotFound();
            await _product.DeleteProduct(id);
            return NoContent();
        }
        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var stats = await _product.GetDashboardStatsAsync();
            return Ok(stats);
        }
    }
}
