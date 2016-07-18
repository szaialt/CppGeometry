#include "polygon.h"
#include <SDL_keyboard.h>
#include <SDL_events.h>

using namespace std;
 
int min(int a, int b){
  if (a < b) return a;
  else return b;
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
         Polygon polygon = Polygon(maxSide, degrees, time, height, width, colorMaxValue);
         color col;
         col.red = colorMaxValue;
         col.green = colorMaxValue;
         col.blue = colorMaxValue;
         col.alpha = colorMaxValue;
        //Fill the surface white 
        polygon.setColor(col);
        polygons.push_back(polygon);
             
      }
      else {  
         
       Polygon polygon = Polygon(maxSide, degrees, time, height, width, colorMaxValue);
       polygons.push_back(polygon);
       
      }
      for (int i = 0; i < polygons.size(); i++){
         polygons.at(i).draw(screen, time);
       }         
       
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     time = time + tick;
     sleep( tick ); 
      
        
    
    }
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}