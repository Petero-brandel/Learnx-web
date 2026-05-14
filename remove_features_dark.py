import re

files_to_clean = [
    'components/sections/Features.tsx',
]

pattern = re.compile(r'\s*dark:[a-zA-Z0-9\-\/\[\]#]+')

for file_path in files_to_clean:
    with open(file_path, 'r') as f:
        content = f.read()
        
    new_content = pattern.sub('', content)
    
    with open(file_path, 'w') as f:
        f.write(new_content)
