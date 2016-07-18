#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include "global_functions.h"
#include <vector>
#include <SDL_keyboard.h>
#include <SDL_events.h>
#include <iostream>
#include <time.h>

using namespace std;
 
long long min(long long a, long long b){
  if (a < b) return a;
  else return b;
} 
 
vector<vector<long long> > generate_Pascal_triangle(long long n){
  vector<vector<long long> > matrix;
    for (long long i = 0; i < n; i++)
    {
        vector<long long> row;
        long long val = 1;

        for (long long k = 0; k <= i; k++)
        {
            row.push_back(val);
            long long j = i - k;
            long long valc = val * j;
            long long kk = k+1;
            val = valc / kk;
        }
        matrix.push_back(row);
    }
    return matrix;
} 

color long_long_to_color(long long n, long long colorMaxValue){
  color col;
  if (n == 0) {
    //fekete
    col.red = 0;
    col.green = 0;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 1) {
    //fehér
    col.red = colorMaxValue;
    col.green = colorMaxValue;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  }
  else if (n == 2) {
    //rózsaszín
    col.red = colorMaxValue;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue/2;  
    col.alpha = colorMaxValue;
  }
  else if (n == 3) {
    //világoskék
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  }
  else if (n == 4) {
    //piros
    col.red = colorMaxValue;
    col.green = 0;
    col.blue = 0;  
    col.alpha = colorMaxValue;
  }
  else if (n == 5) {
     //sárga
    col.red = colorMaxValue;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 6) {
    //lila
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/4;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  }
  else if (n == 7) {
     //zöld
    col.red = 0;
    col.green = colorMaxValue/2;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 8) {
    //bordó
    col.red = colorMaxValue/2;
    col.green = 0;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 9) {
    //kék
    col.red = 0;
    col.green = 0;
    col.blue = colorMaxValue;      
    col.alpha = colorMaxValue;
  }
  else if (n == 10) {
    //narancssárga
    col.red = colorMaxValue;
    col.green = colorMaxValue/2;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 11) {
    //
    col.red = colorMaxValue;
    col.green = colorMaxValue/4;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 12) {
    //lila
    col.red = colorMaxValue/4;
    col.green = 0;
    col.blue = colorMaxValue/2;
    col.alpha = colorMaxValue;
  }
  else if (n == 13) {
    //szürke
    col.red = colorMaxValue/4;
    col.green = colorMaxValue/4;
    col.blue = 2*colorMaxValue/3;
    col.alpha = colorMaxValue;
  }
  else if (n == 14) {
     //zöld
    col.red = 0;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 15) {
     //sárgászöld
    col.red = colorMaxValue/3;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 16) {
    //bíbor
    col.red = colorMaxValue/2;
    col.green = 0;
    col.blue = colorMaxValue/4;
    col.alpha = colorMaxValue;
  }
  else if (n == 17) {
    //kékeszöld
    col.red = 0;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue/2;      
    col.alpha = colorMaxValue;
  }
  else if (n == 18) {
    //sötétkék
    col.red = 0;
    col.green = 0;
    col.blue = colorMaxValue/2;      
    col.alpha = colorMaxValue;
  }
  else if (n == 19) {
    //kékeslila
    col.red = colorMaxValue/4;
    col.green = 0;
    col.blue = colorMaxValue/2;      
    col.alpha = colorMaxValue;
  }
  else if (n == 20) {
    //rózsaszín
    col.red = colorMaxValue;
    col.green = colorMaxValue/3;
    col.blue = colorMaxValue/3;  
    col.alpha = colorMaxValue;
  }
    else if (n == 21) {
    //piros
    col.red = colorMaxValue;
    col.green = 0;
    col.blue = colorMaxValue/16;  
    col.alpha = colorMaxValue;
  }
  else if (n == 22) {
    //lila
    col.red = colorMaxValue/3;
    col.green = colorMaxValue/16;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  }
  else if (n == 23) {
    //rózsaszín
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/4;
    col.blue = colorMaxValue/4;  
    col.alpha = colorMaxValue;
  }
  else if (n == 24) {
    //rózsaszín
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/8;
    col.blue = colorMaxValue/4;
    col.alpha = colorMaxValue;
  }
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

      //Update the surface 
      //SDL_UpdateWindowSurface( screen );
      SDL_Flip(screen);
    const long long width = screen->w;
    const long long height = screen->h; 
    long long mx = min(width, height);
    const long long colorMaxValue = 255;
    const long long maxColours = 26;
    const long long tileSize = 20;
    const long long size = mx/tileSize;
    // Itt rajzolj
    long long i;
    long long tick = 1;

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
        
        vector<vector<long long> > triangle = generate_Pascal_triangle(size);
        
        
        for (long long i = 0; i < maxColours-1; i++){
          long long offset = width/2;
          
          SDL_FillRect( screen, NULL, SDL_MapRGB( 
                      screen->format, 0x00, 0x00, 000 ) );                     
          
          for (long long j = 0; j < triangle.size(); j++){
           offset = offset - tileSize/2;
           for (long long k = 0; k < triangle.at(j).size(); k++){
        
            Sint16 x1 = k*tileSize + offset;
            Sint16 y1 = j*tileSize;  
            Sint16 x2 = (k+1)*tileSize + offset;
            Sint16 y2 = (j+1)*tileSize; 
             
            long long collonglong = triangle.at(j).at(k) % (i+2);
            color col = long_long_to_color(collonglong, colorMaxValue);
             
             
            boxRGBA(screen, x1, y1, x2, y2,
              col.red, col.green, col.blue, col.alpha);
        
        

           }
        }
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     sleep( tick ); 
    }  
        
    }
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}