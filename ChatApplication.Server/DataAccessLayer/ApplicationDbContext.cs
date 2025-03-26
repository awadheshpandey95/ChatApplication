using ChatApplication.Server.Models.UserDto;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ChatApplication.Server.Models.ChatDto;

namespace ChatApplication.Server.DataAccessLayer
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }


        //Generate DatabaseTable for ApplicationUser.cs
        public DbSet<ApplicationUser> ApplicationUser { get; set; } 

        public DbSet<UserOTP> UserOTP { get; set; }

        public DbSet<ChatMessage> ChatMessage { get; set; }

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);

        //    // Configure relationship between IdentityUser and ApplicationUser
        //    builder.Entity<ApplicationUser>()
        //        .HasOne(a => a.IdentityUser) // Define the relationship
        //        .WithOne() // No navigation properties in IdentityUser
        //        .HasForeignKey<ApplicationUser>(u => u.Email) // Foreign key is Email
        //        .HasPrincipalKey<IdentityUser>(u => u.Email); // Reference key is Email

        //    // Configure unique constraints if necessary
        //    // Ensure Email is unique in both tables
        //    builder.Entity<ApplicationUser>()
        //        .HasIndex(a => a.Email)
        //        .IsUnique();

        //    builder.Entity<IdentityUser>()
        //        .HasIndex(i => i.Email)
        //        .IsUnique();
        //}
    }
}