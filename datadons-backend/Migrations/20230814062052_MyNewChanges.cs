using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace datadonsbackend.Migrations
{
    /// <inheritdoc />
    public partial class MyNewChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Drivers_driverId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_driverId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "driverId",
                table: "Users");

            migrationBuilder.AddColumn<long>(
                name: "UserId1",
                table: "Reviews",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "Drivers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<string>(
                name: "Make",
                table: "Cars",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId1",
                table: "Reviews",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_Drivers_UserId",
                table: "Drivers",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Drivers_Users_UserId",
                table: "Drivers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Users_UserId1",
                table: "Reviews",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Drivers_Users_UserId",
                table: "Drivers");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_UserId1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Drivers_UserId",
                table: "Drivers");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Drivers");

            migrationBuilder.AddColumn<long>(
                name: "driverId",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Make",
                table: "Cars",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.CreateIndex(
                name: "IX_Users_driverId",
                table: "Users",
                column: "driverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Drivers_driverId",
                table: "Users",
                column: "driverId",
                principalTable: "Drivers",
                principalColumn: "Id");
        }
    }
}
