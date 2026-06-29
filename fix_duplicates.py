import os

frontend_path = 'C:/Users/Dev Tinker/Desktop/now_next/frontend'

files = [
    "airport-transfers.html",
    "plan-my-layover.html",
    "service-details.html",
    "checkout.html",
    "booking-review.html",
    "booking-confirmation.html",
    "payment-selection.html",
    "my-itinerary.html",
    "my-trips.html",
    "my-profile.html",
    "account-settings.html",
    "notifications.html",
    "saved-itineraries.html",
    "trip-details.html",
    "help-center.html",
    "faq.html",
    "contact.html",
    "how-it-works.html",
    "privacy.html",
    "terms.html",
    "partner-registration.html",
    "supplier-dashboard.html",
    "supplier-status.html",
    "revenue-admin.html"
]

# Fix duplicate <!-- Footer Section --> comment
fix_pattern = '<!-- Footer Section -->\n<!-- Footer Section -->\n  <!-- FOOTER -->'
fix_replacement = '<!-- Footer Section -->\n  <!-- FOOTER -->'

success_count = 0
fail_count = 0
failed_files = []

for file in files:
    filepath = os.path.join(frontend_path, file)
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if fix_pattern in content:
                new_content = content.replace(fix_pattern, fix_replacement)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"FIXED: {file}")
                success_count += 1
            else:
                print(f"INFO: No duplicate found in {file}")
                success_count += 1
        except Exception as e:
            print(f"ERROR: {file} - {e}")
            fail_count += 1
            failed_files.append(file)
    else:
        print(f"ERROR: File not found: {file}")
        fail_count += 1
        failed_files.append(file)

print()
print("=========================")
print(f"Fixed: {success_count}")
print(f"Failed: {fail_count}")
if failed_files:
    print(f"Failed files: {', '.join(failed_files)}")