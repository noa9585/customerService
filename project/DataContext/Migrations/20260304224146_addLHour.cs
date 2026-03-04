using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataContext.Migrations
{
    /// <inheritdoc />
    public partial class addLHour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkTime",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    entryHourRepr = table.Column<TimeOnly>(type: "time", nullable: false),
                    exitHourRepr = table.Column<TimeOnly>(type: "time", nullable: false),
                    WorkDate = table.Column<DateOnly>(type: "date", nullable: false),
                    RepresentativeIDRepresentative = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkTime", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkTime_Representatives_RepresentativeIDRepresentative",
                        column: x => x.RepresentativeIDRepresentative,
                        principalTable: "Representatives",
                        principalColumn: "IDRepresentative");
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkTime_RepresentativeIDRepresentative",
                table: "WorkTime",
                column: "RepresentativeIDRepresentative");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkTime");
        }
    }
}
