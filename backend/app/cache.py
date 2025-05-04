import json
import os
import time


class Cache:
    """Simple caching mechanism"""

    def __init__(self) -> None:
        self.map = {}
        self.file_name = "cache.json"

    def set(self, key: str, data: any) -> None:
        """Store data in cache"""
        if os.path.exists(self.file_name):
            with open(self.file_name, "r") as file:
                current_cache = json.load(file)
                current_cache[key] = data
            with open(self.file_name, "w") as file:
                json.dump(current_cache, file, indent=2)
        else:
            self.map[key] = {}
            self.map[key]["items"] = data
            self.map[key]["time"] = time.time()  # current timestamp
            with open(self.file_name, "w") as file:
                json.dump(self.map, file, indent=2)

    def get(self, key: str) -> any:
        """Retrieve cache data"""
        if os.path.exists(self.file_name):
            with open(self.file_name, "r") as file:
                data = json.load(file)
            if key in data:
                return data[key]
        return None

    def delete(self, key: str):
        """delete key"""
        if os.path.exists(self.file_name):
            with open(self.file_name, "r") as file:
                data = json.load(file)
            if key in data:
                del data[key]
            if not data:
                os.remove(self.file_name)
            else:
                with open(self.file_name, "w") as file:
                    json.dump(data, file, indent=2)

    def clear(self) -> None:
        """Clear all cache data"""
        if os.path.exists(self.file_name):
            os.remove(self.file_name)
