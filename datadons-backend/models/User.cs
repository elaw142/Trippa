namespace Models{
    public class User{
        public long Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public string? Email { get; set; }
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
        public long Id { get; set; }
        public required string LicenseNumber { get; set; }
        // TODO: Add license image
        // public string? LicenseImage { get; set; }
        public Car[]? Cars { get; set; }
    }

    public class Car{
        public long Id { get; set; }
        public required Make Make { get; set; }

        public required CarType Type { get; set; }

        public required string Model { get; set; }

        public required string Color { get; set; }

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
        public long Id { get; set; }
        public long UserId { get; set; }
        public long ReviewerId { get; set; }
        public string? ReviewText { get; set; }
        public int? Rating { get; set; }
    }

    public class Preference{
        public long Id { get; set; }
        // TODO: can make enum for certain preferences
        public required Category category { get; set; }
        public string? Description { get; set; }
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