#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include "elem.h"
#include "global_functions.h"
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
    int maxSize = min(width/10, height/10);
    int minSize = maxSize/4;
    const int colorMaxValue = 255;
    const int coldist = 30;
    const int maxSide = 12;
    const int degrees = 360;
    const int maxSymmetry = 12;
    // Itt rajzolj
    srand(time(NULL));
    int i;
    int tick = 1;
    int symmetry = 3 + rand() % (maxSymmetry - 3);
    int pieces = 3 + rand() % (maxSymmetry - 3);

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
       
   
       color col = generate_color(colorMaxValue);
       int d = minSize + rand() % maxSize;
       int x1 = rand() % width;
       int y1 = rand() % height;
       int x2 = rand() % width;
       int y2 = rand() % height;
       point a;
       point b;
       a.x = x1;
       a.y = y1;
       b.x = x2;
       b.y = y2;
       int u = width/2;
       int v = height/2;
//        for (int i = 0; i < symmetry; i++){
//          int x_=((x-u)*cos(delta*i)+(y-v)*sin(delta*i))+u;
//          int y_=((x-u)*sin(delta*i)-(y-v)*cos(delta*i))+v; 
//          filledCircleRGBA(screen, x_, y_, d, col.red, col.green, col.blue, col.alpha);
//        }
       Elem elem = Elem(pieces, a, b, col);
       //vector<Polygon> polygons = vector<Polygon>();
       //polygon.draw(screen, d);
       //Ide kellenek az elforgatottak/tükrözöttek
       int delta = degrees/symmetry;
       for (int i = 0; i < symmetry; i++){
         (elem.rotate(width/2, height/2, delta*i)).draw(screen, d);
         //(((elem.rotate(width/2, height/2, delta*i))).mirror(width/2)).draw(screen, d);
       }
       
       
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     sleep( tick ); 
        
        
    }
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}