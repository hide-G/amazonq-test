"""
Basic game class for Amazon Q test repository.
"""

class Game:
    def __init__(self, name="Test Game"):
        self.name = name
        self.score = 0
        self.is_running = False
    
    def start(self):
        """Start the game."""
        self.is_running = True
        self.score = 0
        print(f"{self.name} started!")
        return True
    
    def update_score(self, points):
        """Update the game score."""
        if self.is_running:
            self.score += points
            return self.score
        return None
    
    def end(self):
        """End the game."""
        self.is_running = False
        print(f"{self.name} ended with score: {self.score}")
        return self.score