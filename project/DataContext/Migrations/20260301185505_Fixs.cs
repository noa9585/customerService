using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataContext.Migrations
{
    /// <inheritdoc />
    public partial class Fixs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Customers_CustomerIDCustomers",
                table: "ChatSessions");

            migrationBuilder.RenameColumn(
                name: "IDCustomers",
                table: "Customers",
                newName: "IDCustomer");

            migrationBuilder.RenameColumn(
                name: "CustomerIDCustomers",
                table: "ChatSessions",
                newName: "CustomerIDCustomer");

            migrationBuilder.RenameIndex(
                name: "IX_ChatSessions_CustomerIDCustomers",
                table: "ChatSessions",
                newName: "IX_ChatSessions_CustomerIDCustomer");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Customers_CustomerIDCustomer",
                table: "ChatSessions",
                column: "CustomerIDCustomer",
                principalTable: "Customers",
                principalColumn: "IDCustomer",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Customers_CustomerIDCustomer",
                table: "ChatSessions");

            migrationBuilder.RenameColumn(
                name: "IDCustomer",
                table: "Customers",
                newName: "IDCustomers");

            migrationBuilder.RenameColumn(
                name: "CustomerIDCustomer",
                table: "ChatSessions",
                newName: "CustomerIDCustomers");

            migrationBuilder.RenameIndex(
                name: "IX_ChatSessions_CustomerIDCustomer",
                table: "ChatSessions",
                newName: "IX_ChatSessions_CustomerIDCustomers");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Customers_CustomerIDCustomers",
                table: "ChatSessions",
                column: "CustomerIDCustomers",
                principalTable: "Customers",
                principalColumn: "IDCustomers",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
