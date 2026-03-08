using Service1.Interface;
using Repository.Entities;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Service1.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(Representative representative)
        {
            return GenerateCommonToken(representative.IDRepresentative.ToString(), representative.EmailRepr, representative.NameRepr, representative.Role);
        }

        public string GenerateTokenForCustomer(Customer customer)
        {
            return GenerateCommonToken(customer.IDCustomer.ToString(), customer.EmailCust, customer.NameCust, "Customer");
        }

        private string GenerateCommonToken(string id, string email, string name, string? role)
        {
            var jwt = _config.GetSection("Jwt");
            var key = jwt["Key"] ?? throw new InvalidOperationException("Jwt:Key missing");
            var issuer = jwt["Issuer"];
            var audience = jwt["Audience"];
            var expireMinutes = int.Parse(jwt["ExpireMinutes"] ?? "60");

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, id),
                new Claim(JwtRegisteredClaimNames.Email, email ?? string.Empty),
                new Claim(ClaimTypes.Name, name ?? string.Empty)
            };

            if (!string.IsNullOrEmpty(role))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}