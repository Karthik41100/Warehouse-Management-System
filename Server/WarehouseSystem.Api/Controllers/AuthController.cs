using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WarehouseSystem.Application.Dto;
using WarehouseSystem.Application.Interfaces;

namespace WarehouseSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto request)
        {
            if(request == null)
            {
                return BadRequest("Invalid Client Request");
            }

            var registeredUser = await _authService.Register(request);

            return Ok(registeredUser);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto request)
        {
            var result = await _authService.Login(request);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }
            return Ok(new
            {
                token = result.Token,
                role = result.Role
            });
        }
    }
}
