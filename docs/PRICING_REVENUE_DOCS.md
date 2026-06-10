# LayoverX Enterprise Pricing & Revenue Management System
## Developer Documentation

This document explains the technical architecture, logic, schemas, and workflows for the Centralized Pricing Engine and Revenue Management System integrated within the LayoverX Transit Marketplace.

---

## 1. Centralized Pricing Engine Logic

All calculations are encapsulated in `window.layoverx.calculateItineraryPrice(itinerary, options)` located in [app.js](file:///c:/Users/Dev%2520Tinker/Desktop/next_layoverx_1/frontend/js/app.js).

### The Pricing Multiplier Equation
For each item in the transit traveler's itinerary:

$$\text{Final Item Price} = (\text{Base Price} \times \text{Duration Scale}) \times S \times W \times D \times O \times (1 + M_{\%}) + M_{\text{flat}}$$

Where:
1. **Base Price**: Extracted from admin base pricing configs (`layoverx_base_prices`).
2. **Duration Scale**: Duration-based scaling factors (e.g. Hotel 3h is $0.70\times$ unit base, 12h is $1.50\times$, 24h is $2.20\times$).
3. **S (Seasonal Multiplier)**: Mapped to calendar dates (`layoverx_seasonal_pricing`). E.g. Winter Peak (Oct 1 - Feb 28) = $1.25\times$, Monsoon Low (Jul 1 - Sep 30) = $0.85\times$, Summer = $1.00\times$.
4. **W (Weekend Multiplier)**: Fri-Sun surcharge. Default is $1.10\times$.
5. **D (Demand / Yield Multiplier)**: Automated occupancy triggers:
   * Occupancy $\ge 80\% \implies 1.20\times$ multiplier.
   * Occupancy $\le 30\% \implies 0.90\times$ multiplier.
6. **O (Manual Override)**: Configurable slider markup/markdown value. E.g. $+15\% \implies 1.15\times$.
7. **$M_{\%}$ & $M_{\text{flat}}$ (Global Markups)**: Platform general markup percentage and flat additions.

---

## 2. Offer & Discount Stacking Priority

System discounts are evaluated in the following sequence:
1. **Group Booking Discount**: $15\%$ discount applied if guest count $P \ge 3$.
2. **Long-Stay Discount**: $10\%$ discount applied if layover duration $H > 8\text{ hours}$.
3. **Loyalty Membership Discount**: $5\%$ member discount applied if user is logged in.
4. **Promo Coupons**: Evaluated by **Priority Order** (`1` being highest).
   * **Stackable Coupons**: Appended on top of system discounts (e.g. `WELCOME10`).
   * **Non-Stackable Coupons**: Overrides other system discounts if coupon discount value is higher than combined accumulated discounts (e.g. `FLASH30`).
   
### Discount Ceiling
A strict safety margin ceiling of **$35\%$ maximum discount** is enforced at the subtotal level to protect unit economics and gross margins.

---

## 3. Revenue Model & Calculations

Net revenue collected by the platform is calculated as:

$$\text{Net Revenue} = \text{Convenience Fee} + \text{Service Fee} + \text{Insurance Protection Margin} + \text{Vendor Commission}$$

Where:
* **Convenience Fee**: Fixed flat charge of ₹150 per transaction.
* **Service Fee**: $2\%$ platform service fee applied on the post-discount subtotal.
* **Insurance Protection Premium**: ₹199 per traveler for delay safety net.
* **Vendor Commission**: Calculated per category at payout calculation time based on the following commission structures:
  * Transit Hotel Booking: $15\%$
  * Dining / Airport Lounges: $12\%$
  * Excursions & Local Tours: $18\%$
  * Spa / Wellness Centres: $15\%$
  * VR Gaming Zones: $10\%$
  * Airport Transfers (Taxis): $10\%$
* **Taxes (GST)**: $18\%$ Goods and Services Tax applied strictly to the platform fees (Convenience Charge + Service Fee).

---

## 4. Local Storage & Database Schema Design

The following tables are implemented and synchronized within both Firestore and `localStorage` state ledgers:

### `pricing_rules` (`layoverx_base_prices`)
Stores default base prices for room slots, packages, and vehicles:
```json
{
  "hotel": { "1": 3499, "2": 5499, "3": 2200, "4": 4500 },
  "dining": { "1": 1800, "2": 4500, "3": 800, "4": 400 },
  "transfer": { "sedan": 899, "suv": 1499, "luxury": 3499 }
}
```

### `seasonal_pricing` (`layoverx_seasonal_pricing`)
```json
[
  { "name": "Winter Peak", "start": "10-01", "end": "02-28", "multiplier": 1.25 },
  { "name": "Monsoon Low", "start": "07-01", "end": "09-30", "multiplier": 0.85 }
]
```

### `demand_pricing` (`layoverx_demand_settings`)
```json
{
  "simulatedOccupancy": 78,
  "highOccupancyThreshold": 80,
  "highOccupancyMultiplier": 1.20,
  "lowOccupancyThreshold": 30,
  "lowOccupancyMultiplier": 0.90,
  "autoDemandIncrease": true
}
```

### `coupons` / `promotions` (`layoverx_coupons`)
```json
[
  { "code": "WELCOME10", "discountType": "percent", "value": 10, "priority": 1, "stackable": true }
]
```

### `revenue_transactions` (`layoverx_revenue_transactions`)
Ledger of completed checkout transactions with breakdowns:
```json
[
  {
    "bookingId": "LX-89104-CSMIA",
    "createdAt": "2026-06-10T08:00:00Z",
    "passenger": "Lead Passenger",
    "subtotal": 10298.0,
    "totalDiscount": 1544.7,
    "convenienceFee": 150.0,
    "serviceFee": 175.07,
    "taxes": 58.51,
    "insurancePremium": 398.0,
    "grandTotal": 9534.88,
    "appliedCoupon": "WELCOME10",
    "items": [
      { "type": "hotel", "name": "Transit Cabin (BOM)", "finalTotalCost": 7499.0, "vendorId": "v_hotel_1" }
    ]
  }
]
```

### `vendor_payouts` (`layoverx_vendor_payouts`)
Payout obligations showing platform fee subtraction:
```json
[
  {
    "payoutId": "PO-82910",
    "bookingId": "LX-72301-CSMIA",
    "vendorId": "v_hotel_2",
    "itemName": "Niranta Airport Hotel",
    "amount": 4674.15,
    "commissionAmount": 824.85,
    "ratePercent": 15,
    "status": "Pending",
    "datePaid": null
  }
]
```

---

## 5. Admin Workflows

1. **Adjust Overrides**: Set a global override slider value on the dashboard. This instantly increases/decreases unit pricing on search/checkout flows.
2. **Review Ledger & Payouts**: Audits bookings, checks convenience fees vs. commissions, and marks vendor invoices as "Paid" to log disbursement transfers.
3. **Compile Financial Reports**: Instantly parses transaction records to compile a CA-format audit file for external business projections.

---

## 6. Future Scalability Plans

* **Redis Caching**: Cache dynamic pricing lookups on backend servers rather than client-side, using geographic clusters (e.g. AWS ElastiCache) for sub-10ms response times.
* **Machine Learning Dynamic Pricing (AI Yield)**: Deploy predictive model pipelines that train on historical hotel bookings, flight schedules, holiday patterns, and local rain seasons to dynamically update multipliers automatically.
* **Multi-Currency Converters**: Integrate live forex rate feeds to allow billing in USD, EUR, GBP while doing vendor payouts in INR natively.
