#include "polygon.h"

using namespace std;

Polygon::Polygon(int n, int alpha, int degrees, point p, color col){
  this->n = n;
  this->alpha = alpha;
  this->degrees = degrees;
  this->center = p;
  this->col = col;

}

vector<point> Polygon::polygon(int t, int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  int r = t;
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

void Polygon::draw(SDL_Surface *screen, int t){
  int x = center.x;
  int y = center.y;
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
  filledPolygonRGBA(screen, xs, ys, n, col.red, col.green, col.blue, col.alpha);
  
  /* eddig elvegzett rajzolasok a kepernyore */
  SDL_Flip(screen);
}

Polygon Polygon::rotate(int u, int v, int delta){
  int n_ = this->n;
  int alpha_ = this->alpha + delta;
  int degrees_ = this->degrees;
  point center_;
  int x = this->center.x;
  int y = this->center.y;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int x_=((x-u)*cos(degrees_to_rads * delta)+(y-v)*sin(degrees_to_rads * delta))+u;
  int y_=((x-u)*sin(degrees_to_rads * delta)-(y-v)*cos(degrees_to_rads * delta))+v; 
  center_.x = x_;
  center_.y = y_;
  color col_ = this->col;
  Polygon pol = Polygon(n_, alpha_, degrees_, center_, col_);
  return pol;
}

Polygon Polygon::mirror(int width){
  int wh = width/2;
  int n_ = this->n;
  int alpha_ = this->alpha;
  int degrees_ = this->degrees;
  point center_;
  int x = this->center.x;
  int y = this->center.y;
  int x_ = width - x;
  int y_ = y;
  center_.x = x_;
  center_.y = y_;
  color col_ = this->col;
  Polygon pol = Polygon(n_, alpha_, degrees_, center_, col_);
  return pol;  
}

color Polygon::getColor(){
  return this->col;
}

void Polygon::setColor(color col){
  this->col = col;
}