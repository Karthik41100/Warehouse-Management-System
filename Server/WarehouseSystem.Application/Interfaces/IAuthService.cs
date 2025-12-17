using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Domain.Entities;

namespace WarehouseSystem.Application.Interfaces
{
    public interface IAuthService
    {
        Task<User> Register(UserDto request);
        Task<LoginResponse> Login(UserDto request);
    }
}
