#include "elem.h"

using namespace std;

Elem::Elem(int n, int R, int alpha, int beta, int degrees, point center, 
         color col, int flag){
  this->n = n;
  this->R = R;
  this->alpha = alpha;
  this->beta = beta;
  this->degrees = degrees;
  this->center = center;
  this->col = col;
  this->flag = flag;

}

vector<point> Elem::elem(int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = (beta - alpha)/n;
  int phi = alpha;
  vector<point> points = vector<point>();
  for (int i = 0; i <= n; i++){
    int x = center.x + this->R * cos(degrees_to_rads * phi) + dx;
    int y = center.y + this->R * sin(degrees_to_rads * phi) + dy;
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
  if (flag < n){
  //for (int i = 0; i < n; i++){
    filledCircleRGBA(screen, points.at(flag).x-t, points.at(flag).y, t, col.red, col.green, col.blue, col.alpha);
    SDL_Flip(screen);
    flag = flag + 1;
  }
  
  /* eddig elvegzett rajzolasok a kepernyore */
}

Elem Elem::rotate(double u, double v, int delta){
  int alpha_ = alpha + delta;
  int beta_ = beta + delta;
  point center_;
  int x = this->center.x;
  int y = this->center.y;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int x_=((x-u)*cos(degrees_to_rads * delta)+(y-v)*sin(degrees_to_rads * delta))+u;
  int y_=((x-u)*sin(degrees_to_rads * delta)-(y-v)*cos(degrees_to_rads * delta))+v; 
  center_.x = x_;
  center_.y = y_;
  Elem el = Elem(n, this->R, alpha_, beta_, degrees, center_, col, flag);
  return el;
}

Elem Elem::mirror_horizontal(int h){
  point a_;
  int x = this->center.x;
  int y = this->center.y;
  int y_ = h - y;
  a_.x = x;
  a_.y = y_;
  Elem pol = Elem(n, this->R, -alpha, -beta, degrees, a_, col, flag);
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
  Elem pol = Elem(n, this->R, -alpha, -beta, degrees, a_, col_, flag);
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