"""
Tests for the Game class.
"""
import unittest
from src.game import Game

class TestGame(unittest.TestCase):
    def setUp(self):
        self.game = Game("Test Game")
    
    def test_game_initialization(self):
        self.assertEqual(self.game.name, "Test Game")
        self.assertEqual(self.game.score, 0)
        self.assertFalse(self.game.is_running)
    
    def test_game_start(self):
        result = self.game.start()
        self.assertTrue(result)
        self.assertTrue(self.game.is_running)
        self.assertEqual(self.game.score, 0)
    
    def test_update_score(self):
        # Score shouldn't update if game isn't running
        result = self.game.update_score(10)
        self.assertIsNone(result)
        self.assertEqual(self.game.score, 0)
        
        # Start the game and update score
        self.game.start()
        result = self.game.update_score(10)
        self.assertEqual(result, 10)
        self.assertEqual(self.game.score, 10)
    
    def test_game_end(self):
        self.game.start()
        self.game.update_score(20)
        final_score = self.game.end()
        self.assertEqual(final_score, 20)
        self.assertFalse(self.game.is_running)

if __name__ == "__main__":
    unittest.main()