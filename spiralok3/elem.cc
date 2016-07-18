#include "elem.h"

using namespace std;

Elem::Elem(int n, int alpha, int b, int begin, int end, int degrees, int R,
         point center, color col){
  this->n = n;
  this->alpha = alpha;
  this->b = b;
  this->begin = begin;
  this->end = end;
  this->degrees = degrees;
  this->R = R;
  this->center = center;
  this->col = col;

}

vector<point> Elem::elem(int dx, int dy){
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = (end - begin)/n;
  int phi = alpha;
  vector<point> points = vector<point>();
  for (int i = 0; i <= n; i++){
    int x = center.x + (alpha + b * delta) * cos(degrees_to_rads * phi) + dx;
    int y = center.y + (alpha + b * delta) * sin(degrees_to_rads * phi) + dy;
    point p;
    p.x = x;
    p.y = y;
    points.push_back(p);
    phi = phi + delta;
  }
  return points;
} 

void Elem::draw(SDL_Surface *screen, int t){
 
  vector<point> points = elem(t);

  for (int i = 0; i < n; i++){
    filledCircleRGBA(screen, points.at(i).x, points.at(i).y, t, col.red, col.green, col.blue, col.alpha);
   }
  
  /* eddig elvegzett rajzolasok a kepernyore */
  SDL_Flip(screen);
}

Elem Elem::rotate(double u, double v, int delta){
  point center_;
  int x = this->center.x;
  int y = this->center.y;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int x_=((x-u)*cos(degrees_to_rads * delta)+(y-v)*sin(degrees_to_rads * delta))+u;
  int y_=((x-u)*sin(degrees_to_rads * delta)-(y-v)*cos(degrees_to_rads * delta))+v; 
  center_.x = x_;
  center_.y = y_;
  //Ezzel az alphával kellene csinálni valamit
  //delta elosztása (x+y-u-v)-vel eltolás
  //delta/2 vízszintes eltoltakat eredményez
  Elem el = Elem(n, alpha+delta*R, b, begin+delta, end+delta, degrees, R, center_, col);
  return el;
}

Elem Elem::mirror_horizontal(int h){
  point a_;
  int x = this->center.x;
  int y = this->center.y;
  int y_ = h - y;
  a_.x = x;
  a_.y = y_;
  Elem pol = Elem(n, -alpha, b, begin, end, degrees, R, a_, col);
  return pol;
}
  
    
Elem Elem::mirror_vertical(int w){
  point a_;
  int x = this->center.x;
  int y = this->center.y;
  int x_ = w - x;
  a_.x = x_;
  a_.y = y;
  color col_ = this->col;
  Elem pol = Elem(n, -alpha, b, begin, end, degrees, R, a_, col_);
  return pol;
}

color Elem::getColor(){
  return this->col;
}

void Elem::setColor(color col){
  this->col = col;
}