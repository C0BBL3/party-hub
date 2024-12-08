import os

def print_directory_hierarchy(path, indent=0):
    """
    Recursively prints the directory hierarchy for the given path,
    skipping directories named 'node_modules'.

    :param path: Path to the directory
    :param indent: Current indentation level for nested directories
    """
    if not os.path.exists(path):
        print(f"The path '{path}' does not exist.")
        return
    
    if not os.path.isdir(path):
        print(f"The path '{path}' is not a directory.")
        return
    
    # Print the current directory
    print(" " * indent + f"[{os.path.basename(path)}]")
    
    # List and sort the contents for consistent order
    try:
        entries = sorted(os.listdir(path))
        for entry in entries:
            if entry == "node_modules":
                # Skip 'node_modules' directory
                print(" " * (indent + 4) + "[node_modules skipped]")
                continue
            
            full_path = os.path.join(path, entry)
            if os.path.isdir(full_path):
                # Recursively print subdirectories
                print_directory_hierarchy(full_path, indent + 4)
            else:
                # Print files
                print(" " * (indent + 4) + entry)
    except PermissionError:
        print(" " * indent + "[Permission Denied]")
    except Exception as e:
        print(" " * indent + f"[Error: {str(e)}]")

if __name__ == "__main__":
    # Example usage
    dir_path = input("Enter the path to the directory: ").strip()
    print_directory_hierarchy(dir_path)
