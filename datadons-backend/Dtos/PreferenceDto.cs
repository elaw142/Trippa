using Models;

namespace Dtos
{
    public class PreferenceDto
    {
        public long Id { get; set; }
        public Category Category { get; set; }
        public string? Description { get; set; }
        public long DriverId { get; set; }
    }
}
