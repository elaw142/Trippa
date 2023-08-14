using Microsoft.EntityFrameworkCore;
using Models;

namespace Data{
    public class DonsDbContext : DbContext
    {
        public DonsDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Preference> Preferences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder){
            // User - IncomingReviews (one-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.IncomingReviews)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - OutgoingReviews (one-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.OutgoingReviews)
                .WithOne()
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.Cascade); 

            // User - Preferences (one-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Preferences)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Driver (one-to-one)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Driver)
                .WithOne(d => d.User)
                .HasForeignKey<Driver>(d => d.UserId)
                .IsRequired(false) // Optional: User is not required to have a driver
                .OnDelete(DeleteBehavior.Cascade); 

            // Driver - Cars (one-to-many)
            modelBuilder.Entity<Driver>()
                .HasMany(d => d.Cars)
                .WithOne(c => c.Driver)
                .HasForeignKey(c => c.DriverId)
                .OnDelete(DeleteBehavior.Cascade);

            // Car - Make (enum as string)
            modelBuilder.Entity<Car>()
                .Property(c => c.Make)
                .HasConversion<string>();

            // Review - User (many-to-one)
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.IncomingReviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade); 

            // Review - Reviewer (many-to-one)
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Reviewer)
                .WithMany()
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.Cascade); 

            // Preference - User (many-to-one)
            modelBuilder.Entity<Preference>()
                .HasOne(p => p.User)
                .WithMany(u => u.Preferences)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade); 

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Configure your database connection here
            // optionsBuilder.UseSqlServer("YourConnectionString");
            optionsBuilder.UseSqlite("Data Source=DonsDb.sqlite");
            base.OnConfiguring(optionsBuilder);
        }
    }
}
