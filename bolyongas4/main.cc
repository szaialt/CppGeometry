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
#include <thread>
#include <mutex>              // std::mutex, std::unique_lock
#include "wander.h"
#include "barrier.h"

using namespace std;

std::condition_variable cv;
std::mutex mtx;
const int thread_number = 24; // kell: legalább ennyi színt generálni 
//a generate_colors függvényben
//Barrier* barrier = new Barrier(thread_number+1);
vector<wander*> wanders;
vector<bool> flags;

int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

int max(int a, int b){
  if (a > b) return a;
  else return b;
} 

vector<color> generate_colors(int colorMaxValue){
  vector<color> colors;
  color col;
    //fehér
    col.red = colorMaxValue;
    col.green = colorMaxValue;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //rózsaszín
    col.red = colorMaxValue;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue/2;  
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //világoskék
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //piros
    col.red = colorMaxValue;
    col.green = 0;
    col.blue = 0;  
    col.alpha = colorMaxValue;
  colors.push_back(col);
     //sárga
    col.red = colorMaxValue;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //lila
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/4;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  colors.push_back(col);
     //zöld
    col.red = 0;
    col.green = colorMaxValue/2;
    col.blue = 0;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //bordó
    col.red = colorMaxValue/2;
    col.green = 0;
    col.blue = 0;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //kék
    col.red = 0;
    col.green = 0;
    col.blue = colorMaxValue;      
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //narancssárga
    col.red = colorMaxValue;
    col.green = colorMaxValue/2;
    col.blue = 0;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //narancssárga
    col.red = colorMaxValue;
    col.green = colorMaxValue/4;
    col.blue = 0;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //lila
    col.red = colorMaxValue/4;
    col.green = 0;
    col.blue = colorMaxValue/2;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //kék
    col.red = colorMaxValue/4;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  colors.push_back(col);
     //zöld
    col.red = 0;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  colors.push_back(col);
     //sárgászöld
    col.red = colorMaxValue/3;
    col.green = colorMaxValue;
    col.blue = 0;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //bíbor
    col.red = colorMaxValue/2;
    col.green = 0;
    col.blue = colorMaxValue/4;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //kékeszöld
    col.red = 0;
    col.green = colorMaxValue/2;
    col.blue = colorMaxValue/2;      
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //sötétkék
    col.red = 0;
    col.green = 0;
    col.blue = colorMaxValue/2;      
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //kékeslila
    col.red = colorMaxValue/4;
    col.green = 0;
    col.blue = colorMaxValue/2;      
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //rózsaszín
    col.red = colorMaxValue;
    col.green = colorMaxValue/3;
    col.blue = colorMaxValue/3;  
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //piros
    col.red = colorMaxValue;
    col.green = 0;
    col.blue = colorMaxValue/16;  
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //lila
    col.red = colorMaxValue/3;
    col.green = colorMaxValue/16;
    col.blue = colorMaxValue;
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //barna
    col.red = colorMaxValue/2;
    col.green = colorMaxValue/4;
    col.blue = colorMaxValue/4;  
    col.alpha = colorMaxValue;
  colors.push_back(col);
    //rózsaszín
    col.red = colorMaxValue;
    col.green = 0;
    col.blue = colorMaxValue/4;
    col.alpha = colorMaxValue;
  colors.push_back(col);

  return colors;    
}

vector <vector<int> > 
generate_null_matrix(int n, int m){
  vector<vector<int> > matrix = vector<vector<int> >();
  for (int i = 0; i < n; i++){
    vector<int> v = vector<int>();
    for (int j = 0; j < m; j++){
      v.push_back(0);
    }
    matrix.push_back(v);
  }
  return matrix;
} 

 //Miért nem fordul????
vector <vector<int> > 
generate_matrix(int n, int m, vector<wander*> wanders){
  vector<vector<int> > matrix = generate_null_matrix(n, m);
  for (int i = 0; i < wanders.size(); i++){
    point p = wanders.at(i)->get_position();
    matrix.at(p.x).at(p.y) = i+1;
  }
  return matrix;
} 
  
void call_from_thread(SDL_Event ev, wander* wander0, int tid, int n, int m) {
 // std::unique_lock<std::mutex> lck(mtx);
 // cout << tid<< endl;
  sleep( 1.5 ); 
  while (flags.at(tid)){
   // mtx.lock();
    wander0->go();
    wanders.at(tid) = wander0;
    point p = wander0->get_position();
    cout << "(" << p.x << ", " << p.y << ")" << endl;
    //barrier->Wait();
   // mtx.unlock();
   cv.notify_all();
   sleep( 0.5 ); 
  }
 // cv.wait(lck);
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
    int d = maxSize*2;
    int x = 0;
    int y = 0;
    int dist = 20;
    // Itt rajzolj
    srand(time(NULL));
    const int n = width/cellSize;
    const int m = height/cellSize;
    
    vector<color> colors = generate_colors(colorMaxValue);
    int index = rand() % thread_number;
    color col = colors.at(index);

    vector<point> points;
    for (int i = 0; i < thread_number; i++){
      int vx = rand();
      int vy = rand();
      int x2 = vx % n;
      int y2 = vy % m;
      point p;
      p.x = x2;
      p.y = y2; 
      points.push_back(p);
    }
    
    //vector<wander*> wanders;
    
    for (int i = 0; i < thread_number; i++){
      wander* wander0 = new wander(n, m, points.at(i));
      wanders.push_back(wander0);
    }
        
    vector<vector<int> > cell_matrix = generate_matrix(n, m, wanders);        

    for (int i = 0; i < thread_number; i++){
      flags.push_back(true);
    }
    
    std::thread t[thread_number];

    //Launch a group of threads
    for (int i = 0; i < colors.size(); ++i) {
      t[i] = std::thread(call_from_thread, ev, wanders.at(i), i, n, m);
    }

    
    
    while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT && ev.type != SDL_KEYDOWN){
    mtx.lock();

        for (int i = 0; i < n; i++){
          for (int j = 0; j < m; j++){
            Sint16 x1 = i*cellSize + 1;
            Sint16 y1 = j*cellSize + 1;  
            Sint16 x2 = (i+1)*cellSize;
            Sint16 y2 = (j+1)*cellSize; 
            int color_num = cell_matrix.at(i).at(j);
            if (color_num == 0){
             boxRGBA(screen, x1, y1, x2, y2,
              0, 0, 0, colorMaxValue);   
            }
            else {
              color col = colors.at(color_num - 1);
              boxRGBA(screen, x1, y1, x2, y2,
              col.red, col.green, col.blue, col.alpha);
            }
                 
          }
        }        
      
    
    
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     mtx.unlock();

     //cv.notify_all();

     sleep( 1 ); 
    
      //   barrier->Wait();



    }
 

           //Join the threads with the main thread
 /*     for (int i = 0; i < colors.size(); ++i) {
        t[i].join();
    }        
        
 
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}