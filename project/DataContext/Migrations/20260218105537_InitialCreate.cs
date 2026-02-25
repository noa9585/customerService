using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataContext.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    IDCustomers = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameCust = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmailCust = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordCust = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusCust = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.IDCustomers);
                });

            migrationBuilder.CreateTable(
                name: "Representatives",
                columns: table => new
                {
                    IDRepresentative = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameRepr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmailRepr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordRepr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    entryHourRepr = table.Column<TimeOnly>(type: "time", nullable: false),
                    exitHourRepr = table.Column<TimeOnly>(type: "time", nullable: false),
                    StatusRepr = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Representatives", x => x.IDRepresentative);
                });

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    IDTopics = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameTopic = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AverageTreatTime = table.Column<double>(type: "float", nullable: false),
                    priorityTopics = table.Column<int>(type: "int", nullable: false),
                    StatusTopic = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.IDTopics);
                });

            migrationBuilder.CreateTable(
                name: "ChatSessions",
                columns: table => new
                {
                    SessionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartTimestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTimestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChatStatus = table.Column<bool>(type: "bit", nullable: false),
                    IDRepresentative = table.Column<int>(type: "int", nullable: false),
                    RepresentativeIDRepresentative = table.Column<int>(type: "int", nullable: false),
                    IDCustomer = table.Column<int>(type: "int", nullable: false),
                    CustomerIDCustomers = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatSessions", x => x.SessionID);
                    table.ForeignKey(
                        name: "FK_ChatSessions_Customers_CustomerIDCustomers",
                        column: x => x.CustomerIDCustomers,
                        principalTable: "Customers",
                        principalColumn: "IDCustomers",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatSessions_Representatives_RepresentativeIDRepresentative",
                        column: x => x.RepresentativeIDRepresentative,
                        principalTable: "Representatives",
                        principalColumn: "IDRepresentative",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    MessageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IDSend = table.Column<int>(type: "int", nullable: false),
                    MessageType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusMessage = table.Column<bool>(type: "bit", nullable: false),
                    IDRepresentative = table.Column<int>(type: "int", nullable: false),
                    IDCustomer = table.Column<int>(type: "int", nullable: false),
                    ChatSessionSessionID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.MessageID);
                    table.ForeignKey(
                        name: "FK_ChatMessages_ChatSessions_ChatSessionSessionID",
                        column: x => x.ChatSessionSessionID,
                        principalTable: "ChatSessions",
                        principalColumn: "SessionID");
                    table.ForeignKey(
                        name: "FK_ChatMessages_Customers_IDCustomer",
                        column: x => x.IDCustomer,
                        principalTable: "Customers",
                        principalColumn: "IDCustomers",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Representatives_IDRepresentative",
                        column: x => x.IDRepresentative,
                        principalTable: "Representatives",
                        principalColumn: "IDRepresentative",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatSessionSessionID",
                table: "ChatMessages",
                column: "ChatSessionSessionID");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_IDCustomer",
                table: "ChatMessages",
                column: "IDCustomer");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_IDRepresentative",
                table: "ChatMessages",
                column: "IDRepresentative");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_CustomerIDCustomers",
                table: "ChatSessions",
                column: "CustomerIDCustomers");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_RepresentativeIDRepresentative",
                table: "ChatSessions",
                column: "RepresentativeIDRepresentative");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "Topics");

            migrationBuilder.DropTable(
                name: "ChatSessions");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Representatives");
        }
    }
}
