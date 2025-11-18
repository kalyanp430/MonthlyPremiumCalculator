import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  PremiumService,
  PremiumRequest,
  PremiumResponse,
} from '../premium.service';

@Component({
  selector: 'app-premium-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './premium-calculator.component.html',
  styleUrls: ['./premium-calculator.component.css'],
})
export class PremiumCalculatorComponent implements OnInit {
  form!: FormGroup;
  occupations = [
    'Cleaner',
    'Doctor',
    'Author',
    'Farmer',
    'Mechanic',
    'Florist',
    'Other',
  ];

  // For quick client-side mapping (same as server)
  occupationToRating: Record<string, string> = {
    Cleaner: 'Light Manual',
    Doctor: 'Professional',
    Author: 'White Collar',
    Farmer: 'Heavy Manual',
    Mechanic: 'Heavy Manual',
    Florist: 'Light Manual',
    Other: 'Heavy Manual',
  };

  ratingToFactor: Record<string, number> = {
    Professional: 1.5,
    'White Collar': 2.25,
    'Light Manual': 11.5,
    'Heavy Manual': 31.75,
  };

  calculatedMonthly?: number;
  apiResult?: PremiumResponse;
  apiError?: string;

  constructor(private fb: FormBuilder, private svc: PremiumService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      ageNextBirthday: [null, [Validators.required, Validators.min(1)]],
      dateOfBirth: [
        '',
        [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/\\d{4}$')],
      ],
      usualOccupation: ['', Validators.required],
      deathSumInsured: [null, [Validators.required, Validators.min(1)]],
    });

    // When occupation changes, and all fields are filled, recalculate immediately
    this.form.get('usualOccupation')!.valueChanges.subscribe(() => {
      this.tryCalculate();
    });

    // Optional: recompute when any field that affects result changes
    this.form.valueChanges.subscribe(() => {
      // keep immediate feedback but do not spam server. We'll do client-side calc.
      this.tryCalculate(true);
    });
  }
  private tryCalculate(clientOnly: boolean = false) {
    if (this.form.invalid) {
      this.calculatedMonthly = undefined;
      this.apiResult = undefined;
      this.apiError = undefined;
      return;
    }

    const vals = this.form.value;
    // Client-side calculation using same formula
    const rating =
      this.occupationToRating[vals.usualOccupation] || 'Heavy Manual';
    const factor = this.ratingToFactor[rating];
    const monthly =
      ((vals.deathSumInsured * factor * vals.ageNextBirthday) / 1000) * 12;
    this.calculatedMonthly = Math.round(monthly * 100) / 100;

    if (!clientOnly) {
      // Call API to double-check and get canonical response
      const req: PremiumRequest = {
        name: vals.name,
        ageNextBirthday: vals.ageNextBirthday,
        dateOfBirth: vals.dateOfBirth,
        usualOccupation: vals.usualOccupation,
        deathSumInsured: vals.deathSumInsured,
      };

      this.svc.calculate(req).subscribe({
        next: (res) => {
          this.apiResult = res;
          this.apiError = undefined;
        },
        error: (err) => {
          this.apiResult = undefined;
          this.apiError = err?.error || err?.message || 'API error';
        },
      });
    }
  }

  onSubmit() {
    // final submit — ensure calculation is up to date
    if (this.form.invalid) return;
    this.tryCalculate(false);
  }
}
