#include <SDL.h>
#include <SDL_gfxPrimitives.h>
#include <SDL_keyboard.h>
#include <SDL_events.h>
#include <math.h>
#include <time.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <iostream>
#include <vector>
#include "wander.h"
#include "global_functions.h"

using namespace std;

int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

int max(int a, int b){
  if (a > b) return a;
  else return b;
} 

 //Miért nem fordul????
vector <vector<int> > 
generate_matrix(int n, int m, wander* w){
  vector<vector<int> > matrix = vector<vector<int> >();
  point p = w->get_position();
  for (int i = 0; i < n; i++){
    vector<int> v = vector<int>();
    for (int j = 0; j < m; j++){
       if ((i == p.x) && (j == p.y)){
         v.push_back(1);
       }
       else {
         v.push_back(0);
       }
    }
    matrix.push_back(v);
  }
  return matrix;
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
 
    int width = screen->w;
    int height = screen->h; 
    int maxSize = min(width/5, height/5);
    int minSize = maxSize/5;
    int cellSize = 10;
    const int colorMaxValue = 255;
    const int half = colorMaxValue/2;
    const int state_number = 2;
    int t = 0;
    int d = maxSize*2;
    int x = 0;
    int y = 0;
    int dist = 20;
    // Itt rajzolj
    srand(time(NULL));
    int n = width/cellSize;
    int m = height/cellSize;
    int vx = rand();
    int vy = rand();
    int x1 = vx % n;
    int y1 = vy % m;
    point p;
    p.x = x1;
    p.y = y1;
    wander* wander0 = new wander(n, m, p);
    int ny = max(n, m);
    vector<vector<int> > cell_matrix = generate_matrix(n, m, wander0);
    
    color col = generate_color(colorMaxValue);

    while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT && ev.type != SDL_KEYDOWN){
       if (ev.type == SDL_KEYDOWN)
         {
           //Ez miért nem működik??
          //SDLKey keyPressed = ev.key.keysym.sym; 
          cout << "Billentyű észlelve." << endl;
          SDL_Quit();
        }
      else if (ev.type == SDL_MOUSEBUTTONDOWN)
         {
           //Ez miért nem működik??
          //SDLKey keyPressed = ev.key.keysym.sym; 
          cout << "Egér észlelve." << endl;
          SDL_Quit();
        }
        

        for (int i = 0; i < n; i++){
          for (int j = 0; j < m; j++){
            Sint16 x1 = i*cellSize + 1;
            Sint16 y1 = j*cellSize + 1;  
            Sint16 x2 = (i+1)*cellSize;
            Sint16 y2 = (j+1)*cellSize; 
 
            // state_number == 2
            if ((cell_matrix.at(i)).at(j) == 1)
              boxRGBA(screen, x1, y1, x2, y2,
              col.red, col.green, col.blue, col.alpha);
            else if ((cell_matrix.at(i)).at(j) == 0)
              boxRGBA(screen, x1, y1, x2, y2,
              0, 0, 0, colorMaxValue);            
          }
        }
        wander0->go();
        cell_matrix = generate_matrix(n, m, wander0);

        t = t+1;
        
      
    
    
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
         
    
     

        
        
    }
 
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}