using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace datadonsbackend.Migrations
{
    /// <inheritdoc />
    public partial class AddedTrips : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GPS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Latitude = table.Column<double>(type: "REAL", nullable: false),
                    Longitude = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GPS", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Trips",
                columns: table => new
                {
                    TripID = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DriverID = table.Column<long>(type: "INTEGER", nullable: false),
                    DateTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    MaxRiders = table.Column<long>(type: "INTEGER", nullable: false),
                    Price = table.Column<double>(type: "REAL", nullable: false),
                    StartPointId = table.Column<int>(type: "INTEGER", nullable: false),
                    EndPointId = table.Column<int>(type: "INTEGER", nullable: false),
                    DetourRange = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.TripID);
                    table.ForeignKey(
                        name: "FK_Trips_GPS_EndPointId",
                        column: x => x.EndPointId,
                        principalTable: "GPS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Trips_GPS_StartPointId",
                        column: x => x.StartPointId,
                        principalTable: "GPS",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Trips_Users_DriverID",
                        column: x => x.DriverID,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TripRiders",
                columns: table => new
                {
                    CurrentRidersId = table.Column<long>(type: "INTEGER", nullable: false),
                    RiddenTripsTripID = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripRiders", x => new { x.CurrentRidersId, x.RiddenTripsTripID });
                    table.ForeignKey(
                        name: "FK_TripRiders_Trips_RiddenTripsTripID",
                        column: x => x.RiddenTripsTripID,
                        principalTable: "Trips",
                        principalColumn: "TripID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TripRiders_Users_CurrentRidersId",
                        column: x => x.CurrentRidersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TripRiders_RiddenTripsTripID",
                table: "TripRiders",
                column: "RiddenTripsTripID");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_DriverID",
                table: "Trips",
                column: "DriverID");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_EndPointId",
                table: "Trips",
                column: "EndPointId");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_StartPointId",
                table: "Trips",
                column: "StartPointId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TripRiders");

            migrationBuilder.DropTable(
                name: "Trips");

            migrationBuilder.DropTable(
                name: "GPS");
        }
    }
}
