using System.Text.Json;

namespace WarehouseSystem.Api.Models
{
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;

        public override string ToString() => JsonSerializer.Serialize(this);
    }
}
