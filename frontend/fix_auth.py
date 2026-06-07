import re

# Read current index.html
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Add auth buttons to desktop nav
old = '<a href="#search" class="px-5 py-2.5 bg-white text-sky-600 font-semibold rounded-xl hover:bg-white/90 text-sm shadow-lg">Plan My Layover</a>'
new = old + '\n<a href="#" class="auth-btn text-white/90 hover:text-white text-sm font-medium" onclick="openAuthModal(\'login\');return false;">Login</a>\n<a href="#" class="auth-btn ml-2 px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-xl hover:bg-sky-600" onclick="openAuthModal(\'signup\');return false;">Sign Up</a>'
content = content.replace(old, new, 1)

# Fix 2: Add auth buttons to mobile menu
old2 = '<a href="#search" class="mt-2 block w-full text-center py-3 bg-sky-500 text-white font-semibold rounded-xl">Plan My Layover</a>'
new2 = old2 + '\n<a href="#" class="mt-2 block text-center py-3 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50" onclick="openAuthModal(\'login\');return false;">Login</a>\n<a href="#" class="mt-2 block text-center py-3 bg-sky-500 text-white text-sm font-semibold rounded-xl hover:bg-sky-600" onclick="openAuthModal(\'signup\');return false;">Sign Up</a>'
content = content.replace(old2, new2, 1)

print('Auth buttons added')
with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
