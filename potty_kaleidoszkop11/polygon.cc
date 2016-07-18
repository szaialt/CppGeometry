#include "polygon.h"

using namespace std;

  Polygon::Polygon(int symmetry, int n, int alpha, int degrees, point p, 
            point b, color col){ 
  this->symmetry = symmetry;
  this->n = n;
  this->alpha = alpha;
  this->degrees = degrees;
  this->center = p;
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

void Polygon::draw(SDL_Surface *screen, int t, int d, int u, int v){
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = degrees/symmetry;
  int gamma = degrees/n;
  point a = polygon(t).at(0);
  int x = a.x;
  int y = a.y;
  if (n > 0){
  int x_step = (a.x - b.x)/n;
  int y_step = (a.y - b.y)/n;
  point c = a;
  
  vector<vector<point> > points; 
  points.push_back(polygon(t));
  for (int j = 1; j < n; j++){
    c.x = c.x + x_step;
    c.y = c.y + y_step;
    Polygon pol = Polygon(symmetry, n, alpha+j*gamma, degrees, center, c, col);
    points.push_back(pol.polygon(t));
  }


  for (int i = 0; i < n; i++){

    for (int j = 0; j < symmetry; j++){
      filledCircleRGBA(screen, points.at(i).at(j).x, 
                       points.at(i).at(j).y, 
                       d, col.red, col.green, col.blue, col.alpha);
     }
    /* eddig elvegzett rajzolasok a kepernyore */
    SDL_Flip(screen);     

    }
  }
}

Polygon Polygon::rotate(int u, int v, int delta){
  int alpha_ = this->alpha + delta;
  point center_;
  point a_;
  point b_;
  int x = this->center.x;
  int y = this->center.y;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int x_=((x-u)*cos(degrees_to_rads * delta)+
       (y-v)*sin(degrees_to_rads * delta))+u;
  int y_=((x-u)*sin(degrees_to_rads * delta)-
       (y-v)*cos(degrees_to_rads * delta))+v; 
  center_.x = x_;
  center_.y = y_;
  x = this->b.x;
  y = this->b.y;
  x_=((x-u)*cos(degrees_to_rads * delta)+
      (y-v)*sin(degrees_to_rads * delta))+u;
  y_=((x-u)*sin(degrees_to_rads * delta)-
      (y-v)*cos(degrees_to_rads * delta))+v; 
  b_.x = x_;
  b_.y = y_;
  
  Polygon pol = Polygon(symmetry, n, alpha_, degrees, center_, 
                        b_, col);
  return pol;
}
/*
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