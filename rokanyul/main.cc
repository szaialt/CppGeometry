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

using namespace std;

//a lockhoz kellenek
//std::condition_variable cv;
//std::mutex mtx;
//a gyerek szálak száma
// kell: legalább ennyi színt generálni 
//a generate_colors függvényben
const int thread_number = 2; 
//Barrier* barrier = new Barrier(thread_number+1);
vector<wander*> wanders;
// szinkronizációhoz, a szálak leállításához
vector<bool> flags;
vector<bool> flags2;

//két szám minimuma
int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

//két szám maximuma
int max(int a, int b){
  if (a > b) return a;
  else return b;
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

//nullmátrix létrehozása (ezt utólag töltjük ki)
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

 //segédmátrix készítése a rajzoláshoz
vector <vector<int> > 
generate_matrix(int n, int m, vector<wander*> wanders){
  vector<vector<int> > matrix = generate_null_matrix(n, m);
  for (int i = 0; i < wanders.size(); i++){
    point p = wanders.at(i)->get_position();
    matrix.at(p.x).at(p.y) = i+1;
  }
  return matrix;
} 
  
void rabbit(wander* wander0, int n, int m) {
 // std::unique_lock<std::mutex> lck(mtx);
 // cout << tid<< endl;
  sleep( 1 ); 
  int tid = 0;
  while (flags.at(tid)){
    if (flags2.at(tid)) {
     // mtx.lock();
      wander0->go();
      wanders.at(tid) = wander0;
      point p = wander0->get_position();
      //cout << "(" << p.x << ", " << p.y << ")" << endl;
      //barrier->Wait();
      // mtx.unlock();
      //cv.notify_all();
      sleep( 1 ); 
    }
  }
 // cv.wait(lck);
} 

void wolf(wander* wander0, int n, int m) {
 // std::unique_lock<std::mutex> lck(mtx);
 // cout << tid<< endl;
  sleep( 1 ); 
  int tid = 1;
  while (flags.at(tid)){
    if (flags2.at(tid)) {
     // mtx.lock();
      wander0->go();
      wander0->go();
      wanders.at(tid) = wander0;
      point p = wander0->get_position();
      //cout << "(" << p.x << ", " << p.y << ")" << endl;
      //barrier->Wait();
      // mtx.unlock();
      //cv.notify_all();
      sleep( 1 ); 
    }
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
 
    int width = screen->w;  //az ablak szélessége
    int height = screen->h; //az ablak magassága
    int cellSize = 10;
    const int color_number = 24;
    const int colorMaxValue = 255; //az alapszínek maximális értéke
    // Itt rajzolj
    srand(time(NULL));
    const int n = width/cellSize; //a mátrix szélessége
    const int m = height/cellSize; //a mátrix magassága
    
    //cout << "Main: " << "(" << n  << ", " << m << ")" << endl;
    
    vector<color> colors;
    
    int rabbit_color_number = rand() % color_number;
    int wolf_color_number = rand() % color_number;
    
    if (rabbit_color_number == 0) rabbit_color_number = color_number;
    if (wolf_color_number == 0) wolf_color_number = color_number;

    colors.push_back(int_to_color(rabbit_color_number, colorMaxValue));
    colors.push_back(int_to_color(wolf_color_number, colorMaxValue));
    
    //a kiindulási pontok
    vector<point> points;
    for (int i = 0; i < thread_number; i++){
      int vx = rand();
      int vy = rand();
      int x2 = vx % n;
      int y2 = vy % m;
      //cout << "Main: " << "(" << x2  << ", " << y2 << ")" << endl;

      point p;
      p.x = x2;
      p.y = y2; 
      points.push_back(p);
    }
    
    //vector<wander*> wanders;
    
    //a vándorok
    for (int i = 0; i < thread_number; i++){
      wander* wander0 = new wander(n, m, points.at(i));
      wanders.push_back(wander0);
    }
        
     //a mátrix létrehozása  
    vector<vector<int> > cell_matrix = generate_matrix(n, m, wanders);        

    //a szinkronizációra és a szálak leállítására szolgáló flagek
    for (int i = 0; i < thread_number; i++){
      flags.push_back(true);
    }
    
    for (int i = 0; i < thread_number; i++){
      flags2.push_back(true);
    }    
    
    //a gyermek szálak
    std::thread t[thread_number];

    //a szálak elindítása
    t[0] = std::thread(rabbit, wanders.at(0), n, m);
    t[1] = std::thread(wolf, wanders.at(1), n, m);

    //Párhuzamosan kell futniuk, és a fő programnak kell rajzolnia
    //a szálak blokkolásával
    
    while (SDL_WaitEvent(&ev) && ev.type!=SDL_QUIT && ev.type != SDL_KEYDOWN){
     //szinkronizációs lépések
      //mtx.lock();
      cell_matrix = generate_matrix(n, m, wanders); 
        for (int i = 0; i < thread_number; i++){
          flags2.at(i) = false;
        }  
        //rajzolás
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
     //szinkronizációs lépések
     for (int i = 0; i < thread_number; i++){
       flags2.at(i) = true;
     }  
     //mtx.unlock();

     //cv.notify_all();

     sleep( 1 ); 
    
      //   barrier->Wait();



    }
 

           //Join the threads with the main thread
      for (int i = 0; i < colors.size(); ++i) {
        t[i].join();
    }        
        
 
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}