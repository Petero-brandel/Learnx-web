import re

files_to_clean = [
    'components/sections/CoursePreview.tsx',
    'components/sections/Testimonials.tsx',
    'components/sections/Footer.tsx',
    'components/sections/CTA.tsx'
]

# Regex to match ' dark:xxx' or 'dark:xxx'
pattern = re.compile(r'\s*dark:[a-zA-Z0-9\-\/\[\]#]+')

for file_path in files_to_clean:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # In CTA, there's one specific dark class: `dark:bg-[#181818]` which we want to change to `bg-zinc-50/50` or `bg-transparent`.
    # Actually, `bg-transparent dark:bg-[#181818]` -> `bg-transparent` (or maybe `bg-zinc-50/50` to maintain light mode contrast).
    # Let's just strip dark classes.
    
    new_content = pattern.sub('', content)
    
    with open(file_path, 'w') as f:
        f.write(new_content)

print("Done stripping dark classes.")
