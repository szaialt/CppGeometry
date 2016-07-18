#define _USE_MATH_DEFINES
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
#include <vector>

using namespace std;

typedef struct color {
  int red;
  int green;
  int blue;
} color;

int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

int approximately(int x, int y, int d) {
  if (((x-y) < d) || ((y-x) < d)) return 0;
  else return 1;
}
 
typedef struct point {
  int x;
  int y;
} point;
 
vector<point> polygon(int n, int r, int alpha = 0, int dx = 0, int dy = 0){
  //A vectorban a sokszög csúcsait adja meg
  int degrees = 360;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = degrees/n;
  int phi = alpha;
  vector<point> points = vector<point>();
  for (int i = 0; i < n; i++){
    int x = r * cos(degrees_to_rads * phi) + dx;
    int y = r * sin(degrees_to_rads * phi) + dy;
    point p;
    p.x = x;
    p.y = y;
    points.push_back(p);
    phi = phi + delta;
  }
  return points;
} 
 
color generate_color(int colorMaxValue){
     const int coldist = 30;
     int red =  rand() / colorMaxValue;
     int green =  rand() / colorMaxValue;
     int blue =  rand() / colorMaxValue;
     //I hate grey
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
 //Fill the surface white 
      SDL_FillRect( screen, NULL, SDL_MapRGB( 
      screen->format, 0xFF, 0xFF, 0xFF ) ); 
      //Update the surface 
      //SDL_UpdateWindowSurface( screen );
      SDL_Flip(screen);
    int width = screen->w;
    int height = screen->h; 
    int maxSize = min(width/5, height/5);
    int minSize = maxSize/5;
    const int colorMaxValue = 255;
    const int coldist = 30;
    const int maxSide = 12;
    const int degrees = 360;
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
        
     int vx = rand();
     int vy = rand();
     int x = vx % width;
     int y = vy % height;
     int d = minSize + rand() % maxSize;
     color col = generate_color(colorMaxValue);
     
     int n = rand() % (maxSide - 3) + 3;
     int alpha = rand() % degrees;
     vector<point> points = polygon(n, d, alpha);
     Sint16 xs[n];
     Sint16 ys[n];
     for (int i = 0; i < n; i++){
       Sint16 xr = points.at(i).x % width + x;
       Sint16 yr = points.at(i).y % height + y;
       xs[i] = xr;
       ys[i] = yr;
     }
     filledPolygonRGBA(screen, xs, ys, n, col.red, col.green, col.blue, 255);
     //filledCircleRGBA(screen, x, y, d, red, green, blue, 255);
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
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