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
 
vector<vector<int> > generate_cyclic_matrix(int n){
  vector<int> first;
  for (int i = 0; i < n; i++){
    first.push_back(i);
  }
  vector<vector<int> > matrix;

  for (int i = 0; i < n; i++){
    matrix.push_back(first);
  }  

  for (int i = 0; i < n; i++){
    for (int j = 0; j < n; j++){
      matrix.at(i).at(j) = (matrix.at(i).at(j) + j)%n;
    }  
  }
  return matrix;
}

color int_to_color(int n, int colorMaxValue){
  color col;
  if (n == 0) {
    col.red = colorMaxValue;
    col.green = colorMaxValue;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  }
  else if (n == 1) {
    col.red = colorMaxValue;
    col.green = 0;
    col.blue = 0;  
    col.alpha = colorMaxValue;
  }
  else if (n == 2) {
    col.red = 0;
    col.green = 0;
    col.blue = colorMaxValue;      
    col.alpha = colorMaxValue;

  }
  else if (n == 3) {
    col.red = colorMaxValue;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 4) {
    col.red = 0;
    col.green = colorMaxValue/2;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 5) {
    col.red = colorMaxValue/2;
    col.green = 0;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  }
  else if (n == 6) {
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  }
  else if (n == 7) {
    col.red = colorMaxValue/2;
    col.green = 0;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 8) {
    col.red = 0;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  }
  else if (n == 9) {
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
    const int width = screen->w;
    const int height = screen->h; 
    int mx = min(width, height);
    const int colorMaxValue = 255;
    const int gap = mx/30;
    const int maxGroupSize = 10;
    
    // Itt rajzolj
    int i;
    int tick = 1;

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
        
        vector<vector<vector<int> > > groups; 
        
        for (int i = 0; i < maxGroupSize; i++){
          groups.push_back(generate_cyclic_matrix(i));
        }
        
        for (int i = 0; i < groups.size(); i++){
        
          int cellSize = mx/(i+1);
          
          SDL_FillRect( screen, NULL, SDL_MapRGB( 
                      screen->format, 0x00, 0x00, 000 ) );                     
          
          for (int j = 0; j < groups.at(i).size(); j++){

           for (int k = 0; k < groups.at(i).at(j).size(); k++){
        
            //El kell érni, hogy majd középre kerüljön
            Sint16 x1 = j*cellSize + gap;
            Sint16 y1 = k*cellSize + gap;  
            Sint16 x2 = (j+1)*cellSize;
            Sint16 y2 = (k+1)*cellSize; 
             
            int colint = groups.at(i).at(j).at(k);
            color col = int_to_color(colint, colorMaxValue);
             
             
            boxRGBA(screen, x1, y1, x2, y2,
              col.red, col.green, col.blue, col.alpha);
        
        
/*       
       int n = 3 + rand() % (maxSymmetry - 3);   
       color col = generate_color(colorMaxValue);
       int d = minSize + rand() % maxSize;
       int b = minSize + rand() % maxSize;
       int x1 = rand() % width;
       int y1 = rand() % height;
       int alpha = rand() % degrees;
       int begin = rand() % degrees;
       int end = rand() % degrees;
       int R = minSize + rand() % (mx - minSize);
       point center;
       center.x = x1;
       center.y = y1;
       double u = width/2;
       double v = height/2;*/
//        for (int i = 0; i < symmetry; i++){
//          int x_=((x-u)*cos(delta*i)+(y-v)*sin(delta*i))+u;
//          int y_=((x-u)*sin(delta*i)-(y-v)*cos(delta*i))+v; 
//          filledCircleRGBA(screen, x_, y_, d, col.red, col.green, col.blue, col.alpha);
//        }
//       Elem elem = Elem(n, alpha, begin, b, end, degrees, R, center, col);
       //vector<Polygon> polygons = vector<Polygon>();
       //polygon.draw(screen, d);
       //Ide kellenek az elforgatottak/tükrözöttek
//       int delta = degrees/symmetry;
//       for (int i = 0; i < symmetry; i++){
         //Miért nem középre kerül?
//         (elem.rotate(u, v, delta*i)).draw(screen, d);
/*         (((elem.rotate(width/2, height/2, delta*i))).mirror_vertical(width - width/4)).draw(screen, d);*/
//       }
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