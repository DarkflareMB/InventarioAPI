using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventarioAPI.Controllers
{
    [Route("productos")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        /// <summary>
        /// Obtener el inventario actual. Protegido con JWT.
        /// </summary>
        [Authorize]
        [HttpGet("inventario")]
        public IActionResult GetInventario()
        {
            return Ok(new { mensaje = "Este endpoint está protegido. Solo usuarios autenticados pueden verlo." });
        }
    }
}
