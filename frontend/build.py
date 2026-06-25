import subprocess
import sys
import os

def main():
    print("Executing fallback build.py (delegating to node build.js)...")
    # Determine the directory of this script to run properly
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    
    js_build_path = os.path.join(root_dir, "frontend", "build.js")
    
    result = subprocess.run(["node", js_build_path], cwd=root_dir)
    sys.exit(result.returncode)

if __name__ == "__main__":
    main()
