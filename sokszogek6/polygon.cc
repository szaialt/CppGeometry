#include "polygon.h"

using namespace std;

Polygon::Polygon(int maxSide, int degrees, int t0){
  int n = rand() % (maxSide - 3) + 3;
  int alpha = rand() % degrees;
  this->n = n;
  this->alpha = alpha;
  this->degrees = degrees;
  this->birth_time = t0;
}

Polygon::Polygon(int n, int alpha, int degrees, int birth_time){
  this->n = n;
  this->alpha = alpha;
  this->degrees = degrees;
  this->birth_time = birth_time;
}

vector<point> Polygon::polygon(int t, int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  int degrees = 360;
  int r = (t - birth_time)*10;
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

void Polygon::draw(SDL_Surface *screen, point p, int t, color col){
  int x = p.x;
  int y = p.y;
  int width = screen->w;
  int height = screen->h; 
  int maxSize = min(width/5, height/5);
  int minSize = maxSize/5;
  int d = minSize + rand() % maxSize;
 
  vector<point> points = polygon(t);
  Sint16 xs[n];
  Sint16 ys[n];
  for (int i = 0; i < n; i++){
    Sint16 xr = points.at(i).x % width + x;
    Sint16 yr = points.at(i).y % height + y;
    xs[i] = xr;
    ys[i] = yr;
   }
  filledPolygonRGBA(screen, xs, ys, n, col.red, col.green, col.blue, 128);
  
  /* eddig elvegzett rajzolasok a kepernyore */
  SDL_Flip(screen);
}