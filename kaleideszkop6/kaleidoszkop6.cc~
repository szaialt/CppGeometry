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
    int time = 0;
    int tick = 1;
    int symmetry = 3 + rand() % (maxSymmetry - 3);
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
        
//       int delt = 40;
//       int del = rand() % delt;
//       
//       if (del == 0){
//         //Fill the surface white 
//         SDL_FillRect( screen, NULL, SDL_MapRGB( 
//         screen->format, 0xFF, 0xFF, 0xFF ) );       
//       }
//       else {  
         
       int d = minSize + rand() % maxSize;
       int n = rand() % (maxSide - 3) + 3;
       int alpha = rand() % degrees;
       int vx = rand();
       int vy = rand();
       int x = vx % width;
       int y = vy % height;
       point p;
       p.x = x;
       p.y = y;
       color white;
       white.red = colorMaxValue;
       white.green = colorMaxValue;
       white.green = colorMaxValue;
       white.alpha = colorMaxValue;
       Polygon polygon = Polygon(n, alpha, degrees, time, p, white);
       color col = polygon.generate_color(colorMaxValue);
       polygon.setColor(col);
       //vector<Polygon> polygons = vector<Polygon>();
       //polygon.draw(screen, d);
       //Ide kellenek az elforgatottak/tükrözöttek
       int delta = degrees/symmetry;
       for (int i = 0; i < symmetry; i++){
         (polygon.rotate(width/2, height/2, delta*i)).draw(screen, d);
         ((polygon.mirror(width)).rotate(width/2, height/2, delta*i)).draw(screen, d);
       }
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     time = time + tick;
     sleep( tick ); 
        
        
    //}
    }
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}