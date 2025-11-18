using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MonthlyPremiumCalculatorAPI.Models;

namespace MonthlyPremiumCalculatorAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PremiumController : ControllerBase
    {
        private static readonly Dictionary<string, string> OccupationToRating = new()
        {
            { "Cleaner", "Light Manual" },
            { "Doctor", "Professional" },
            { "Author", "White Collar" },
            { "Farmer", "Heavy Manual" },
            { "Mechanic", "Heavy Manual" },
            { "Florist", "Light Manual" },
            { "Other", "Heavy Manual" }
        };


        private static readonly Dictionary<string, decimal> RatingToFactor = new()
        {
            { "Professional", 1.5m },
            { "White Collar", 2.25m },
            { "Light Manual", 11.50m },
            { "Heavy Manual", 31.75m }
        };


        [HttpPost]
        public ActionResult<PremiumResponse> Calculate([FromBody] PremiumRequest req)
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.DateOfBirth)
            || string.IsNullOrWhiteSpace(req.UsualOccupation) || req.AgeNextBirthday <= 0
            || req.DeathSumInsured <= 0)
            {
                return BadRequest("All input fields are mandatory and must be valid.");
            }


            if (!OccupationToRating.TryGetValue(req.UsualOccupation, out var rating))
            {
                rating = "Heavy Manual"; // fallback
            }


            if (!RatingToFactor.TryGetValue(rating, out var factor))
            {
                return BadRequest("Unknown occupation rating factor.");
            }


            // Formula: (Death Cover amount * Occupation Rating Factor * Age) /1000 * 12
            var monthlyPremium = (req.DeathSumInsured * factor * req.AgeNextBirthday) / 1000m * 12m;


            var resp = new PremiumResponse
            {
                MonthlyPremium = Math.Round(monthlyPremium, 2),
                OccupationRating = rating,
                RatingFactor = factor
            };


            return Ok(resp);
        }
    }
}
