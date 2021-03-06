#include "polygon.h"

using namespace std;

Polygon::Polygon(int maxSide, int degrees, int t0, int height, int width, int maxColor){
  int n = rand() % (maxSide - 3) + 3;
  int alpha = rand() % degrees;
  this->n = n;
  this->alpha = alpha;
  this->degrees = degrees;
  this->birth_time = t0;
  int vx = rand();
  int vy = rand();
  int x = vx % width;
  int y = vy % height;
  point p;
  p.x = x;
  p.y = y;
  this->center = p;
  this->col = generate_color(maxColor);
}

Polygon::Polygon(int n, int alpha, int degrees, int birth_time, point p, color col){
  this->n = n;
  this->alpha = alpha;
  this->degrees = degrees;
  this->birth_time = birth_time;
  this->center = p;
  this->col = col;
}

int Polygon::approximately(int x, int y, int d) {
  if (((x-y) < d) || ((y-x) < d)) return 0;
  else return 1;
} 
 
color Polygon::generate_color(int colorMaxValue){
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
  alpha = 255;
  col.alpha = alpha;
  return col;
}


vector<point> Polygon::polygon(int r, int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = degrees/n;
  int phi = alpha;
  vector<point> points = vector<point>();
  for (int i = 0; i < n; i++){
    int x = r * cos(degrees_to_rads * phi) + dx;
    int y = r * sin(degrees_to_rads * phi) + dy;
    point p;
    p.x = x;
    p.y = y;
    points.push_back(p);
    phi = phi + delta;
  }
  return points;
} 

vector<point> Polygon::star(int r, int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = degrees/n/2;
  int phi = alpha;
  vector<point> points = vector<point>();
  for (int i = 0; i < 2*n; i++){
    int x;
    int y;
    if (i % 2 == 0){
      x = r * cos(degrees_to_rads * phi) + dx;
      y = r * sin(degrees_to_rads * phi) + dy;
    }
    else {
      x = r/2 * cos(degrees_to_rads * phi) + dx;
      y = r/2 * sin(degrees_to_rads * phi) + dy;    
    }
    point p;
    p.x = x;
    p.y = y;
    points.push_back(p);
    phi = phi + delta;
  }
  return points;
} 

void Polygon::draw_polygon(SDL_Surface *screen, int r){
  int x = center.x;
  int y = center.y;
  int width = screen->w;
  int height = screen->h; 
  int maxSize = min(width/5, height/5);
  int minSize = maxSize/5;
  int d = minSize + rand() % maxSize;
 
  vector<point> points = polygon(r);
  Sint16 xs[n];
  Sint16 ys[n];
  for (int i = 0; i < n; i++){
    Sint16 xr = points.at(i).x % width + x;
    Sint16 yr = points.at(i).y % height + y;
    xs[i] = xr;
    ys[i] = yr;
   }
  filledPolygonRGBA(screen, xs, ys, n, col.red, col.green, col.blue, col.alpha);
  
  /* eddig elvegzett rajzolasok a kepernyore */
  SDL_Flip(screen);
}

void Polygon::draw_star(SDL_Surface *screen, int r){
  int x = center.x;
  int y = center.y;
  int width = screen->w;
  int height = screen->h; 
  int maxSize = min(width/5, height/5);
  int minSize = maxSize/5;
  int d = minSize + rand() % maxSize;
 
  vector<point> points = star(r);
  Sint16 xs[n];
  Sint16 ys[n];
  for (int i = 0; i < 2*n; i++){
    Sint16 xr = points.at(i).x % width + x;
    Sint16 yr = points.at(i).y % height + y;
    xs[i] = xr;
    ys[i] = yr;
   }
  filledPolygonRGBA(screen, xs, ys, n, col.red, col.green, col.blue, col.alpha);
  
  /* eddig elvegzett rajzolasok a kepernyore */
  SDL_Flip(screen);
}

color Polygon::getColor(){
  return this->col;
}

void Polygon::setColor(color col){
  this->col = col;
}