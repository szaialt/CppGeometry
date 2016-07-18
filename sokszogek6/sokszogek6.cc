#include "polygon.h"
#include <SDL_keyboard.h>
#include <SDL_events.h>

using namespace std;
 
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
    int time = 0;
    int tick = 1;
    vector<Polygon> polygons = vector<Polygon>();
    while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT && ev.type != SDL_KEYDOWN){
       if (ev.type == SDL_KEYDOWN)
         {
          cout << "Billentyű észlelve." << endl;
          SDL_Quit();
        }
      else if (ev.type == SDL_MOUSEBUTTONDOWN)
         {
          cout << "Egér észlelve." << endl;
          SDL_Quit();
        }
        
      int delt = 40;
      int del = rand() % delt;
      
      if (del == 0){
        //Fill the surface white 
        polygons = vector<Polygon>();
        SDL_FillRect( screen, NULL, SDL_MapRGB( 
        screen->format, 0xFF, 0xFF, 0xFF ) );       
      }
      else {  
         
       Polygon polygon = Polygon(maxSide, degrees, time);
       polygons.push_back(polygon);
       
       for (int i = 0; i < polygons.size(); i++){
         int vx = rand();
         int vy = rand();
         int x = vx % width;
         int y = vy % height;
         point p;
         p.x = x;
         p.y = y;

         color col = generate_color(colorMaxValue);
         polygons.at(i).draw(screen, p, time, col);
       }       
      
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     time = time + tick;
     sleep( tick ); 
        
        
    }
    }
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}