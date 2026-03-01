using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataContext.Migrations
{
    /// <inheritdoc />
    public partial class Fixs1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Customers_CustomerIDCustomer",
                table: "ChatSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Representatives_RepresentativeIDRepresentative",
                table: "ChatSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Topics_TopicIDTopic",
                table: "ChatSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChatSessions_CustomerIDCustomer",
                table: "ChatSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChatSessions_RepresentativeIDRepresentative",
                table: "ChatSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChatSessions_TopicIDTopic",
                table: "ChatSessions");

            migrationBuilder.DropColumn(
                name: "CustomerIDCustomer",
                table: "ChatSessions");

            migrationBuilder.DropColumn(
                name: "RepresentativeIDRepresentative",
                table: "ChatSessions");

            migrationBuilder.DropColumn(
                name: "TopicIDTopic",
                table: "ChatSessions");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_IDCustomer",
                table: "ChatSessions",
                column: "IDCustomer");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_IDRepresentative",
                table: "ChatSessions",
                column: "IDRepresentative");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_IDTopic",
                table: "ChatSessions",
                column: "IDTopic");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Customers_IDCustomer",
                table: "ChatSessions",
                column: "IDCustomer",
                principalTable: "Customers",
                principalColumn: "IDCustomer",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Representatives_IDRepresentative",
                table: "ChatSessions",
                column: "IDRepresentative",
                principalTable: "Representatives",
                principalColumn: "IDRepresentative");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Topics_IDTopic",
                table: "ChatSessions",
                column: "IDTopic",
                principalTable: "Topics",
                principalColumn: "IDTopic",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Customers_IDCustomer",
                table: "ChatSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Representatives_IDRepresentative",
                table: "ChatSessions");

            migrationBuilder.DropForeignKey(
                name: "FK_ChatSessions_Topics_IDTopic",
                table: "ChatSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChatSessions_IDCustomer",
                table: "ChatSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChatSessions_IDRepresentative",
                table: "ChatSessions");

            migrationBuilder.DropIndex(
                name: "IX_ChatSessions_IDTopic",
                table: "ChatSessions");

            migrationBuilder.AddColumn<int>(
                name: "CustomerIDCustomer",
                table: "ChatSessions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RepresentativeIDRepresentative",
                table: "ChatSessions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TopicIDTopic",
                table: "ChatSessions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_CustomerIDCustomer",
                table: "ChatSessions",
                column: "CustomerIDCustomer");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_RepresentativeIDRepresentative",
                table: "ChatSessions",
                column: "RepresentativeIDRepresentative");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_TopicIDTopic",
                table: "ChatSessions",
                column: "TopicIDTopic");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Customers_CustomerIDCustomer",
                table: "ChatSessions",
                column: "CustomerIDCustomer",
                principalTable: "Customers",
                principalColumn: "IDCustomer",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Representatives_RepresentativeIDRepresentative",
                table: "ChatSessions",
                column: "RepresentativeIDRepresentative",
                principalTable: "Representatives",
                principalColumn: "IDRepresentative",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ChatSessions_Topics_TopicIDTopic",
                table: "ChatSessions",
                column: "TopicIDTopic",
                principalTable: "Topics",
                principalColumn: "IDTopic",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
