using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnergyMonitor.Api.Migrations
{
    /// <inheritdoc />
    public partial class CreateEnergyMonitorDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Aparelhos",
                columns: table => new
                {
                    AparelhoId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Tipo = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    ConsumoMedioWatts = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aparelhos", x => x.AparelhoId);
                });

            migrationBuilder.CreateTable(
                name: "Leituras",
                columns: table => new
                {
                    LeituraId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AparelhoId = table.Column<int>(type: "INTEGER", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ConsumoAtualWatts = table.Column<decimal>(type: "TEXT", nullable: false),
                    TensaoVolts = table.Column<decimal>(type: "TEXT", nullable: false),
                    CorrenteAmperes = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leituras", x => x.LeituraId);
                    table.ForeignKey(
                        name: "FK_Leituras_Aparelhos_AparelhoId",
                        column: x => x.AparelhoId,
                        principalTable: "Aparelhos",
                        principalColumn: "AparelhoId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Leituras_AparelhoId",
                table: "Leituras",
                column: "AparelhoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Leituras");

            migrationBuilder.DropTable(
                name: "Aparelhos");
        }
    }
}
