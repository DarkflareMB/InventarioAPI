using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using InventarioAPI.Models;

namespace InventarioAPI.Services
{
    public class AuthService
    {
        private readonly IConfiguration _config;

        // Usuario en memoria (en producción, usar una BD)
        private static readonly User FakeUser = new()
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123")
        };

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        public string? Authenticate(string username, string password)
        {
            if (username != FakeUser.Username || !BCrypt.Net.BCrypt.Verify(password, FakeUser.PasswordHash))
                return null;

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, FakeUser.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
