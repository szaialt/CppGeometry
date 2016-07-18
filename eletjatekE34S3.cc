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

using namespace std;

typedef struct color {
  int red;
  int green;
  int blue;
  int alpha;
} color;

typedef struct point {
  int x;
  int y;
} point;

int min(int a, int b){
  if (a < b) return a;
  else return b;
} 

int approximately(int x, int y, int d) {
  if (((x-y) < d) || ((y-x) < d)) return 0;
  else return 1;
}
 
 //Miért nem fordul????
vector <vector<int> > 
generate_matrix(int n, int m, double probability){
  vector<vector<int> > matrix = vector<vector<int> >();
  
  for (int i = 0; i < n; i++){
    vector<int> v = vector<int>();
    for (int j = 0; j < m; j++){
       double r = static_cast <double> (rand()) / static_cast <double> (RAND_MAX);
       if (r < probability){
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
 
int neightbours_number(vector<vector<int> > matrix, int i, int j){
  int l = 0;
  int m = (matrix.at(0)).size();
  int n = matrix.size();
  if ((i > 0) && (i < n-1) && (j > 0) && (j < m-1)){
    for (int ii = i-1; ii < i+2; ii++){
      for (int jj = j-1; jj < j+2; jj++){
        if ((ii != i) || (jj != j)){
          l = l + (matrix.at(ii)).at(jj);
        }
      }  
    }
  }
  //Tórusz
  else if ((i == 0) && (j > 0) && (j < m-1)){
    l = l + (matrix.at(0)).at(j-1);
    l = l + (matrix.at(0)).at(j+1);
    l = l + (matrix.at(1)).at(j-1);
    l = l + (matrix.at(1)).at(j);
    l = l + (matrix.at(1)).at(j+1);
    l = l + (matrix.at(n-1)).at(j-1);
    l = l + (matrix.at(n-1)).at(j);
    l = l + (matrix.at(n-1)).at(j+1);
  }
  else if ((i == n-1) && (j > 0) && (j < m-1)){
    l = l + (matrix.at(n-1)).at(j-1);
    l = l + (matrix.at(n-1)).at(j+1);
    l = l + (matrix.at(n-2)).at(j-1);
    l = l + (matrix.at(n-2)).at(j);
    l = l + (matrix.at(n-2)).at(j+1);
    l = l + (matrix.at(0)).at(j-1);
    l = l + (matrix.at(0)).at(j);
    l = l + (matrix.at(0)).at(j+1);  
  }
  else if ((i > 0) && (i < n-1) && (j == 0)){
    l = l + (matrix.at(i-1)).at(0);
    l = l + (matrix.at(i+1)).at(0);
    l = l + (matrix.at(i-1)).at(1);
    l = l + (matrix.at(i)).at(1);  
    l = l + (matrix.at(i+1)).at(1); 
    l = l + (matrix.at(i-1)).at(m-1);
    l = l + (matrix.at(i)).at(m-1);  
    l = l + (matrix.at(i+1)).at(m-1);  
  }
  else if ((i > 0) && (i < n-1) && (j == m-1)){
    l = l + (matrix.at(i-1)).at(m-1);
    l = l + (matrix.at(i+1)).at(m-1);
    l = l + (matrix.at(i-1)).at(m-2);
    l = l + (matrix.at(i)).at(m-2);  
    l = l + (matrix.at(i+1)).at(m-2); 
    l = l + (matrix.at(i-1)).at(0);
    l = l + (matrix.at(i)).at(0);  
    l = l + (matrix.at(i+1)).at(0);    
  }
  else if ((i == 0) && (j == 0)){
    l = l + (matrix.at(0)).at(1);
    l = l + (matrix.at(1)).at(1);
    l = l + (matrix.at(1)).at(0);
    l = l + (matrix.at(n-1)).at(1);
    l = l + (matrix.at(n-1)).at(0);
    l = l + (matrix.at(0)).at(m-1);
    l = l + (matrix.at(1)).at(m-1);
    l = l + (matrix.at(n-1)).at(m-1);    
  }
  else if ((i == 0) && (j == m-1)){
    l = l + (matrix.at(0)).at(m-2);
    l = l + (matrix.at(1)).at(m-2);
    l = l + (matrix.at(1)).at(m-1);
    l = l + (matrix.at(n-1)).at(m-1);    
    l = l + (matrix.at(n-1)).at(0);    
    l = l + (matrix.at(0)).at(0);
    l = l + (matrix.at(n-1)).at(m-2);        
    l = l + (matrix.at(1)).at(0);
  
  }
  else if ((i == n-1) && (j == 0)){
    l = l + (matrix.at(n-1)).at(1);
    l = l + (matrix.at(n-2)).at(1);
    l = l + (matrix.at(n-2)).at(0);
    l = l + (matrix.at(0)).at(0);    
    l = l + (matrix.at(0)).at(m-1);    
    l = l + (matrix.at(n-1)).at(m-1);
    l = l + (matrix.at(0)).at(1);        
    l = l + (matrix.at(n-2)).at(m-1);  
  }
  else if ((i == n-1) && (j == m-1)){
    l = l + (matrix.at(n-2)).at(m-1);
    l = l + (matrix.at(n-2)).at(m-2);
    l = l + (matrix.at(n-1)).at(m-2);
    l = l + (matrix.at(n-2)).at(0);
    l = l + (matrix.at(n-1)).at(0);
    l = l + (matrix.at(0)).at(m-1);
    l = l + (matrix.at(0)).at(m-2);
    l = l + (matrix.at(0)).at(0);
  }
  else cerr << "False." << endl;
  return l;
} 
 
int live(vector<vector<int> > matrix, int i, int j){
  //Él-hal szabály
  int n = neightbours_number(matrix, i, j);
  if ((matrix.at(i)).at(j) == 0){
    if (n == 3) return 1;
    return 0;
  }
  else if ((matrix.at(i)).at(j) == 1){
    if (n == 3) return 1;
    if (n == 4) return 1;
    return 0;
  }
  else {
    return 1;
  }
} 
 
vector<vector<int> > new_matrix(vector<vector<int> > cell_matrix){
  vector<vector<int> > matrix;
  int m = (cell_matrix.at(0)).size();
  int n = cell_matrix.size();
  for (int i = 0; i < n; i++){
    vector<int> v = vector<int>();
    for (int j = 0; j < m; j++){
       v.push_back(live(cell_matrix, i, j));              
    }
    matrix.push_back(v);
  }
  return matrix;
}

color generate_light(int colorMaxValue){
     const int coldist = 30;
     const int half = colorMaxValue/2;
     int red =  rand() / colorMaxValue;
     int green =  rand() / colorMaxValue;
     int blue =  rand() / colorMaxValue;
     
     if ((approximately(red, green, coldist) == 0) && 
       (approximately(blue, green, coldist) == 0) && 
       (approximately(red, blue, coldist) == 0)){
       int r = red;
       int g = green;
       int b = blue;
        if (approximately(r, g, coldist) == 0) {
           if (r > g) 
             red = (r + coldist) % colorMaxValue;
           if (red < green) 
             red = (r - coldist) % colorMaxValue;
      }
      if (approximately(g, b, coldist) == 0) {
           if (g > b) 
             green = (g + coldist) % colorMaxValue;
           if (green < blue) 
             green = (g - coldist) % colorMaxValue;    
      }        
      if  (approximately(b, r, coldist) == 0) {
           if (b > r) 
             blue = (b + coldist) % colorMaxValue;
           if (blue < red) 
             blue = (b - coldist) % colorMaxValue;    
      }
    }
     if (red < half) red = red + half;
     if (green < half) green = green + half;
     if (blue < half) blue = blue + half;
  color col;
  col.red = red;
  col.green = green;
  col.blue = blue;
  int alpha = colorMaxValue;
  col.alpha = alpha;
  return col;     
}

color generate_color(int colorMaxValue){
     const int coldist = 30;
     int red =  rand() / colorMaxValue;
     int green =  rand() / colorMaxValue;
     int blue =  rand() / colorMaxValue;
     //I wish brigth colours
     if (((approximately(red, colorMaxValue/2, coldist) == 0) && 
       (approximately(blue, colorMaxValue/2, coldist) == 0) && 
       (approximately(green, colorMaxValue/2, coldist) == 0))){
         if (red > colorMaxValue/2) 
           red = (red + coldist) % colorMaxValue;
         if (red < colorMaxValue/2) 
           red = (red - coldist) % colorMaxValue;
         if (green > colorMaxValue/2) 
           green = (green + coldist) % colorMaxValue;
         if (green < colorMaxValue/2) 
           green = (green - coldist) % colorMaxValue;
         if (blue > colorMaxValue/2) 
           blue = (blue + coldist) % colorMaxValue;
         if (blue < colorMaxValue/2) 
           blue = (blue - coldist) % colorMaxValue;
     }
     //I hate grey
     if ((approximately(red, green, coldist) == 0) && 
       (approximately(blue, green, coldist) == 0) && 
       (approximately(red, blue, coldist) == 0)){
       int r = red;
       int g = green;
       int b = blue;
        if (approximately(r, g, coldist) == 0) {
           if (r > g) 
             red = (r + coldist) % colorMaxValue;
           if (red < green) 
             red = (r - coldist) % colorMaxValue;
      }
      if (approximately(g, b, coldist) == 0) {
           if (g > b) 
             green = (g + coldist) % colorMaxValue;
           if (green < blue) 
             green = (g - coldist) % colorMaxValue;    
      }        
      if  (approximately(b, r, coldist) == 0) {
           if (b > r) 
             blue = (b + coldist) % colorMaxValue;
           if (blue < red) 
             blue = (b - coldist) % colorMaxValue;    
      }
  


  }
  if (red < 0) red = colorMaxValue + red;
  if (green < 0) green = colorMaxValue + green;
  if (blue < 0) blue = colorMaxValue + blue;
  
  color col;
  col.red = red;
  col.green = green;
  col.blue = blue;
  int alpha = colorMaxValue;
  col.alpha = alpha;
  return col;
}
 
color generate_dark(int colorMaxValue){
  color col = generate_color(colorMaxValue);
  int dist = 20;
  int half = colorMaxValue/2;
  if ((col.red > half) && (col.green > half) && (col.blue > half)){
      //I still hate grey
    if (approximately(col.red, col.green, dist) == 0){
      col.red = col.red - half;
      col.green = col.green - half;
    }
    else if (approximately(col.blue, col.green, dist) == 0){
      col.green = col.green - half;
      col.blue = col.blue - half;
    }
    else if (approximately(col.blue, col.red, dist) == 0){
      col.red = col.red - half;
      col.blue = col.blue - half;
    }
    else if ((col.red > col.green) && (col.red > col.blue)){
      col.red = col.red - half;
    }
    else if ((col.green > col.red) && (col.green > col.blue)){
      col.green = col.green - half;
    }
    else if ((col.blue > col.green) && (col.blue > col.red)){
      col.blue = col.blue - half;
    }

    else{
    int wt = rand() % 6;
    if (wt < 0){
       wt = wt + 6;
    }
    if (wt == 0){
       col.red = col.red - half;
     }
     else if (wt == 1){
       col.green = col.green - half;
     }
     else if (wt == 2){
       col.blue = col.blue - half;
     }
     else if (wt == 3){
       col.red = col.red - half;
       col.green = col.green - half;
     }
     else if (wt == 4){
       col.green = col.green - half;
       col.blue = col.blue - half;
     }
     else if (wt == 5){
       col.blue = col.blue - half;
       col.red = col.red - half;
     }
    }
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
    double probability = 0.3;
    vector<vector<int> > cell_matrix = generate_matrix(n,m,probability);
    
    color col1 = generate_light(colorMaxValue);
    color col2 = generate_dark(colorMaxValue);

     int v = rand() % state_number; 

    
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
            if ((cell_matrix.at(i)).at(j) == v)
              boxRGBA(screen, x1, y1, x2, y2,
              col2.red, col2.green, col2.blue, col2.alpha);
            else if ((cell_matrix.at(i)).at(j) == 1-v)
              boxRGBA(screen, x1, y1, x2, y2,
              col1.red, col1.green, col1.blue, col1.alpha);            
          }
        }
        
      int delt = 100;
      int del = rand() % delt;
      if (delt == 0){
        cell_matrix = generate_matrix(n,m,probability);
        color col1 = generate_light(colorMaxValue);
        color col2 = generate_dark(colorMaxValue);
        int v = rand() % state_number; 
      }
      else {
        cell_matrix = new_matrix(cell_matrix);
       }
    
     /* eddig elvegzett rajzolasok a kepernyore */
     SDL_Flip(screen);
     
//     sleep( 1 ); 
    
    
     

        
        
    }
 
    /* ablak bezarasa */
    SDL_Quit();
 
    return 0;
}