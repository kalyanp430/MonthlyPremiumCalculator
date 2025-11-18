namespace MonthlyPremiumCalculatorAPI.Models
{
    public class PremiumRequest
    {
        public string Name { get; set; } = string.Empty;
        public int AgeNextBirthday { get; set; }
        // mm/YYYY - allow parsing on server if needed, but we only store as string here
        public string DateOfBirth { get; set; } = string.Empty;
        public string UsualOccupation { get; set; } = string.Empty; // e.g. "Doctor"
        public decimal DeathSumInsured { get; set; }
    }
}
