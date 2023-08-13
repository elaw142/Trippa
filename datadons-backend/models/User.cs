using System.ComponentModel.DataAnnotations;

namespace Models{
    public class User{
        [Key]
        public long Id { get; set; }
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Password { get; set; }
        public string? Email { get; set; }
        [Required]
        public long? Phone { get; set; }
        public string? Address { get; set; }

        // TODO: Add avatar functionally
        // public string? Avatar { get; set; }
        public Preference[]? Preferences { get; set; }

        public Review[]? OutgoingReviews { get; set; }
        public Review[]? IncomingReviews { get; set; }


        public Driver? driver { get; set; }

    }
    public class Driver{
        [Key]
        public long Id { get; set; }
        [Required]
        public required string LicenseNumber { get; set; }
        // TODO: Add license image
        // public string? LicenseImage { get; set; }
        [Required]
        public required Car[] Cars { get; set; }
    }

    public class Car{
        [Key]
        public long Id { get; set; }
        [Required]
        public Driver Driver { get; set; }
        [Required]
        public required Make Make { get; set; }
        [Required]
        public required CarType Type { get; set; }
        [Required]
        public required string Model { get; set; }
        [Required]
        public required string Color { get; set; }
        [Required]
        public required string LicensePlate { get; set; }
    }

    public enum CarType{
        sedan,
        coupe,
        hatchback,
        convertible,
        suv,
        truck,
        van,
        wagon,
        other
    }

    public enum Make {
        mazda,
        toyota,
        honda,
        ford,
        chevrolet,
        nissan,
        hyundai,
        kia,
        dodge,
        jeep,
        subaru,
        bmw,
        mercedes,
        audi,
        volkswagen,
        lexus,
        other
    }

    public class Review{
        [Key]
        public long Id { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public User Reviewer { get; set; }
        public string? ReviewText { get; set; }
        public int? Rating { get; set; }
    }

    public class Preference{

        [Key]
        public long Id { get; set; }
        // TODO: can make enum for certain preferences
        [Required]
        public required Category category { get; set; }
        public string? Description { get; set; }
        public User User { get; set; }
    }

    public enum Category{
        // TODO: add more categories
        smoking,
        pets,
        music,
        food,
        drinks,
        chatter,
        other
    }
}