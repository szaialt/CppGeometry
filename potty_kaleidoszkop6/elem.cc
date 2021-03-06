#include "elem.h"

using namespace std;

Elem::Elem(int n, int a, int b, int alpha, int beta, 
           int direction, int degrees, point center, 
         color col){
  this->n = n;
  this->a = a;
  this->b = b;
  this->alpha = alpha;
  this->beta = beta;
  this->direction = direction;
  this->degrees = degrees;
  this->center = center;
  this->col = col;

}

//Az elforgatottak különböző részeket vesznek az ellipszisből
vector<point> Elem::elem(int dx, int dy){
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = (beta - alpha)/n;
  int phi = alpha;
  vector<point> points = vector<point>();
  for (int i = 0; i <= n; i++){
    int x = center.x + this->a * cos(degrees_to_rads * phi); +
         this->a * cos(degrees_to_rads * direction) + dx;
    int y = center.y + this->b * sin(degrees_to_rads * phi); + 
         this->b * sin(degrees_to_rads * direction) + dy;
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
    filledCircleRGBA(screen, points.at(i).x, points.at(i).y, t, col.red, 
                     col.green, col.blue, col.alpha);
   }
  
  /* eddig elvegzett rajzolasok a kepernyore */
  SDL_Flip(screen);
}

Elem Elem::rotate(double u, double v, int delta){
  int alpha_ = alpha + delta;
  int beta_ = beta + delta;
  point center_;
  int x = this->center.x;
  int y = this->center.y;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int x_=((x-u)*cos(degrees_to_rads * delta)+
  (y-v)*sin(degrees_to_rads * delta))+u;
  int y_=((x-u)*sin(degrees_to_rads * delta)-
  (y-v)*cos(degrees_to_rads * delta))+v; 
  center_.x = x_;
  center_.y = y_;
  Elem el = Elem(n, this->a, this->b, this->direction + delta, alpha_, 
                 beta_, degrees, center_, col);
  return el;
}

Elem Elem::mirror_horizontal(int h){
  point a_;
  int x = this->center.x;
  int y = this->center.y;
  int y_ = h - y;
  a_.x = x;
  a_.y = y_;
  Elem pol = Elem(n, this->a, this->b, -alpha, -beta, direction, 
                  degrees, a_, col);
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
  Elem pol = Elem(n, this->a, this->b, -alpha, -beta, direction, degrees, a_, col_);
  return pol;
}

color Elem::getColor(){
  return this->col;
}

void Elem::setColor(color col){
  this->col = col;
}