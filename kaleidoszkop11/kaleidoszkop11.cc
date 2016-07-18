#include "polygon.h"
#include "global_functions.h"
#include <SDL_keyboard.h>
#include <SDL_events.h>
#include <SDL_gfxPrimitives.h>

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
    double delta = 2 * M_PI / symmetry;

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
        
       int delt = 5;
       int del = rand() % delt;
       color col = generate_color(colorMaxValue);
       int u = width/2;
       int v = height/2;
       int d = minSize + rand() % maxSize;

       if (del == 0){
         //Fill the surface white 
//         SDL_FillRect( screen, NULL, SDL_MapRGB( 
//         screen->format, 0xFF, 0xFF, 0xFF ) );      
       int vx = rand();
       int vy = rand();
       int x = vx % width;
       int y = vy % height;
       for (int i = 0; i < symmetry; i++){
         int x_=((x-u)*cos(delta*i)+(y-v)*sin(delta*i))+u;
         int y_=((x-u)*sin(delta*i)-(y-v)*cos(delta*i))+v; 
         filledCircleRGBA(screen, x_, y_, d, col.red, col.green, col.blue, col.alpha);
       }
       }
       else if (del == 1) {
         int vx = rand();
         int vy = rand();
         Sint16 x1 = vx % width;
         Sint16 y1 = vy % height;
         vx = rand();
         vy = rand();
         Sint16 beta = vx % degrees;
         Sint16 gamma = vy % degrees;
         for (int i = 0; i < symmetry; i++){
           int x1_=((x1-u)*cos(delta*i)+(y1-v)*sin(delta*i))+u;
           int y1_=((x1-u)*sin(delta*i)-(y1-v)*cos(delta*i))+v; 
          
           arcRGBA(screen, x1, y1, d, beta+delta*i, gamma+delta*i,
                  col.red, col.green, col.blue, col.alpha);
         }
       }
       else if (del == 2) {
         int vx = rand();
         int vy = rand();
         Sint16 x1 = vx % width;
         Sint16 y1 = vy % height;
         vx = rand();
         vy = rand();
         Sint16 x2 = vx % degrees;
         Sint16 y2 = vy % degrees;
         for (int i = 0; i < symmetry; i++){
           int x1_=((x1-u)*cos(delta*i)+(y1-v)*sin(delta*i))+u;
           int y1_=((x1-u)*sin(delta*i)-(y1-v)*cos(delta*i))+v; 
           int x2_=((x2-u)*cos(delta*i)+(y2-v)*sin(delta*i))+u;
           int y2_=((x2-u)*sin(delta*i)-(y2-v)*cos(delta*i))+v;            
           lineRGBA(screen, x1, y1, x2, y2,
                  col.red, col.green, col.blue, col.alpha);
         }
       
       }
       else {  
         
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
       Polygon polygon = Polygon(n, alpha, degrees, p, col);
       polygon.setColor(col);
       //Ide kellenek az elforgatottak/tükrözöttek
       int delta = degrees/symmetry;
       for (int i = 0; i < symmetry; i++){
         (polygon.rotate(width/2, height/2, delta*i)).draw(screen, d);
         ((polygon.mirror(width)).rotate(width/2, height/2, delta*i)).draw(screen, d);
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