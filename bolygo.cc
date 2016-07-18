#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include <SDL_keyboard.h>
#include <SDL_events.h>
#include <math.h>
#include <time.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <iostream>

using namespace std;

int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

int approximately(int x, int y, int d) {
  if (((x-y) < d) || ((y-x) < d)) return 0;
  else return 1;
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
 
    int width = screen->w;
    int height = screen->h; 
    int maxSize = min(width/5, height/5);
    int minSize = maxSize/5;
    const int colorMaxValue = 255;
    int t = 0;
    int d = maxSize*2;
    filledCircleRGBA(screen, width/2, height/2, minSize, colorMaxValue, colorMaxValue/2, 0, 255);
    int x = 0;
    int y = 0;
    // Itt rajzolj
    srand(time(NULL));
    int i;
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
        

     //Miért nem hajlandó ez törölni??? 
          
     int x = d*sin(t) + width/2;
     int y = d*cos(t) + height/2;

     filledCircleRGBA(screen, x, y, minSize, colorMaxValue, 0, 0, 255);
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     
     //Mozgás: eltűnök a régi helyemről, és megjelenek az új helyen   
     filledCircleRGBA(screen, x, y, minSize, 0, 0, 0, 255);
     t = t+1;
     sleep( 1 ); 
    
    
     
    /* varunk a kilepesre */
  /*  while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT)
       {
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
        
        */
        
        
    }
 
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}