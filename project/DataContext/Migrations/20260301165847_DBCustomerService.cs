using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataContext.Migrations
{
    /// <inheritdoc />
    public partial class DBCustomerService : Migration
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
                    ScoreForMonth = table.Column<int>(type: "int", nullable: false),
                    entryHourRepr = table.Column<TimeOnly>(type: "time", nullable: false),
                    exitHourRepr = table.Column<TimeOnly>(type: "time", nullable: false),
                    StatusRepr = table.Column<bool>(type: "bit", nullable: false),
                    IsOnline = table.Column<bool>(type: "bit", nullable: false),
                    IsBusy = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Representatives", x => x.IDRepresentative);
                });

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    IDTopic = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameTopic = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AverageTreatTime = table.Column<double>(type: "float", nullable: false),
                    priorityTopics = table.Column<int>(type: "int", nullable: false),
                    StatusTopic = table.Column<bool>(type: "bit", nullable: false),
                    totalSessionsCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.IDTopic);
                });

            migrationBuilder.CreateTable(
                name: "ChatSessions",
                columns: table => new
                {
                    SessionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartTimestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ServiceStartTimestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTimestamp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    statusChat = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<bool>(type: "bit", nullable: false),
                    IDRepresentative = table.Column<int>(type: "int", nullable: true),
                    RepresentativeIDRepresentative = table.Column<int>(type: "int", nullable: false),
                    IDCustomer = table.Column<int>(type: "int", nullable: false),
                    CustomerIDCustomers = table.Column<int>(type: "int", nullable: false),
                    IDTopic = table.Column<int>(type: "int", nullable: false),
                    TopicIDTopic = table.Column<int>(type: "int", nullable: false)
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
                    table.ForeignKey(
                        name: "FK_ChatSessions_Topics_TopicIDTopic",
                        column: x => x.TopicIDTopic,
                        principalTable: "Topics",
                        principalColumn: "IDTopic",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    MessageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IDSession = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IDSend = table.Column<int>(type: "int", nullable: false),
                    MessageType = table.Column<int>(type: "int", nullable: false),
                    StatusMessage = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.MessageID);
                    table.ForeignKey(
                        name: "FK_ChatMessages_ChatSessions_IDSession",
                        column: x => x.IDSession,
                        principalTable: "ChatSessions",
                        principalColumn: "SessionID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_IDSession",
                table: "ChatMessages",
                column: "IDSession");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_CustomerIDCustomers",
                table: "ChatSessions",
                column: "CustomerIDCustomers");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_RepresentativeIDRepresentative",
                table: "ChatSessions",
                column: "RepresentativeIDRepresentative");

            migrationBuilder.CreateIndex(
                name: "IX_ChatSessions_TopicIDTopic",
                table: "ChatSessions",
                column: "TopicIDTopic");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "ChatSessions");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Representatives");

            migrationBuilder.DropTable(
                name: "Topics");
        }
    }
}
