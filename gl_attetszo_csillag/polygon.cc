#include "polygon.h"
#include <stdio.h>

using namespace std;

Polygon::Polygon(int n, int alpha, int degrees, int birth_time, point p, color col){
  this->n = n;
  this->alpha = alpha;
  this->degrees = degrees;
  this->birth_time = birth_time;
  this->center = p;
  this->col = col;

}

  
vector<point> Polygon::polygon(double t, int dx, int dy){
  //A vectorban a sokszög csúcsait adja meg
  double r = t;
  double degrees_to_rads = 2 * M_PI / degrees ;
  int delta = degrees/n;
  int phi = alpha;
  vector<point> points = vector<point>();
  for (int i = 0; i <= n; i++){
    double x = r * cos(degrees_to_rads * phi) + dx;
    double y = r * sin(degrees_to_rads * phi) + dy;
    point p;
    p.x = x;
    p.y = y;
    points.push_back(p);
    phi = phi + delta;
  }
  return points;
} 

void Polygon::draw(double t){
  vector<point> points = this->polygon(t);
  cout << "(" << col.red << ", " << col.green;
  cout << ", " << col.blue << ")" << endl;
  glBegin(GL_POLYGON);
  glColor3d(col.red, col.blue, col.green);
  for (int i = 0; i <= n; i++){
    glVertex2d(points.at(i).x, points.at(i).y);
    cout << "\t";
    cout << "(" << points.at(i).x << ", " << points.at(i).y << ")" << endl;
  }
  glEnd();
  glutSwapBuffers();

} 

Polygon Polygon::rotate(int u, int v, int delta){
  int n_ = this->n;
  int alpha_ = this->alpha + delta;
  int degrees_ = this->degrees;
  int birth_time_ = this->birth_time;
  point center_;
  double x = this->center.x;
  double y = this->center.y;
  double degrees_to_rads = -2 * M_PI / degrees ;
  double x_=((x-u)*cos(degrees_to_rads * delta)-(y-v)*sin(degrees_to_rads * delta))+u;
  double y_=((x-u)*sin(degrees_to_rads * delta)-(y-v)*cos(degrees_to_rads * delta))+v; 
  center_.x = x_;
  center_.y = y_;
  color col_ = this->col;
  Polygon pol = Polygon(n_, alpha_, degrees_, birth_time_, center_, col_);
  return pol;
}

color Polygon::getColor(){
  return this->col;
}

point Polygon::getCenter(){
  return this->center;
}

int Polygon::getN(){
  return this->n;
}


void Polygon::setColor(color col){
  this->col = col;
}