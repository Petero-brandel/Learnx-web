import os
from PIL import Image

# Configuration
SOURCE_DIR = 'public/images/avatars'
MAX_SIZE = (800, 800) # Max dimensions (width, height)
QUALITY = 85 # JPEG Quality

def compress_images():
    if not os.path.exists(SOURCE_DIR):
        print(f"Directory not found: {SOURCE_DIR}")
        return

    total_saved = 0

    for filename in os.listdir(SOURCE_DIR):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            continue

        filepath = os.path.join(SOURCE_DIR, filename)
        original_size = os.path.getsize(filepath)

        try:
            with Image.open(filepath) as img:
                # Convert RGBA to RGB if saving as JPEG
                if img.mode in ('RGBA', 'P') and filename.lower().endswith(('.jpg', '.jpeg')):
                    img = img.convert('RGB')
                
                # Resize if larger than MAX_SIZE, maintaining aspect ratio
                # This is the biggest factor in reducing a 5MB image without perceptual quality loss on the web
                img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
                
                # Save optimized directly overwriting the file
                if filename.lower().endswith('.png'):
                    img.save(filepath, format='PNG', optimize=True)
                elif filename.lower().endswith('.webp'):
                    img.save(filepath, format='WEBP', quality=QUALITY, method=6)
                else:
                    img.save(filepath, format='JPEG', quality=QUALITY, optimize=True)
            
            new_size = os.path.getsize(filepath)
            saved = original_size - new_size
            
            if saved > 0:
                total_saved += saved
                print(f"Compressed {filename}: {original_size/1024/1024:.2f}MB -> {new_size/1024:.2f}KB")
            else:
                print(f"Skipped {filename}: Already optimal size")

        except Exception as e:
            print(f"Failed to process {filename}: {e}")

    print(f"\nTotal space saved: {total_saved/1024/1024:.2f}MB")

if __name__ == '__main__':
    print("Starting image compression...")
    compress_images()
    print("Done!")
