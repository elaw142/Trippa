namespace Dtos{
    public class UserDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required long Phone { get; set; }
    }

    public class DriverDto{
        public required string LicenseNumber { get; set; }
        public required string CarModel { get; set; }
        public required string CarColor { get; set; }
        public required string CarMake { get; set; }
        public required string CarType { get; set; }
        public required string PlateNumber { get; set; }

    }

    public class ReviewDto{
        public long UserId { get; set; }
        public long ReviewerId { get; set; }
        public string ReviewText { get; set; }
        public int Rating { get; set; }
    }
}