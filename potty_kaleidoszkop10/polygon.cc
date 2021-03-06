#include "polygon.h"

using namespace std;

  Polygon::Polygon(int symmetry, int n, int alpha, int degrees, point p, 
            point a, point b, color col){ 
  this->symmetry = symmetry;
  this->n = n;
  this->alpha = alpha;
  this->degrees = degrees;
  this->center = p;
  this->a = a;
  this->b = b;
  this->col = col;

}

vector<point> Polygon::polygon(int t, int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  int r = t;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = degrees/symmetry;
  int phi = alpha;
  vector<point> points = vector<point>();
  for (int i = 0; i < symmetry; i++){
    int x = center.x + r * cos(degrees_to_rads * phi) + dx;
    int y = center.y + r * sin(degrees_to_rads * phi) + dy;
    point p;
    p.x = x;
    p.y = y;
    points.push_back(p);
    phi = phi + delta;
  }
  return points;
} 

void Polygon::draw(SDL_Surface *screen, int t, int d){
 
  int x = a.x;
  int y = a.y;
  if (n > 0){

  
  vector<point> points = polygon(t);
  int x_step = (a.x - b.x)/n;
  int y_step = (a.y - b.y)/n;

  for (int i = 0; i < n; i++){
    
    for (int j = 0; j < symmetry; j++){
      filledCircleRGBA(screen, points.at(j).x + (i-1)*x_step, 
                       points.at(j).y + (i-1)*y_step, 
                       d, col.red, col.green, col.blue, col.alpha);
     }
    /* eddig elvegzett rajzolasok a kepernyore */
    SDL_Flip(screen);     
  }

  
  }
}
/*
Polygon Polygon::rotate(int u, int v, int delta){
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
  Polygon pol = Polygon(symmetry, alpha_, degrees_, center_, col_);
  return pol;
}

Polygon Polygon::mirror(int width){
  int wh = width/2;
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
  Polygon pol = Polygon(symmetry, alpha_, degrees_, center_, col_);
  return pol;  
}
*/
color Polygon::getColor(){
  return this->col;
}

void Polygon::setColor(color col){
  this->col = col;
}