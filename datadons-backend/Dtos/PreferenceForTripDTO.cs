using Models;

namespace Dtos
{
    public class PreferenceForTripDTO
    {
        public bool NoPets { get; set; }
        public bool NoLuggage { get; set; }
        public long TripId { get; set; }
    }

}
