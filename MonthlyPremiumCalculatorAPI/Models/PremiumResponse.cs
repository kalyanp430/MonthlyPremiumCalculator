namespace MonthlyPremiumCalculatorAPI.Models
{
    public class PremiumResponse
    {
        public decimal MonthlyPremium { get; set; }
        public string OccupationRating { get; set; } = string.Empty;
        public decimal RatingFactor { get; set; }
    }
}
