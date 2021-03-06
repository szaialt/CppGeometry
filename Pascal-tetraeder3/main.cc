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

vector<vector<long long> > multiply(vector<vector<long long> > matrix, 
                              vector<long long> factors){
  vector<vector<long long> > mx;
  for (long long i = 0; i < matrix.size(); i++){
    vector<long long> row;
    for (long long j = 0; j < matrix.at(i).size(); j++){
      long long l = matrix.at(i).at(j) * factors.at(i);
      row.push_back(l);
    }
    mx.push_back(row);
  }
  return mx;
}

vector<vector<vector<long long> > > generate_Pascal_tetraeder(long long n){
   vector<vector<vector<long long> > > tetraeder;
  for (long long j = 1; j < n; j++){
     vector<vector<long long> > triangle = generate_Pascal_triangle(j);
     long long tr = triangle.size();
     vector<long long> row = triangle.at(tr-1);
     tetraeder.push_back(multiply(triangle, row));
  }
  return tetraeder;
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
    col.green = 0;
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
    const long long maxColours = 10;
    const long long tileSize = 36;
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
        
        vector<vector<vector<long long> > > tetraeder = 
        generate_Pascal_tetraeder(size);

        for (long long i = 0; i < maxColours-1; i++){
      
          for (long long i0 = 0; i0 < tetraeder.size(); i0++){
          vector<vector<long long> > triangle = tetraeder.at(i0);//
        
            long long offset = width/2;
          
            color col = long_long_to_color(i, colorMaxValue);
            
            SDL_FillRect( screen, NULL, SDL_MapRGB( 
                      screen->format, 0, 0, 0) );        
      
                   
          
            for (long long j = 0; j < triangle.size(); j++){
             offset = offset - tileSize/2;
             for (long long k = 0; k < triangle.at(j).size(); k++){
        
              //El kell érni, hogy majd középre kerüljön
              Sint16 x1 = k*tileSize + offset;
              Sint16 y1 = j*tileSize;  
              Sint16 x2 = (k+1)*tileSize + offset;
              Sint16 y2 = (j+1)*tileSize; 
             
              long long c = triangle.at(j).at(k);
              cout << c << endl;
              long long collonglong = c % (i+2);
              color col = long_long_to_color(collonglong, colorMaxValue);
             
             
              boxRGBA(screen, x1, y1, x2, y2,
                col.red, col.green, col.blue, col.alpha);
        
        

             }
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