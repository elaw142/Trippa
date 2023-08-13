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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Preferences)
                .WithOne(p => p.User);

            modelBuilder.Entity<User>()
                .HasMany(u => u.OutgoingReviews)
                .WithOne(r => r.User);

            modelBuilder.Entity<User>()
                .HasMany(u => u.IncomingReviews)
                .WithOne(r => r.Reviewer);

            modelBuilder.Entity<Driver>()
                .HasMany(d => d.Cars)
                .WithOne(c => c.Driver);

            modelBuilder.Entity<Preference>()
                .HasOne(p => p.User)
                .WithMany(u => u.Preferences);

            // modelBuilder.Entity<Review>()
            //     .HasOne(r => r.User)
            //     .WithMany(u => u.OutgoingReviews)
            //     .HasForeignKey(r => r.UserId);

            // modelBuilder.Entity<Review>()
            //     .HasOne(r => r.Reviewer)
            //     .WithMany(u => u.IncomingReviews)
            //     .HasForeignKey(r => r.ReviewerId);

            modelBuilder.Entity<Car>()
                .HasOne(c => c.Driver)
                .WithMany(d => d.Cars);


            // Other configurations and relationships can be added here

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Configure your database connection here
            // optionsBuilder.UseSqlServer("YourConnectionString");

            base.OnConfiguring(optionsBuilder);
        }
    }
}
