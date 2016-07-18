#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include <SDL_keyboard.h>
#include <SDL_events.h>
#include <math.h>
#include <time.h>
#include <stdlib.h>
#include <unistd.h>

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
    const int coldist = 30;

    // Itt rajzolj
    srand(time(NULL));
    int i;
    for (i = 0; i < 40; i++){
       switch (ev.type){
         case SDL_KEYDOWN:
           SDL_Quit();
         default:           
         {
     int vx = rand();
     int vy = rand();
     int x = vx % width;
     int y = vy % height;
     int d = minSize + rand() % maxSize;
     int red =  rand() / colorMaxValue;
     int green =  rand() / colorMaxValue;
     int blue =  rand() / colorMaxValue;
     //I hate grey
     if ((approximately(red, green, coldist) == 0) && 
       (approximately(blue, green, coldist) == 0) && 
       (approximately(red, blue, coldist) == 0)){
       red = (red * 17) % colorMaxValue;
       green = (green * 11) % colorMaxValue;
       blue = (blue * 13) % colorMaxValue;
     }
       
     filledCircleRGBA(screen, x, y, d, red, green, blue, 255);
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     sleep( 1 ); 
    }
       }
    }
    
 
    /* varunk a kilepesre */
    while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT && SDL_PollEvent(&ev))
       {
    }
 
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}