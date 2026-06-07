import os

files = [
    'restaurants.html',
    'experiences.html',
    'plan-my-layover.html',
    'airport-transfers.html',
    'how-it-works.html',
    'contact.html'
]

old = 'class="block text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 text-sm font-medium text-white/95"'
new = 'class="block text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-50 text-sm font-medium"'

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as fp:
            c = fp.read()
        count = c.count(old)
        c = c.replace(old, new)
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(c)
        print(f'Fixed {count} occurrences in: {f}')
    else:
        print(f'Not found: {f}')

print('All done.')
