#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include "global_functions.h"
#include <vector>
#include <SDL_keyboard.h>
#include <SDL_events.h>
#include <iostream>
#include <time.h>

using namespace std;
 
int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

vector<vector<double> > generate_matrix(){

        vector<vector<double> > matrix;
        vector<double> row1;
        vector<double> row2;
        vector<double> row3;
        
        row1.push_back(0.5);
        row1.push_back(0.0);
        row1.push_back(0.0);
        row1.push_back(0.5);
        row1.push_back(0.0);
        row1.push_back(0.0);
        
        row2.push_back(0.5);
        row2.push_back(0.0);
        row2.push_back(0.0);
        row2.push_back(0.5);
        row2.push_back(0.5);
        row2.push_back(0.0);
        
        row3.push_back(0.5);
        row3.push_back(0.0);
        row3.push_back(0.0);
        row3.push_back(0.5);
        row3.push_back(0.25);
        row3.push_back(0.5);
        
        matrix.push_back(row1);
        matrix.push_back(row2);
        matrix.push_back(row3);

    
    return matrix;
}

color int_to_color(int n, int colorMaxValue){
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
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue/2;
    col.alpha = colorMaxValue;
  }
  else if (n == 14) {
     //zöld
    col.red = 0;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  return col;    
}
 

 
int main(int argc, char *argv[]) {
    srand(time(NULL));
    SDL_Event ev;
    SDL_Surface *screen;
    /* SDL inicializálása és ablak megnyitása */
    SDL_Init(SDL_INIT_VIDEO);
    screen=SDL_SetVideoMode(0, 0, 0, SDL_ANYFORMAT);
     const int width = screen->w;
    const int height = screen->h; 
    point p0;
    p0.x = width/2;
    p0.y = height/2;
    point p1 = p0;
    if (!screen) {
        fprintf(stderr, "Nem sikerult megnyitni az ablakot!\n");
        exit(1);
    }
   
    SDL_WM_SetCaption("SDL peldaprogram", "SDL peldaprogram");
    
      //Update the surface 
      //SDL_UpdateWindowSurface( screen );
    SDL_Flip(screen);


    int mx = min(width, height);
    const int colorMaxValue = 255;
    const int maxColours = 16;
    const int tileSize = 36;
    const int size = mx/tileSize;
    // Itt rajzolj
    int i = 0;
    int tick = 1;
    vector<vector<double> > matrix = generate_matrix();

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
        
        //ezt majd meg kell változtatni
        
        color col = generate_color(colorMaxValue);
        if (i % 10 == 9){
          int x0 = rand() % width;
          int y0 = rand() % height;
          p1.x = x0;
          p1.y = y0;
        }
        Sint16 x1 = p1.x;
        Sint16 y1 = p1.y;  
        Uint8 r = col.red;
        Uint8 g = col.green; 
        Uint8 b = col.blue;
        pixelRGBA(screen, x1, y1, r, g, b, colorMaxValue);

        int h = rand() % matrix.size();
        int x2 = matrix.at(h).at(0)*x1+matrix.at(h).at(1)*y1;
        x2 = x2 + matrix.at(h).at(2);
        int y2 = matrix.at(h).at(3)*x1+matrix.at(h).at(4)*y1;
        y2 = y2 + matrix.at(h).at(5);
        
        p1.x = x2;
        p1.y = y2;
        
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     i = i+1;
     //sleep( tick ); 
    }  
        
    
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}