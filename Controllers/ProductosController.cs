using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventarioAPI.Data;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [Route("productos")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductosController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("inventario")]
        public async Task<IActionResult> GetInventario()
        {
            var productos = await _context.Productos.ToListAsync();
            return Ok(productos);
        }

        [Authorize]
        [HttpPost("movimiento")]
        public async Task<IActionResult> RegistrarMovimiento([FromBody] MovimientoRequest request)
        {
            var producto = await _context.Productos.FindAsync(request.ProductoId);
            if (producto == null) return NotFound(new { mensaje = "Producto no encontrado" });

            if (request.Tipo.ToLower() == "entrada")
            {
                producto.Cantidad += request.Cantidad;
            }
            else if (request.Tipo.ToLower() == "salida")
            {
                if (producto.Cantidad < request.Cantidad)
                    return BadRequest(new { mensaje = "Stock insuficiente" });

                producto.Cantidad -= request.Cantidad;
            }
            else
            {
                return BadRequest(new { mensaje = "Tipo de movimiento inválido (entrada/salida)" });
            }

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Movimiento registrado con éxito", nuevoStock = producto.Cantidad });
        }
    }

    public class MovimientoRequest
    {
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public string Tipo { get; set; } = string.Empty;
    }
}
