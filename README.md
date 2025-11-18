# Premium Calculator (Angular + .NET)

This project calculates monthly insurance premiums based on Occupation Rating factors and user inputs.

## 📁 Project Structure

```
MonthlyPremiumCalculator/
 ├── MonthlyPremiumCalculatorAPI/        # .NET 8 Web API
 └── MonthlyPremiumCalculator/           # Angular component + service
```

---

## 🧮 Premium Formula

```
Monthly Premium = (Death Cover Amount * Rating Factor * Age) / 1000 * 12
```

---

## 🏢 Occupation → Rating

| Occupation | Rating |
|-----------|---------|
| Cleaner | Light Manual |
| Doctor | Professional |
| Author | White Collar |
| Farmer | Heavy Manual |
| Mechanic | Heavy Manual |
| Florist | Light Manual |
| Other | Heavy Manual |

### Rating → Factor

| Rating | Factor |
|--------|--------|
| Professional | 1.5 |
| White Collar | 2.25 |
| Light Manual | 11.5 |
| Heavy Manual | 31.75 |

---

## 🛠 Backend (.NET 8)

### Endpoint
`POST /api/premium`

### Request Body
```json
{
  "name": "John",
  "ageNextBirthday": 30,
  "dateOfBirth": "01/1995",
  "usualOccupation": "Doctor",
  "deathSumInsured": 500000
}
```

### Response
```json
{
  "monthlyPremium": 27000.00,
  "occupationRating": "Professional",
  "ratingFactor": 1.5
}
```

Ensure API URL in `premium.service.ts` matches your backend.
