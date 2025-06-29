#!/usr/bin/env python3
"""
Main entry point for the Amazon Q test game.
"""
from src.game import Game

def main():
    """Run a simple game demo."""
    print("Welcome to the Amazon Q Test Game!")
    
    # Get game name from user
    game_name = input("Enter a name for your game (or press Enter for default): ")
    if not game_name:
        game_name = "Amazon Q Test Game"
    
    # Create and start the game
    game = Game(game_name)
    game.start()
    
    # Simple game loop
    print("Enter points to add (or 'q' to quit):")
    while game.is_running:
        user_input = input("> ")
        
        if user_input.lower() == 'q':
            break
        
        try:
            points = int(user_input)
            new_score = game.update_score(points)
            print(f"Score updated: {new_score}")
        except ValueError:
            print("Please enter a number or 'q' to quit.")
    
    # End the game
    final_score = game.end()
    print(f"Game over! Final score: {final_score}")

if __name__ == "__main__":
    main()