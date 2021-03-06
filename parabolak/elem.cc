#include "elem.h"

using namespace std;

Elem::Elem(int n, int alpha, int h, int p, int degrees, 
         point center, color col){
  this->n = n;
  this->alpha = alpha;
  this->h = h;
  this->degrees = degrees;
  this->center = center;
  this->col = col;

}

vector<point> Elem::elem(int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  double degrees_to_rads = 2 * M_PI / degrees ;
  int d = 2*h/n;
  int delta = alpha/degrees;
  int u = center.x;
  int v = center.y;
  int x = -h*this->p;
  vector<point> points = vector<point>();
  for (int i = 0; i < n; i++){
    int y = x * x;
    x=((x-u)*cos(degrees_to_rads * i * delta)+
         (y-v)*sin(degrees_to_rads * i * delta))+u+dx;
    y=((x-u)*sin(degrees_to_rads * i * delta)-
         (y-v)*cos(degrees_to_rads * i * delta))+v+dy;
    point p;
    p.x = x;
    p.y = y;
    points.push_back(p);
    int x = x + d * this->p;

  }
  return points;
} 

void Elem::draw(SDL_Surface *screen, int t, int dx, int dy){
 
  vector<point> points = elem(dx, dy);

  for (int i = 0; i < n; i++){
    filledCircleRGBA(screen, points.at(i).x, points.at(i).y, t, col.red, col.green, col.blue, col.alpha);
   }
  
  /* eddig elvegzett rajzolasok a kepernyore */
  SDL_Flip(screen);
}

Elem Elem::rotate(double u, double v, int delta){
  int alpha_ = alpha + delta;
  point center_;
  int x = this->center.x;
  int y = this->center.y;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int x_=((x-u)*cos(degrees_to_rads * delta)+(y-v)*sin(degrees_to_rads * delta))+u;
  int y_=((x-u)*sin(degrees_to_rads * delta)-(y-v)*cos(degrees_to_rads * delta))+v; 
  center_.x = x_;
  center_.y = y_;
  Elem el = Elem(n, alpha_, h, p, degrees, center_, col);
  return el;
}

Elem Elem::mirror_horizontal(int he){
  point a_;
  int x = this->center.x;
  int y = this->center.y;
  int y_ = he - y;
  a_.x = x;
  a_.y = y_;
  Elem pol = Elem(n, -alpha, h, p, degrees, a_, col);
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
  Elem pol = Elem(n, -alpha, h, p, degrees, a_, col_);
  return pol;
}

color Elem::getColor(){
  return this->col;
}

void Elem::setColor(color col){
  this->col = col;
}