#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include <vector>
#include <SDL_keyboard.h>
#include <SDL_events.h>
#include <iostream>
#include <time.h>
//#include <sdl_keyboard.h>

using namespace std;
 
typedef struct color {
  int red;
  int green;
  int blue;
  int alpha;
} color;

typedef struct point {
  int x;
  int y;
} point; 
 
int min(int a, int b){
  if (a < b) return a;
  else return b;
} 
 



int main(int argc, char *argv[]) {
    SDL_Event ev;
    SDL_Surface *screen;
 
    /* SDL inicializálása és ablak megnyitása */
    SDL_Init(SDL_INIT_VIDEO);
    screen=SDL_SetVideoMode(0, 0, 0, SDL_ANYFORMAT);
    if (!screen) {
        fprintf(stderr, "Nem sikerult megnyitni az ablakot!\n");
        exit(1);
    }
    SDL_WM_SetCaption("SDL peldaprogram", "SDL peldaprogram");

      //Update the surface 
      //SDL_UpdateWindowSurface( screen );
      SDL_Flip(screen);
    const int width = screen->w;
    const int height = screen->h; 
    int mx = min(width, height);
    const int colorMaxValue = 255;
    const int gap = mx/30;

   
    while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT && ev.type != SDL_KEYDOWN){
       if (ev.type == SDL_KEYDOWN)
         {
           //Ez miért nem működik??
          //SDLKey keyPressed = ev.key.keysym.sym; 
          cout << "Billentyű észlelve." << endl;
          SDL_Quit();
        }
      else if (ev.type == SDL_MOUSEBUTTONDOWN)
         {
           //Ez miért nem működik??
          //SDLKey keyPressed = ev.key.keysym.sym; 
          cout << "Egér észlelve." << endl;
          SDL_Quit();
        }
        

    color red;
 
    red.red = colorMaxValue;
    red.green = 0;
    red.blue = 0;  
    red.alpha = colorMaxValue;

    color green;

    green.red = 0;
    green.green = colorMaxValue/2;
    green.blue = 0;
    green.alpha = colorMaxValue;

    int cellSize = mx/2;
    
            Sint16 x1 = gap;
            Sint16 y1 = gap;  
            Sint16 x2 = cellSize;
            Sint16 y2 = cellSize; 
             
            boxRGBA(screen, x1, y1, x2, y2,
              red.red, red.green, red.blue, red.alpha);

             x1 = cellSize + gap;
             y1 = gap;  
             x2 = 2*cellSize;
             y2 = cellSize; 
            

            boxRGBA(screen, x1, y1, x2, y2,
              green.red, green.green, green.blue, green.alpha);
              
             x1 = gap;
             y1 = cellSize + gap;  
             x2 = cellSize;
             y2 = 2*cellSize; 
             

            boxRGBA(screen, x1, y1, x2, y2,
              red.green, red.red, red.blue, red.alpha);
              
             x1 = cellSize + gap;
             y1 = cellSize + gap;  
             x2 = 2*cellSize;
             y2 = 2*cellSize; 
             

            boxRGBA(screen, x1, y1, x2, y2,
              green.green, green.red,  green.blue, green.alpha);              
              
              
          
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
    
        
    }
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}