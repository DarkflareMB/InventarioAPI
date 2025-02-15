using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioAPI.Models
{
    [Table("productos")]
    public class Producto
    {
        [Key]
        [Column("id")] 
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre")] 
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [Column("cantidad")] 
        public int Cantidad { get; set; }
    }
}
