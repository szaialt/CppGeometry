#include "elem.h"

using namespace std;

Elem::Elem(int n, point a, point b, color col, int flag){
  this->n = n;
  this->a = a;
  this->b = b;
  this->col = col;
  this->flag = flag;
}

vector<point> Elem::elem(int t, int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  int r = t;
  int degrees = 360;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = degrees/n;
  int x_step = (a.x - b.x)/n;
  int y_step = (a.y - b.y)/n;
  vector<point> points = vector<point>();
  points.push_back(a);
  int x = a.x;
  int y = a.y;
  for (int i = 1; i < n; i++){
    x = x + x_step;
    y = y + y_step;
    point p;
    p.x = x;
    p.y = y;
    points.push_back(p);
  }
  return points;
} 

void Elem::Elem::draw(SDL_Surface *screen, int t){
 
  vector<point> points = elem(t);
  if (flag < n){
  //for (int i = 0; i < n; i++){
    filledCircleRGBA(screen, points.at(flag).x, points.at(flag).y, t, col.red, col.green, col.blue, col.alpha);
    SDL_Flip(screen);
    flag = flag + 1;
  }
  
  /* eddig elvegzett rajzolasok a kepernyore */
}

Elem Elem::rotate(int u, int v, int delta){
  int degrees = 360;
  int n_ = this->n;
  point a_;
  int x = this->a.x;
  int y = this->a.y;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int x_=((x-u)*cos(degrees_to_rads * delta)+(y-v)*sin(degrees_to_rads * delta))+u;
  int y_=((x-u)*sin(degrees_to_rads * delta)-(y-v)*cos(degrees_to_rads * delta))+v; 
  a_.x = x_;
  a_.y = y_;
  x = this->b.x;
  y = this->b.y;
  x_=((x-u)*cos(degrees_to_rads * delta)+(y-v)*sin(degrees_to_rads * delta))+u;
  y_=((x-u)*sin(degrees_to_rads * delta)-(y-v)*cos(degrees_to_rads * delta))+v; 
  point b_;
  b_.x = x_;
  b_.y = y_;
  color col_ = this->col;
  Elem el = Elem(n_, a_, b_, col_);
  return el;
}

Elem Elem::mirror_horizontal(int h){
  int n_ = this->n;
  point a_;
  int x = this->a.x;
  int y = this->a.y;
  int y_ = h - y;
  a_.x = x;
  a_.y = y_;
  x = this->b.x;
  y = this->b.y;
  y_ = h - y;
  point b_;
  b_.x = x;
  b_.y = y_;
  color col_ = this->col;
  Elem pol = Elem(n_, a_, b_, col_);
  return pol;
}
  
    
Elem Elem::mirror_vertical(int w){
  int n_ = this->n;
  point a_;
  int x = this->a.x;
  int y = this->a.y;
  int x_ = w - x;
  a_.x = x_;
  a_.y = y;
  x = this->b.x;
  y = this->b.y;
  x_ = w - x;
  point b_;
  b_.x = x_;
  b_.y = y;
  color col_ = this->col;
  Elem pol = Elem(n_, a_, b_, col_);
  return pol;
}

color Elem::getColor(){
  return this->col;
}

void Elem::setColor(color col){
  this->col = col;
}

int Elem::getFlag(){
  return this->flag;
}

void Elem::setFlag(int flag){
  this->flag = flag;
}

void Elem::incrFlag(){
  this->flag++;
}