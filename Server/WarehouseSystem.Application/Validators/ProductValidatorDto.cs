using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WarehouseSystem.Application.Dto;

namespace WarehouseSystem.Application.Validators
{
    public class ProductValidatorDto : AbstractValidator<ProductDto>
    {
        public ProductValidatorDto()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product Name is required")
                .Length(2, 50).WithMessage("Name should be between 2 and 50 Characters");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price should be greater than 0");

            RuleFor(x => x.StockQuantity)
                .GreaterThan(0).WithMessage("Stock can't be negative");
        }
    }
}
