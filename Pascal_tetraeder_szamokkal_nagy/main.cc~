#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include "global_functions.h"
#include <vector>
#include <SDL_keyboard.h>
#include <SDL_events.h>
#include <iostream>
#include <time.h>
#include <boost/multiprecision/cpp_int.hpp>
#include <SDL_ttf.h>

using namespace std;
using namespace boost::multiprecision;

unsigned long min(unsigned long a, unsigned long b){
  if (a < b) return a;
  else return b;
} 
 
vector<vector<uint256_t> > generate_Pascal_triangle(uint256_t n){
  vector<vector<uint256_t> > matrix;
    for (unsigned long i = 0; i < n; i++)
    {
        vector<uint256_t> row;
        uint256_t val = 1;

        for (unsigned long k = 0; k <= i; k++)
        {
            row.push_back(val);
            uint256_t j = i - k;
            uint256_t valc = val * j;
            uint256_t kk = k+1;
            val = valc / kk;
        }
        matrix.push_back(row);
    }
    return matrix;
} 

vector<vector<uint256_t> > multiply(vector<vector<uint256_t> > matrix, 
                              vector<uint256_t> factors){
  vector<vector<uint256_t> > mx;
  for (unsigned long i = 0; i < matrix.size(); i++){
    vector<uint256_t> row;
    for (unsigned long j = 0; j < matrix.at(i).size(); j++){
      uint256_t l = matrix.at(i).at(j) * factors.at(i);
      row.push_back(l);
    }
    mx.push_back(row);
  }
  return mx;
}

vector<vector<vector<uint256_t> > > generate_Pascal_tetraeder(uint256_t n){
   vector<vector<vector<uint256_t> > > tetraeder;
  for (unsigned long j = 1; j < n; j++){
     vector<vector<uint256_t> > triangle = generate_Pascal_triangle(j);
     unsigned long tr = triangle.size();
     vector<uint256_t> row = triangle.at(tr-1);
     tetraeder.push_back(multiply(triangle, row));
  }
  return tetraeder;
}

color long_long_to_color(uint256_t n, unsigned long colorMaxValue){
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
    //kék
    col.red = colorMaxValue/4;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue;
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
    col.red = colorMaxValue;
    col.green = 0;
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
    const unsigned long width = screen->w;
    const unsigned long height = screen->h; 
    unsigned long mx = min(width, height);
    const unsigned long colorMaxValue = 255;
    const unsigned long maxColours = 26;
    //Jönnek a kerekítési hibák
    const unsigned long tileSize = 10;
    const unsigned long size = mx/tileSize;
    // Itt rajzolj
    unsigned long i;
    unsigned long tick = 1;

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
        
        vector<vector<vector<uint256_t> > > tetraeder = 
        generate_Pascal_tetraeder(size);

      //Ha maradék szerint generáljuk, akkor a tetraédert beljebb 
      //kellene kiszámítanunk, pedig itt van szükségünk a méretére
      //Ezt máshopnnan kellene megtudnunk
        for (unsigned long i0 = 0; i0 < tetraeder.size(); i0++){
           vector<vector<uint256_t> > triangle = tetraeder.at(i0);//
           unsigned long level = triangle.size();
           char buffer [50];
           sprintf (buffer, "%lu" , level );
           cout << buffer << endl;
         
          for (unsigned long i = 0; i < maxColours-1; i++){
            
            vector<vector<uint256_t> > triangle = tetraeder.at(i0);//
        
            unsigned long offset = width/2;
          
            color col = long_long_to_color(i, colorMaxValue);
            
            SDL_FillRect( screen, NULL, SDL_MapRGB( 
                      screen->format, 0, 0, 0) );        
      
                   
          
            for (unsigned long j = 0; j < triangle.size(); j++){
             offset = offset - tileSize/2;
             for (unsigned long k = 0; k < triangle.at(j).size(); k++){
        
              //El kell érni, hogy majd középre kerüljön
              Sint16 x1 = k*tileSize + offset;
              Sint16 y1 = j*tileSize;  
              Sint16 x2 = (k+1)*tileSize + offset;
              Sint16 y2 = (j+1)*tileSize; 
             
              uint256_t c = triangle.at(j).at(k);
              //cout << c << endl;
              uint256_t collonglong = c % (i+2);
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
  }
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}