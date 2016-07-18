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

int approximately(int x, int y, int d) {
  if (((x-y) < d) || ((y-x) < d)) return 0;
  else return 1;
}
 
color generate_color(int colorMaxValue){
     const int coldist = 30;
     int red =  rand() / colorMaxValue;
     int green =  rand() / colorMaxValue;
     int blue =  rand() / colorMaxValue;
     //I wish brigth colours
     if (((approximately(red, colorMaxValue/2, coldist) == 0) && 
       (approximately(blue, colorMaxValue/2, coldist) == 0) && 
       (approximately(green, colorMaxValue/2, coldist) == 0))){
         if (red > colorMaxValue/2) 
           red = (red + coldist) % colorMaxValue;
         if (red < colorMaxValue/2) 
           red = (red - coldist) % colorMaxValue;
         if (green > colorMaxValue/2) 
           green = (green + coldist) % colorMaxValue;
         if (green < colorMaxValue/2) 
           green = (green - coldist) % colorMaxValue;
         if (blue > colorMaxValue/2) 
           blue = (blue + coldist) % colorMaxValue;
         if (blue < colorMaxValue/2) 
           blue = (blue - coldist) % colorMaxValue;
     }
     //I hate grey
     if ((approximately(red, green, coldist) == 0) && 
       (approximately(blue, green, coldist) == 0) && 
       (approximately(red, blue, coldist) == 0)){
       int r = red;
       int g = green;
       int b = blue;
        if (approximately(r, g, coldist) == 0) {
           if (r > g) 
             red = (r + coldist) % colorMaxValue;
           if (red < green) 
             red = (r - coldist) % colorMaxValue;
      }
      if (approximately(g, b, coldist) == 0) {
           if (g > b) 
             green = (g + coldist) % colorMaxValue;
           if (green < blue) 
             green = (g - coldist) % colorMaxValue;    
      }        
      if  (approximately(b, r, coldist) == 0) {
           if (b > r) 
             blue = (b + coldist) % colorMaxValue;
           if (blue < red) 
             blue = (b - coldist) % colorMaxValue;    
      }
  


  }
  if (red < 0) red = colorMaxValue + red;
  if (green < 0) green = colorMaxValue + green;
  if (blue < 0) blue = colorMaxValue + blue;
  
  color col;
  col.red = red;
  col.green = green;
  col.blue = blue;
  int alpha = colorMaxValue;
  col.alpha = alpha;
  return col;
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
    int tileSize = 100;
    const int colorMaxValue = 255;
    int t = 0;
    int d = maxSize*2;
    int x = 0;
    int y = 0;
    // Itt rajzolj
    srand(time(NULL));
    int n = width/tileSize;
    int m = height/tileSize;
           
        const int half = colorMaxValue/2;
        const int third = colorMaxValue/3;
           
        color white;
          white.red = colorMaxValue;
          white.green = colorMaxValue;
          white.blue = colorMaxValue;
          white.alpha = colorMaxValue;
        color yellow;
          yellow.red = colorMaxValue;
          yellow.green = colorMaxValue;
          yellow.blue = 0;
          yellow.alpha = colorMaxValue;
        color red;
          red.red = colorMaxValue;
          red.green = 0;
          red.blue = 0;
          red.alpha = colorMaxValue;
        color green;
          green.red = 0;
          green.green = colorMaxValue;
          green.blue = 0;
          green.alpha = colorMaxValue;
        color blue;
          blue.red = 0;
          blue.green = 0;
          blue.blue = colorMaxValue;
          blue.alpha = colorMaxValue;
        color magenta;
          magenta.red = colorMaxValue;
          magenta.green = 0;
          magenta.blue = colorMaxValue;
          magenta.alpha = colorMaxValue;
        color turquis;
          turquis.red = 0;
          turquis.green = colorMaxValue;
          turquis.blue = colorMaxValue;
          turquis.alpha = colorMaxValue;
        color black;
          black.red = 0;
          black.green = 0;
          black.blue = 0;
          black.alpha = colorMaxValue;
        
        color orange;
          orange.red = colorMaxValue;
          orange.green = half;
          orange.blue = 0;
          orange.alpha = colorMaxValue;
        color yellowGreen;
          yellowGreen.red = half;
          yellowGreen.green = colorMaxValue;
          yellowGreen.blue = 0;
          yellowGreen.alpha = colorMaxValue;
        color lila;
          lila.red = half;
          lila.green = 0;
          lila.blue = colorMaxValue;
          lila.alpha = colorMaxValue;
        color pink;
          pink.red = colorMaxValue;
          pink.green = 0;
          pink.blue = half;
          pink.alpha = colorMaxValue;
        color zaphire;
          zaphire.red = 0;
          zaphire.green = colorMaxValue;
          zaphire.blue = half;
          zaphire.alpha = colorMaxValue;
        color navy;        
          navy.red = 0;
          navy.green = half;
          navy.blue = colorMaxValue;
          navy.alpha = colorMaxValue;
        
        color colors[] = {white, yellow, red, green, blue, magenta, turquis, black};
        color colors2[] = {orange, yellowGreen, lila, pink, zaphire, navy};           

        while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT && ev.type != SDL_KEYDOWN){

        for (int i = 0; i < 8; i++){
            int j = 200;
            Sint16 x1 = i*tileSize + 5;
            Sint16 y1 = j*tileSize + 5;  
            Sint16 x2 = (i+1)*tileSize;
            Sint16 y2 = (j+1)*tileSize; 
            boxRGBA(screen, x1, y1, x2, y2,
            colors[i].red, colors[i].green, colors[i].blue, colors[i].alpha);
            SDL_Flip(screen);
        }
        
        for (int i = 0; i < 6; i++){
            int j = 400;
            Sint16 x1 = i*tileSize + 5;
            Sint16 y1 = j*tileSize + 5;  
            Sint16 x2 = (i+1)*tileSize;
            Sint16 y2 = (j+1)*tileSize; 
            boxRGBA(screen, x1, y1, x2, y2,
            colors2[i].red, colors2[i].green, colors2[i].blue, colors2[i].alpha);   
            SDL_Flip(screen);
        }
        
        //Miért nem rajzol????
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     

    sleep(60);
    
      }
    /* ablak bezarasa */
    SDL_Quit();
        
        
    
 
 
    return 0;
}