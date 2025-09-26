# jingle_snake
Classic snake game with a musical twist

## Premise
Inspired by classic [Snake game](https://en.wikipedia.org/wiki/Snake_(video_game_genre)) and newer [Hitser game](https://hitstergame.com/en-us/).

Objective of the game is guess the song title by spelling out the word by eating the correct letters. Eating wrong letters will grow the snake and potentially make it harder to get to next correct letter.

## Development Brainstorming/Gameplan
- Use javascript with React for development (will allow practical project to learn new language)
  - Can consider pivoting to python or developing the game in both languages
- Leverage [Spotify API](https://developer.spotify.com/documentation/web-api) for music snippets to guess
- Settings to tweak difficulty
  - Snake speed
  - Number of letters on the board at any given time (based on a percent of available spots)
  - Board size
 
## Random thoughts on how to approach things
- Model board as a grid with values indicating state
  - 0 -> empty
  - 1 -> part of snake there
  - 2 through 129 -> ASCII characters
    - Consider skipping things like spaces
- Model snake as reverse linked list
  - Linked will track tail with each node point to previous (instead of next)
    - Will also track head but only for quick access, not for traversing nodes    
  - When moving the snake remove tail and get as new head (i.e., only move the tail one at a time rather than shifting the whole linked list on the board)
- Tracking events
  - If next space has value of 0, then move snake normally
  - If next space has value of 1, then game over
  - If next space have value > 1, then snake stays still but new node is added to head
- Adding and removing things to board spaces
  - Board class will hold an array of tuples with row/col combinations, a dictionary to track index of row/col combinations within array, and the count of empty spots on the board 
  - When a new spot is needed can get a random index from 0 to n-1 where n is the number of available spots. Random index will get swapped with index n within the array and the dictionary will be updated with new indices for those locations (this all can be done with O(1) time)
  - When spot becomes available can quickly do a somewhat inverse of the previous note (i.e. get index with that location and move it back to availble section of the array
  - Spots getting converted from letters to part of the snake does not require an update to the available spots of the board
- Letters on the board
  - Will likely need to track what letters are on the board so know whether next letter added needs to be the next letter of the song title or can be a random letter/character
  - Can use a dictionary to track what letters are on the board and how many of them there are. When letters are eaten can decrement letter count and remove from dictionary when count hits 0 
